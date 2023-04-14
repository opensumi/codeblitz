import { Injector } from '@opensumi/di';
import {
  ContextKeyChangeEvent,
  Event,
  IContextKey,
  IScopedContextKeyService,
} from '@opensumi/ide-core-browser';
import { ContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService';
import {
  ContextKeyValue,
  ContextKeyExpr,
  IContextKeyService,
  IContextKeyServiceTarget,
} from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey';
export const IScopedContextKeyServiceProxy = Symbol('IScopedContextKeyServiceProxy');

// override 传入的是scope

class ScopedContextKeyServiceProxy implements IScopedContextKeyService {
  private injector: Injector | null = null;
  private uid = 0;

  setInjector(injector: Injector) {
    this.injector = injector;
    this.uid++;
    const currentUId = this.uid;
    return {
      dispose: () => {
        if (currentUId === this.uid && this.injector) {
          this.injector = null;
        }
      },
    };
  }

  attachToDomNode(domNode: HTMLElement): void {
    return this.injector!.get(IScopedContextKeyServiceProxy).attachToDomNode(domNode);
  }
  onDidChangeContext: Event<ContextKeyChangeEvent>;
  bufferChangeEvents(callback: Function): void {
    return this.injector!.get(IScopedContextKeyServiceProxy).bufferChangeEvents(callback);
  }
  getValue<T>(key: string): T | undefined {
    return this.injector!.get(IScopedContextKeyServiceProxy).getValue(key);
  }
  createKey<T extends ContextKeyValue = any>(
    key: string,
    defaultValue: T | undefined
  ): IContextKey<T> {
    return this.injector!.get(IScopedContextKeyServiceProxy).createKey(key, defaultValue);
  }
  match(
    expression: string | ContextKeyExpr | undefined,
    context?: HTMLElement | null | undefined
  ): boolean {
    return this.injector!.get(IScopedContextKeyServiceProxy).match(expression, context);
  }
  getKeysInWhen(when: string | ContextKeyExpr | undefined): string[] {
    return this.injector!.get(IScopedContextKeyServiceProxy).getKeysInWhen(when);
  }
  getContextValue<T>(key: string): T | undefined {
    return this.injector!.get(IScopedContextKeyServiceProxy).getContextValue(key);
  }
  contextKeyService: IContextKeyService;
  createScoped(
    target?: ContextKeyService | IContextKeyServiceTarget | undefined
  ): IScopedContextKeyService {
    return this.injector!.get(IScopedContextKeyServiceProxy).createScoped(target);
  }
  parse(when: string | undefined): ContextKeyExpr | undefined {
    throw new Error('Method not implemented.');
  }
  dispose(): void {
    throw new Error('Method not implemented.');
  }
}

export const monacoTextModelServiceProxy = new ScopedContextKeyServiceProxy();
