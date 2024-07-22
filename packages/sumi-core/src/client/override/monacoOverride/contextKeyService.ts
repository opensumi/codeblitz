import { Autowired, Injectable, Injector, INJECTOR_TOKEN, Optional } from '@opensumi/di';
import {
  ContextKeyChangeEvent,
  Disposable,
  Emitter,
  Event,
  getDebugLogger,
  IContextKey,
  IScopedContextKeyService,
} from '@opensumi/ide-core-browser';
import { IConfigurationService } from '@opensumi/monaco-editor-core/esm/vs/platform/configuration/common/configuration';
import { ContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService';
import {
  ContextKeyExpr,
  ContextKeyExpression,
  ContextKeyValue,
  IContextKeyServiceTarget,
} from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey';
export const IScopedContextKeyServiceProxy = Symbol('IScopedContextKeyServiceProxy');
import { IContextKeyService } from '@opensumi/ide-core-browser';
import { isContextKeyService } from '@opensumi/ide-monaco/lib/browser/monaco.context-key.service';
import { KeybindingResolver } from '@opensumi/monaco-editor-core/esm/vs/platform/keybinding/common/keybindingResolver';

// override 传入的是 ScopedContextKeyService

const KEYBINDING_CONTEXT_ATTR = 'data-keybinding-context';

@Injectable()
abstract class BaseContextKeyService extends Disposable implements IContextKeyService {
  protected _onDidChangeContext = new Emitter<ContextKeyChangeEvent>();
  readonly onDidChangeContext: Event<ContextKeyChangeEvent> = this._onDidChangeContext.event;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  public contextKeyService: ContextKeyService;

  constructor() {
    super();
  }

  bufferChangeEvents(callback: Function): void {
    this.contextKeyService.bufferChangeEvents(callback);
  }

  listenToContextChanges() {
    this.addDispose(
      this.contextKeyService.onDidChangeContext((payload) => {
        this._onDidChangeContext.fire(new ContextKeyChangeEvent(payload));
      }),
    );
  }

  createKey<T extends ContextKeyValue = any>(
    key: string,
    defaultValue: T | undefined,
  ): IContextKey<T> {
    return this.contextKeyService.createKey(key, defaultValue);
  }

  getKeysInWhen(when: string | ContextKeyExpression | undefined) {
    let expr: ContextKeyExpression | undefined;
    if (typeof when === 'string') {
      expr = this.parse(when);
    }
    return expr ? expr.keys() : [];
  }

  getContextValue<T>(key: string): T | undefined {
    return this.contextKeyService.getContextKeyValue(key);
  }

  getValue<T>(key: string): T | undefined {
    return this.contextKeyService.getContextKeyValue(key);
  }

  createScoped(target: IContextKeyServiceTarget | ContextKeyService): IScopedContextKeyService {
    if (target && isContextKeyService(target)) {
      return this.injector.get(ScopedContextKeyServiceProxy, [target]);
    } else {
      // monaco 21 开始 domNode 变为必选
      // https://github.com/microsoft/vscode/commit/c88888aa9bcc76b05779edb21c19eb8c7ebac787
      const domNode = target || document.createElement('div');
      const scopedContextKeyService = this.contextKeyService.createScoped(
        domNode as IContextKeyServiceTarget,
      );
      return this.injector.get(ScopedContextKeyServiceProxy, [
        scopedContextKeyService as ContextKeyService,
      ]);
    }
  }

  // cache expressions
  protected expressions = new Map<string, ContextKeyExpression | undefined>();

  parse(when: string | undefined): ContextKeyExpression | undefined {
    if (!when) {
      return undefined;
    }

    let expression = this.expressions.get(when);
    if (!expression) {
      const parsedExpr = ContextKeyExpr.deserialize(when) as unknown;
      expression = parsedExpr ? (parsedExpr as ContextKeyExpression) : undefined;
      this.expressions.set(when, expression);
    }
    return expression;
  }

  dispose() {
    this.contextKeyService.dispose();
  }

  abstract match(expression: string | ContextKeyExpression, context?: HTMLElement | null): boolean;
}

@Injectable({ multiple: true })
export class ScopedContextKeyServiceProxy extends BaseContextKeyService implements IScopedContextKeyService {
  constructor(@Optional() public readonly contextKeyService: ContextKeyService) {
    super();
    this.listenToContextChanges();
  }
  attachToDomNode(domNode: HTMLElement): void {
    if (this.contextKeyService['_domNode']) {
      this.contextKeyService['_domNode'].removeAttribute(KEYBINDING_CONTEXT_ATTR);
    }
    this.contextKeyService['_domNode'] = domNode;
    this.contextKeyService['_domNode'].setAttribute(
      KEYBINDING_CONTEXT_ATTR,
      String(this.contextKeyService['_myContextId']),
    );
  }

  match(expression: string | ContextKeyExpression | undefined): boolean {
    try {
      let parsed: ContextKeyExpression | undefined;
      if (typeof expression === 'string') {
        parsed = this.parse(expression);
      } else {
        parsed = expression;
      }
      // getType 的类型不兼容
      return this.contextKeyService.contextMatchesRules(parsed as any);
    } catch (e) {
      getDebugLogger().error(e);
      return false;
    }
  }
}

@Injectable()
export class MonacoContextKeyServiceOverride extends BaseContextKeyService implements IContextKeyService {
  @Autowired(IConfigurationService)
  protected readonly configurationService: IConfigurationService;

  public readonly contextKeyService: ContextKeyService;

  match(expression: string | ContextKeyExpression | undefined, context?: HTMLElement): boolean {
    try {
      // keybinding 将 html target 传递过来完成激活区域的 context 获取和匹配
      const ctx = context
        || (window.document.activeElement instanceof HTMLElement
          ? window.document.activeElement
          : undefined);
      let parsed: ContextKeyExpression | undefined;
      if (typeof expression === 'string') {
        parsed = this.parse(expression);
      } else {
        parsed = expression;
      }

      // 如果匹配表达式时没有传入合适的 DOM，则使用全局 ContextKeyService 进行表达式匹配
      if (!ctx) {
        return this.contextKeyService.contextMatchesRules(parsed as any);
      }

      // 自行指定 KeybindingResolver.contextMatchesRules 的 Context，来自于当前的激活元素的 Context
      // 如果 ctx 为 null 则返回 0 (应该是根 contextKeyService 的 context_id 即为 global 的 ctx key service)
      // 找到 ctx DOM 上的 context_id 属性 则直接返回
      // 如果找不到 ctx DOM 上的 context_id 返回 NaN
      // 如果遍历到父节点为 html 时，其 parentElement 为 null，也会返回 0
      const keyContext = this.contextKeyService.getContext(ctx);
      return KeybindingResolver['_contextMatchesRules'](keyContext, parsed as any);
    } catch (e) {
      getDebugLogger().error(e);
      return false;
    }
  }

  constructor() {
    super();
    this.contextKeyService = (window as any).contextService || new ContextKeyService(this.configurationService);
    this.listenToContextChanges();
    (window as any).contextService = this.contextKeyService;
  }

  dispose(): void {
    // context 不需要dispose
    // super.dispose();
  }
}

@Injectable({ multiple: true })
export class MonacoScopedContextKeyService implements IScopedContextKeyService {
  injector: Injector;
  constructor(
    @Optional() public readonly contextKeyService: ContextKeyService,
    injector: Injector,
  ) {
    this.injector = injector;
  }
  listenToContextChanges() {
    this.injector.get(ScopedContextKeyServiceProxy).listenToContextChanges();
  }
  get onDidChangeContext(): Event<ContextKeyChangeEvent> {
    return this.injector.get(ScopedContextKeyServiceProxy).onDidChangeContext;
  }
  bufferChangeEvents(callback: Function): void {
    throw new Error('Method not implemented.');
  }
  getValue<T>(key: string): T | undefined {
    throw new Error('Method not implemented.');
  }
  createKey<T extends ContextKeyValue = any>(
    key: string,
    defaultValue: T | undefined,
  ): IContextKey<T> {
    throw new Error('Method not implemented.');
  }
  getKeysInWhen(when: string | ContextKeyExpr | undefined): string[] {
    throw new Error('Method not implemented.');
  }
  getContextValue<T>(key: string): T | undefined {
    throw new Error('Method not implemented.');
  }
  createScoped(
    target?: ContextKeyService | IContextKeyServiceTarget | undefined,
  ): IScopedContextKeyService {
    throw new Error('Method not implemented.');
  }
  parse(when: string | undefined): ContextKeyExpr | undefined {
    throw new Error('Method not implemented.');
  }
  dispose(): void {
    throw new Error('Method not implemented.');
  }
  attachToDomNode(domNode: HTMLElement): void {
    throw new Error('Method not implemented.');
  }

  match(expression: string | ContextKeyExpression | undefined): boolean {
    return this.injector.get(ScopedContextKeyServiceProxy).match(expression);
  }
}
