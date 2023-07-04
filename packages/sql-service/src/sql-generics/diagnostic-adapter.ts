// @ts-nocheck
import {
  WorkerAccessor,
  CustomCompletionProviderOptions,
  SQLType,
  builtInCompletionType,
} from '../types';
import { IDisposable, Uri } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { LanguageServiceDefaultsImpl } from '../worker/workerManager';
import SQLEditorModel from './model';
// import { goldLogPost } from '../../tools/goldlog';
// import { goldlogType } from '../../tools/goldlog/definition';
import _get from 'lodash/get';
import { getPreviousWord, toDiagnostics, checkCompeleteItem } from './utils/editor';
import { transformOptions } from './utils/request';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

/** 脱敏后，字段名与表名上传替代文案 */
const LOG_ID = '$$ID$$';

// TODO: 历史代码迁移，方法没有被使用，暂时保留
// const debounceHandleParseErrorStorage = _debounce(handleParseErrorStorage, 500);

class DiagnosticsAdapter {
  private _disposables: IDisposable[] = [];
  private _listener: { [uri: string]: IDisposable } = Object.create(null);
  private _Caches;
  private options: CustomCompletionProviderOptions;

  constructor(
    private _languageId: string,
    private _worker: WorkerAccessor,
    defaults: LanguageServiceDefaultsImpl,
    options: CustomCompletionProviderOptions,
  ) {
    this._Caches = [];
    this.options = options;

    const onModelAdd = (model: monaco.editor.IModel): void => {
      let handle: NodeJS.Timeout;
      let modeId = model.getLanguageId();
      if (modeId !== this._languageId) {
        return;
      }

      this._listener[model.uri.toString()] = model.onDidChangeContent(insertText => {
        clearTimeout(handle);
        /** TODO，官方提供的CompletionItem中的Command对象类型有误，无法真正支持回调，先用目前方案 */
        const change = (insertText.changes[0] as any) || {};
        /**
         * 通过change.text中是否包含空格判断是否为批量输入，可能场景为粘贴，初始化
         * 场景为再次打开编辑过的文件时，查找到用户自定义逻辑
         */
        handle = setTimeout(
          () => this._doValidate(model.uri, modeId, (change.text || '').indexOf(' ') > 0),
          1000,
        );
        // this._doValidate(model.uri, modeId, (change.text || '').indexOf(' ') > 0);

        if (change.text === '') {
          /** 删除场景 */
          SQLEditorModel.historyWords.EditingWord = {
            line: change.range.startLineNumber,
            offset: change.range.startColumn - 1,
          };
        } else {
          /** 输入场景 */
          SQLEditorModel.historyWords.EditingWord = {
            line: change.range.startLineNumber,
            offset: change.range.startColumn,
          };
        }

        /** 若内容与补全提示内容相同，认为是使用补全 */
        const completeCond = checkCompeleteItem(SQLEditorModel.prevSuggestions, change.text);
        if (completeCond.isCompelete && !_get(this.options, 'options.skipReport', false)) {
          const previous = getPreviousWord(model.getValue(), change.range);
          // 若为id，则使用$$ID$$代替。
          const current = completeCond.isAsyncItem ? LOG_ID : change.text;
          // goldLogPost([
          //   {
          //     type: goldlogType.hotword,
          //     bizScene: 'aceEditor.parser',
          //     goKey: {
          //       hotwords: `${current}-${previous}`,
          //       id: _languageId,
          //     },
          //   },
          // ]);
        }

        /** 将选中提示的事件透出 */
        if (completeCond.isCompelete) {
          const current = SQLEditorModel.prevSuggestions.asyncItems.find(
            i => String(i?.insertText).toUpperCase() === String(change.text).toUpperCase(),
          );

          if (options.onSuggestionSelect) {
            options.onSuggestionSelect(current);
          }
        }

        /** 针对选择了表后，预请求资源缓存 */
        if (options.query && completeCond.isCompelete && completeCond.isAsyncItem) {
          const current = SQLEditorModel.prevSuggestions.asyncItems.find(
            i => String(i?.insertText).toUpperCase() === String(change.text).toUpperCase(),
          );
          /** 判断是否存在并且有对应的searchKey */
          if (current && current.searchKey) {
            /** 已选中表，预加载字段 */
            let featchKey = current.searchKey + '.';
            const currentTable = SQLEditorModel.visitedTable.find(item => featchKey === item.name);
            /** 判断是否已经被缓存了, 如果已被缓存则不再获取 */
            if (!currentTable) {
              const request = transformOptions(options).request;
              request(featchKey).then(res => {
                let record = {
                  name: featchKey,
                  sqlType: SQLType.DQL,
                  data: _get(res, 'data.entities'),
                };
                SQLEditorModel.visitedTable.push(record);
              });
            }
          }
        }
        /**
         * 针对匹配的内部关键字，做联动提示效果
         */
        if (completeCond.isCompelete && completeCond.isSyncItem) {
          const current = SQLEditorModel.prevSuggestions.syncItems.find(
            i => String(i?.insertText).toUpperCase() === String(change.text).toUpperCase(),
          );
          if (current.kind === options.completionTypes[builtInCompletionType.KEYWORD].kind) {
            // 只有关键字才联动提示
            setTimeout(() => {
              this.options.editorMap
                .get(model.id)
                ?.getContribution('editor.contrib.suggestController')
                // @ts-ignore
                .triggerSuggest();
            }, 0);
          }
        }
      });

      this._doValidate(model.uri, modeId, true, true);
    };

    const onModelRemoved = (model: monaco.editor.IModel): void => {
      monaco.editor.setModelMarkers(model, this._languageId, []);

      let uriStr = model.uri.toString();
      let listener = this._listener[uriStr];
      if (listener) {
        listener.dispose();
        delete this._listener[uriStr];
      }
    };

    this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
    this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
    this._disposables.push(
      monaco.editor.onDidChangeModelLanguage(event => {
        onModelRemoved(event.model);
        onModelAdd(event.model);
      }),
    );

    defaults.onDidChange(_ => {
      monaco.editor.getModels().forEach(model => {
        if (model.getLanguageId() === this._languageId) {
          onModelRemoved(model);
          onModelAdd(model);
        }
      });
    });

    this._disposables.push({
      dispose: () => {
        for (let key in this._listener) {
          this._listener[key].dispose();
        }
      },
    });

    monaco.editor.getModels().forEach(onModelAdd);
  }

  public updateOptions(options) {
    this.options = options;
  }

  public dispose(): void {
    this._disposables.forEach(d => d && d.dispose());
    this._disposables = [];
  }

  private _doValidate(resource: Uri, languageId: string, isBatch: boolean, init = false): void {
    this._worker(resource)
      .then(worker => {
        return worker.doValidation(resource.toString(), {
          options: this.options.options,
          degenerate: this.options.degenerate,
        });
      })
      .then(async info => {
        const { diagnostics, astInfo, authInfo } = info;

        if (authInfo && authInfo.length && this.options.mapAuthInfoToDiagnostic) {
          // 如果开启了权限校验，提供数据给用户自己处理权限信息到 diagnostic 的映射
          const authDiagnostics = (await this.options.mapAuthInfoToDiagnostic(authInfo)).filter(
            Boolean,
          );
          diagnostics.push(...authDiagnostics);
        }

        let markers;
        let model = monaco.editor.getModel(resource);

        /** 抛出 validation 回调，返回值 markers 将作为错误信息数据 */
        if (this.options.onValidation) {
          const tempMarkers = diagnostics.map(d => toDiagnostics(resource, d));
          markers = this.options.onValidation(astInfo?.ast?.cst, tempMarkers);
          if (model.getLanguageId() === languageId) {
            monaco.editor.setModelMarkers(model, languageId, markers);
            return;
          }
        }

        /** model上错误提示 */
        // 【配置项禁用静态检查】时不提示在编辑器上。
        const skipSetModelMarkers = !_get(this.options, 'options.diagnostic', false);
        
        if (!skipSetModelMarkers) {
          markers = diagnostics.map(d => toDiagnostics(resource, d));

          if (model.getLanguageId() === languageId) {
            monaco.editor.setModelMarkers(model, languageId, markers);
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export default DiagnosticsAdapter;
