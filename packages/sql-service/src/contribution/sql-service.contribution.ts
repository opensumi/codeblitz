import { Provider, Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  ClientAppContribution,
  IClientApp,
  MaybePromise,
  URI,
} from '@opensumi/ide-core-browser';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { ITextmateTokenizer } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import type { ITextmateTokenizerService } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import { ISQLServiceConfig } from './sql-service.configuration';
import {
  CustomCompletionProviderOptions,
  CustomEditorInstance,
  languageGrammer,
  languageRegister,
  supportLanguage,
} from '../types';
import type { CompletionProviderOptions } from '../types';
import { LanguageServiceDefaultsImpl, WorkerManager } from '../worker/workerManager';
// import { WorkerAccessor } from './types';

import { Uri } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { globalConfig } from '../config';
import { SQLGenericsFeatures } from '../sql-generics/';
import { DiagnosticsOptions } from '../worker/types';
@Injectable()
@Domain(ClientAppContribution)
export class SqlServiceContribution implements ClientAppContribution {
  @Autowired(ISQLServiceConfig)
  sqlConfig: CompletionProviderOptions;
  @Autowired(ITextmateTokenizer)
  textmateService: ITextmateTokenizerService;

  // initialize() {
  //   this.setMonacoEnvironment();
  // }

  onDidStart(app: IClientApp): MaybePromise<void> {
    this.registerLanguage(supportLanguage.ODPSSQL);
    const editorMap = new Map<string, CustomEditorInstance>();

    const config = Object.assign(this.sqlConfig, {
      udf: [],
      editorMap,
    });
    const diagnosticDefault: DiagnosticsOptions = {
      validate: true,
      allowComments: true,
      lint: {
        compatibleVendorPrefixes: 'ignore',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore',
      },
    };

    this.setUp(
      new LanguageServiceDefaultsImpl(supportLanguage.ODPSSQL, diagnosticDefault),
      false,
      config
    );
  }

  registerLanguage(languageId: supportLanguage) {
    // 仅占位
    const uri = new URI();
    this.textmateService.registerLanguages([languageRegister[languageId]], uri);
    this.textmateService.registerGrammar(languageGrammer[languageId], uri);
  }

  setUp(
    defaults: LanguageServiceDefaultsImpl,
    isDiffEditor: boolean,
    options: CustomCompletionProviderOptions
  ) {
    const client = new WorkerManager(defaults, options?.onWokerLoad);
    const worker = (first: Uri, ...more: Uri[]): Promise<any> => {
      return client.getLanguageServiceWorker(...[first].concat(more));
    };
    let languageId = defaults.languageId;
    if (globalConfig[languageId]?.tokens) {
      const tokens: monaco.languages.IMonarchLanguage =
        typeof globalConfig[languageId].tokens === 'function'
          ? globalConfig[languageId].tokens(options?.options?.monarchSetting)
          : globalConfig[languageId].tokens;
      monaco.languages.setMonarchTokensProvider(languageId, tokens);
    }

    let CompletionAdapter = new SQLGenericsFeatures.CompletionAdapter(worker, options, languageId);
    let DiagnosticsAdapter = new SQLGenericsFeatures.DiagnosticsAdapter(
      languageId,
      worker,
      defaults,
      options
    );
    monaco.languages.registerCompletionItemProvider(languageId, CompletionAdapter);

    monaco.languages.registerHoverProvider(
      languageId,
      new SQLGenericsFeatures.HoverAdapter(worker, options)
    );

    monaco.languages.registerDocumentFormattingEditProvider(
      languageId,
      new SQLGenericsFeatures.DocumentFormattingEditAdapter(worker, options)
    );

    // 目前就支持ODPS，其余到时看需求扩展，需要对应work增加内容
    monaco.languages.registerDefinitionProvider(
      languageId,
      new SQLGenericsFeatures.DefinitionAdapter(worker, options)
    );
    // autofix 仅支持ODPS先
    monaco.languages.registerCodeActionProvider(
      languageId,
      new SQLGenericsFeatures.CodeActionProvider(worker, options)
    );

    // ODPS 注册函数参数提示
    monaco.languages.registerSignatureHelpProvider(
      languageId,
      new SQLGenericsFeatures.SignatureHelpAdapter(worker, options)
    );

    // /** 选中内容格式化 */
    // monaco.languages.registerDocumentRangeFormattingEditProvider(
    //   languageId,
    //   new SQLGenericsFeatures.DocumentRangeFormattingEditAdapter(worker, options)
    // );
  }
}
