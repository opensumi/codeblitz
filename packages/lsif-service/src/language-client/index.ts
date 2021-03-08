import { Autowired, Injectable, ConstructorOf } from '@ali/common-di';
import * as vscode from 'vscode';
import {
  DocumentSelector,
  HoverProvider,
  CancellationToken,
  DefinitionProvider,
  ReferenceProvider,
  FoldingRangeProvider,
  CodeLensProvider,
} from 'vscode';
import {
  SerializedDocumentFilter,
  Hover,
  Position,
  Definition,
  DefinitionLink,
  ReferenceContext,
  Location,
  FoldingContext,
  FoldingRange,
  CodeLensSymbol,
} from '@ali/ide-kaitian-extension/lib/common/vscode/model.api';
import {
  ExtensionDocumentDataManager,
  IExtHostLanguages,
} from '@ali/ide-kaitian-extension/lib/common/vscode';
import {
  Uri,
  URI,
  LRUMap,
  DisposableCollection,
  Emitter,
  DisposableStore,
} from '@ali/ide-core-common';
import { Disposable } from '@ali/ide-kaitian-extension/lib/common/vscode/ext-types';

import { DefinitionAdapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/language/definition';
import { HoverAdapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/language/hover';
import { ReferenceAdapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/language/reference';
import { Adapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/ext.host.language';
import { FoldingProviderAdapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/language/folding';
import { CodeLensAdapter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/language/lens';
import { CommandsConverter } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/ext.host.command';

import { ExtHostDocumentData } from '@ali/ide-kaitian-extension/lib/hosted/api/vscode/doc/ext-data.host';
import { IEditorDocumentModelService } from '@ali/ide-editor/lib/browser';
import { DocumentFilter } from 'vscode-languageserver-protocol';
import { fromLanguageSelector } from '@ali/ide-kaitian-extension/lib/common/vscode/converter';
import { MonacoModelIdentifier, testGlob } from '@ali/ide-kaitian-extension/lib/common/vscode';
import { LanguageSelector } from '@ali/ide-kaitian-extension/lib/common/vscode/model.api';
import { CommandDto } from '@ali/ide-kaitian-extension/lib/common/vscode/scm';

@Injectable()
class LiteDocumentDataManager implements Partial<ExtensionDocumentDataManager> {
  @Autowired(IEditorDocumentModelService)
  private readonly docManager: IEditorDocumentModelService;

  getDocumentData(path: Uri | string) {
    const docRef = this.docManager.getModelReference(new URI(path));
    if (!docRef) {
      return undefined;
    }

    const model = docRef.instance.getMonacoModel();

    const docModel = {
      lines: model.getLinesContent(),
      eol: docRef.instance.eol,
      languageId: docRef.instance.languageId,
      versionId: model.getVersionId(),
      dirty: docRef.instance.dirty,
    };

    return new ExtHostDocumentData(
      {
        $trySaveDocument() {
          return docRef.instance.save();
        },
      } as any,
      typeof path === 'string' ? Uri.parse(path) : path,
      docModel.lines,
      docModel.eol,
      docModel.languageId,
      docModel.versionId,
      docModel.dirty
    );
  }
}

/**
 * IExtHostLanguages 的简单实现
 * 主要保留以下几个 API 供 lsif 服务使用
 *  * registerHoverProvider
 *  * registerDefinitionProvider
 *  * registerReferenceProvider
 */
@Injectable()
export class SimpleLanguageService implements Partial<IExtHostLanguages> {
  private callId = 0;
  private adaptersMap = new Map<number, Adapter>();
  private readonly disposables = new Map<number, monaco.IDisposable>();

  private languageFeatureEnabled = new LRUMap<string, boolean>(200, 100);

  @Autowired(LiteDocumentDataManager)
  private readonly documents: ExtensionDocumentDataManager;

  private nextCallId(): number {
    return this.callId++;
  }

  private createDisposable(callId: number): Disposable {
    return new Disposable(() => {
      this.adaptersMap.delete(callId);
      this.disposables.get(callId)?.dispose();
      this.disposables.delete(callId);
    });
  }

  private addNewAdapter(adapter: Adapter): number {
    const callId = this.nextCallId();
    this.adaptersMap.set(callId, adapter);
    return callId;
  }

  // tslint:disable-next-line:no-any
  private withAdapter<A, R>(
    handle: number,
    constructor: ConstructorOf<A>,
    callback: (adapter: A) => Promise<R>
  ): Promise<R> {
    const adapter = this.adaptersMap.get(handle);
    if (!(adapter instanceof constructor)) {
      return Promise.reject(new Error('no adapter found'));
    }
    return callback(adapter as A);
  }

  private transformDocumentSelector(selector: vscode.DocumentSelector): SerializedDocumentFilter[] {
    if (Array.isArray(selector)) {
      return selector.map((sel) => this.doTransformDocumentSelector(sel)!);
    }

    return [this.doTransformDocumentSelector(selector)!];
  }

  private doTransformDocumentSelector(
    selector: string | vscode.DocumentFilter
  ): SerializedDocumentFilter | undefined {
    if (typeof selector === 'string') {
      return {
        $serialized: true,
        language: selector,
      };
    }

    if (selector) {
      return {
        $serialized: true,
        language: selector.language,
        scheme: selector.scheme,
        pattern: selector.pattern,
      };
    }

    return undefined;
  }

  async getLanguages(): Promise<string[]> {
    return this.$getLanguages();
  }

  // ### Folding begin
  registerFoldingRangeProvider(
    selector: DocumentSelector,
    provider: FoldingRangeProvider
  ): Disposable {
    const callId = this.addNewAdapter(new FoldingProviderAdapter(this.documents, provider));
    this.$registerFoldingProvider(callId, this.transformDocumentSelector(selector));
    return this.createDisposable(callId);
  }

  $foldingRange(
    handle: number,
    model: monaco.editor.ITextModel,
    context: FoldingContext,
    token: CancellationToken
  ): Promise<FoldingRange[] | undefined> {
    return this.withAdapter(handle, FoldingProviderAdapter, (adapter) =>
      adapter.provideFoldingRanges(model.uri, context, token)
    );
  }

  $registerFoldingProvider(handle: number, selector: SerializedDocumentFilter[]): void {
    const languageSelector = fromLanguageSelector(selector);
    const foldingProvider = this.createFoldingProvider(handle, languageSelector);
    const disposable = new DisposableCollection();
    // FIXME: 如果这种方式存在性能问题，则将注册 pattern 的方式改为通过 language id 进行注册
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerFoldingRangeProvider(language, foldingProvider));
    }

    this.disposables.set(handle, disposable);
  }

  protected createFoldingProvider(
    handle: number,
    selector?: LanguageSelector
  ): monaco.languages.FoldingRangeProvider {
    return {
      provideFoldingRanges: (model, context, token) => {
        if (!this.matchModel(selector, MonacoModelIdentifier.fromModel(model))) {
          return undefined!;
        }
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        return this.$foldingRange(handle, model, context, token).then((v) => v!);
      },
    };
  }
  // ### Folding end

  // ### Hover begin
  registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable {
    const callId = this.addNewAdapter(new HoverAdapter(provider, this.documents));
    this.$registerHoverProvider(callId, this.transformDocumentSelector(selector));
    return this.createDisposable(callId);
  }

  $provideHover(
    handle: number,
    resource: any,
    position: Position,
    token: CancellationToken
  ): Promise<Hover | undefined> {
    return this.withAdapter(handle, HoverAdapter, (adapter) =>
      adapter.provideHover(resource, position, token)
    );
  }

  $registerHoverProvider(handle: number, selector: SerializedDocumentFilter[]): void {
    const languageSelector = fromLanguageSelector(selector);
    const hoverProvider = this.createHoverProvider(handle, languageSelector);
    const disposable = new DisposableCollection();
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerHoverProvider(language, hoverProvider));
    }

    this.disposables.set(handle, disposable);
  }

  protected createHoverProvider(
    handle: number,
    selector?: LanguageSelector
  ): monaco.languages.HoverProvider {
    return {
      provideHover: (model, position, token) => {
        if (!this.matchModel(selector, MonacoModelIdentifier.fromModel(model))) {
          return undefined!;
        }
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        return this.$provideHover(handle, model.uri, position, token).then((v) => v!);
      },
    };
  }
  // ### Hover end

  // ### Definition provider begin
  registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable {
    const callId = this.addNewAdapter(new DefinitionAdapter(provider, this.documents));
    this.$registerDefinitionProvider(callId, this.transformDocumentSelector(selector));
    return this.createDisposable(callId);
  }

  $provideDefinition(
    handle: number,
    resource: Uri,
    position: Position,
    token: CancellationToken
  ): Promise<Definition | DefinitionLink[] | undefined> {
    return this.withAdapter(handle, DefinitionAdapter, (adapter) =>
      adapter.provideDefinition(resource, position, token)
    );
  }

  $registerDefinitionProvider(handle: number, selector: SerializedDocumentFilter[]): void {
    const languageSelector = fromLanguageSelector(selector);
    const definitionProvider = this.createDefinitionProvider(handle, languageSelector);
    const disposable = new DisposableCollection();
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerDefinitionProvider(language, definitionProvider));
    }
    this.disposables.set(handle, disposable);
  }

  protected createDefinitionProvider(
    handle: number,
    selector: LanguageSelector | undefined
  ): monaco.languages.DefinitionProvider {
    return {
      provideDefinition: async (model, position, token) => {
        if (!this.matchModel(selector, MonacoModelIdentifier.fromModel(model))) {
          return undefined!;
        }
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        const result = await this.$provideDefinition(handle, model.uri, position, token);
        if (!result) {
          return undefined!;
        }
        if (Array.isArray(result)) {
          const definitionLinks: monaco.languages.LocationLink[] = [];
          for (const item of result) {
            definitionLinks.push({ ...item, uri: monaco.Uri.revive(item.uri) });
          }
          return definitionLinks as monaco.languages.LocationLink[];
        } else {
          // single Location
          return {
            uri: monaco.Uri.revive(result.uri),
            range: result.range,
          } as monaco.languages.Definition;
        }
      },
    };
  }
  // ### Definition provider end

  // ### Code Reference Provider begin
  registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable {
    const callId = this.addNewAdapter(new ReferenceAdapter(provider, this.documents));
    this.$registerReferenceProvider(callId, this.transformDocumentSelector(selector));
    return this.createDisposable(callId);
  }

  $provideReferences(
    handle: number,
    resource: Uri,
    position: Position,
    context: ReferenceContext,
    token: CancellationToken
  ): Promise<Location[] | undefined> {
    return this.withAdapter(handle, ReferenceAdapter, (adapter) =>
      adapter.provideReferences(resource, position, context, token)
    );
  }

  $registerReferenceProvider(handle: number, selector: SerializedDocumentFilter[]): void {
    const languageSelector = fromLanguageSelector(selector);
    const referenceProvider = this.createReferenceProvider(handle, languageSelector);
    const disposable = new DisposableCollection();
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerReferenceProvider(language, referenceProvider));
    }
    this.disposables.set(handle, disposable);
  }

  protected createReferenceProvider(
    handle: number,
    selector: LanguageSelector | undefined
  ): monaco.languages.ReferenceProvider {
    return {
      provideReferences: (model, position, context, token) => {
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        if (!this.matchModel(selector, MonacoModelIdentifier.fromModel(model))) {
          return undefined!;
        }
        return this.$provideReferences(handle, model.uri, position, context, token).then(
          (result) => {
            if (!result) {
              return undefined!;
            }

            if (Array.isArray(result)) {
              const references: monaco.languages.Location[] = [];
              for (const item of result) {
                references.push({ ...item, uri: monaco.Uri.revive(item.uri) });
              }
              return references;
            }

            return undefined!;
          }
        );
      },
    };
  }
  // ### Code Reference Provider end

  // ### Code Folding Provider start
  $registerFoldingRangeProvider(handle: number, selector: SerializedDocumentFilter[]): void {
    const languageSelector = fromLanguageSelector(selector);
    const provider = this.createFoldingRangeProvider(handle, languageSelector);
    const disposable = new DisposableCollection();
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerFoldingRangeProvider(language, provider));
    }
    this.disposables.set(handle, disposable);
  }

  createFoldingRangeProvider(
    handle: number,
    selector: LanguageSelector | undefined
  ): monaco.languages.FoldingRangeProvider {
    return {
      provideFoldingRanges: (model, context, token) => {
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        if (!this.matchModel(selector, MonacoModelIdentifier.fromModel(model))) {
          return undefined!;
        }
        return this.$provideFoldingRange(handle, model.uri, context, token).then((v) => {
          return v!;
        });
      },
    };
  }

  $provideFoldingRange(
    handle: number,
    resource: Uri,
    context: FoldingContext,
    token: CancellationToken
  ): Promise<FoldingRange[] | undefined> {
    return this.withAdapter(handle, FoldingProviderAdapter, (adapter) =>
      adapter.provideFoldingRanges(resource, context, token)
    );
  }
  // ### Code Folding Provider end

  // ### Code Codelens Provider start
  private codeLensMockCommandsConverter: Pick<CommandsConverter, 'toInternal'> = {
    toInternal: function (command: vscode.Command | undefined, disposables: DisposableStore) {
      if (!command) {
        return undefined;
      }

      const result: CommandDto = {
        $ident: undefined,
        id: command.command,
        title: command.title,
        tooltip: command.tooltip,
        arguments: command.arguments,
      };

      return result;
    },
  };

  registerCodeLensProvider(selector: DocumentSelector, provider: CodeLensProvider): Disposable {
    const callId = this.addNewAdapter(
      new CodeLensAdapter(
        provider,
        this.documents,
        this.codeLensMockCommandsConverter as CommandsConverter
      )
    );
    this.$registerCodeLensSupport(callId, this.transformDocumentSelector(selector), callId);
    return this.createDisposable(callId);
  }

  $registerCodeLensSupport(
    handle: number,
    selector: SerializedDocumentFilter[],
    eventHandle: number
  ): void {
    const languageSelector = fromLanguageSelector(selector);
    const lensProvider = this.createCodeLensProvider(handle, languageSelector);

    if (typeof eventHandle === 'number') {
      const emitter = new Emitter<monaco.languages.CodeLensProvider>();
      this.disposables.set(eventHandle, emitter);
      lensProvider.onDidChange = emitter.event;
    }

    const disposable = new DisposableCollection();
    for (const language of this.getUniqueLanguages()) {
      disposable.push(monaco.languages.registerCodeLensProvider(language, lensProvider));
    }
    this.disposables.set(handle, disposable);
  }

  createCodeLensProvider(
    handle: number,
    selector: LanguageSelector | undefined
  ): monaco.languages.CodeLensProvider {
    return {
      provideCodeLenses: (model, token) => {
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        return this.$provideCodeLenses(handle, model.uri).then((v) => v!);
      },
      resolveCodeLens: (model, codeLens, token) => {
        if (!this.isLanguageFeatureEnabled(model)) {
          return undefined!;
        }
        return this.$resolveCodeLens(handle, model.uri, codeLens).then((v) => v!);
      },
    };
  }

  // tslint:disable-next-line:no-any
  $emitCodeLensEvent(eventHandle: number, event?: any): void {
    const obj = this.disposables.get(eventHandle);
    if (obj instanceof Emitter) {
      obj.fire(event);
    }
  }

  $provideCodeLenses(handle: number, resource: Uri): Promise<CodeLensSymbol[] | undefined> {
    return this.withAdapter(handle, CodeLensAdapter, (adapter) =>
      adapter.provideCodeLenses(resource)
    );
  }

  $resolveCodeLens(
    handle: number,
    resource: Uri,
    symbol: CodeLensSymbol
  ): Promise<CodeLensSymbol | undefined> {
    return this.withAdapter(handle, CodeLensAdapter, (adapter) =>
      adapter.resolveCodeLens(resource, symbol)
    );
  }

  // ### Code Codelens Provider end

  protected getUniqueLanguages(): string[] {
    const languages: string[] = [];
    // 会有重复
    const allLanguages = monaco.languages.getLanguages().map((l) => l.id);
    for (const language of allLanguages) {
      if (languages.indexOf(language) === -1) {
        languages.push(language);
      }
    }
    return languages;
  }

  protected matchLanguage(selector: LanguageSelector | undefined, languageId: string): boolean {
    if (Array.isArray(selector)) {
      return selector.some((filter) => this.matchLanguage(filter, languageId));
    }

    if (DocumentFilter.is(selector)) {
      return !selector.language || selector.language === languageId;
    }

    return selector === languageId;
  }

  protected matchModel(
    selector: LanguageSelector | undefined,
    model: MonacoModelIdentifier
  ): boolean {
    if (Array.isArray(selector)) {
      return selector.some((filter) => this.matchModel(filter, model));
    }
    if (DocumentFilter.is(selector)) {
      if (!!selector.language && selector.language !== model.languageId) {
        return false;
      }
      if (!!selector.scheme && selector.scheme !== model.uri.scheme) {
        return false;
      }
      if (!!selector.pattern && !testGlob(selector.pattern, model.uri.path)) {
        return false;
      }
      return true;
    }
    return selector === model.languageId;
  }

  isLanguageFeatureEnabled(model: monaco.editor.ITextModel) {
    const uriString = model.uri.toString();
    if (!this.languageFeatureEnabled.has(uriString)) {
      this.languageFeatureEnabled.set(uriString, model.getValueLength() < 2 * 1024 * 1024);
    }
    return this.languageFeatureEnabled.get(uriString);
  }

  $getLanguages(): string[] {
    return monaco.languages.getLanguages().map((l) => l.id);
  }
}
