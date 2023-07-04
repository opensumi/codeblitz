import { Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  ClientAppContribution,
  IClientApp,
  MaybePromise,
  URI,
  WithEventBus,
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
import { AppConfig, RuntimeConfig } from '@alipay/alex-core';

import { Uri } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { globalConfig } from '../config';
import { SQLGenericsFeatures } from '../sql-generics/';
import { DiagnosticsOptions } from '../worker/types';
import { IFileServiceClient, FileChangeType } from '@opensumi/ide-file-service/lib/common';
import * as path from 'path';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import {
  BrowserEditorContribution,
  IEditorDocumentModelService,
} from '@opensumi/ide-editor/lib/browser';
import { PreferenceService } from '@opensumi/ide-core-browser';

@Injectable()
@Domain(ClientAppContribution, BrowserEditorContribution)
export class SqlServiceContribution
  extends WithEventBus
  implements ClientAppContribution, BrowserEditorContribution
{
  @Autowired(ISQLServiceConfig)
  sqlConfig: CompletionProviderOptions;

  @Autowired(ITextmateTokenizer)
  textmateService: ITextmateTokenizerService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  @Autowired(WorkbenchEditorService)
  private readonly editorService: WorkbenchEditorServiceImpl;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(IEditorDocumentModelService)
  private editorDocumentModelService: IEditorDocumentModelService;

  initialize() {
    type EventType = { uri: string; filepath: string };
    this.addDispose(
      this.fileService.onFilesChanged((changes) => {
        const changed: EventType[] = [];

        for (const change of changes) {
          const relativePath = this.getWorkspaceRelativePath(new URI(change.uri));
          if (relativePath === null) {
            continue;
          }
          const obj: EventType = { uri: change.uri, filepath: relativePath };
          switch (change.type) {
            case FileChangeType.UPDATED:
              changed.push(obj);
              break;
            default:
              break;
          }
        }
        if (changed.length && this.sqlConfig?.onChange) {
          // TODO: 直接返回 buffer? 编码假定为 utf8 了
          Promise.all(
            changed.map(async ({ uri, filepath }) => {
              const { content } = await this.fileService.resolveContent(uri);
              return {
                filepath,
                content,
              };
            })
          )
            .then((data) => {
              this.sqlConfig.onChange?.(data);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
    );
  }

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

  onDidRestoreState() {
    this.addDispose(
      this.preferenceService.onPreferencesChanged((e) => {
        const encoding = e['files.encoding'];
        if (encoding && encoding.newValue !== encoding.oldValue) {
          const resource = this.editorService.currentResource;
          if (resource) {
            this.editorDocumentModelService.changeModelOptions(resource.uri, {
              encoding: encoding.newValue,
            });
          }
        }
      })
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
    monaco.languages.registerDocumentRangeFormattingEditProvider(
      languageId,
      new SQLGenericsFeatures.DocumentRangeFormattingEditAdapter(worker, options)
    );
  }

  getWorkspaceRelativePath(uri: URI): string | null {
    const absolutePath = uri.codeUri.path;
    const { workspaceDir } = this.appConfig;
    if (!absolutePath.startsWith(workspaceDir)) {
      return null;
    }
    return path.relative(this.appConfig.workspaceDir, absolutePath);
  }
}
