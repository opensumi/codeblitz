// TODO: difinition 中放了很多不是定义的内容，需治理
import {
  WorkerAccessor,
  builtInCompletionType,
  CompleteType,
  asyncItemsType,
  priority,
  SQLType,
  generateCompleteItem,
  complementedInsertText,
  CustomCompletionProviderOptions,
  SuggestControllerProps,
  CompleteProviderReturnType,
} from '../types';

import {
  Thenable,
  Position,
  CancellationToken,
  Range,
} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import {
  transformOptions,
  wireCancellationToken,
  toTextEdit,
  toRange,
  fromPosition,
} from '../services/utils';
// import { handleTimeAnalysis } from './utils/logger';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import SQLEditorModel from './model';
import {
  peelCstToAtomQuerysWithOtherType,
  peelFromClauseToTableName,
} from '../tools/validationRules/define';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

const completeDegradeTrigger = {
  ODPSSQL: ['.'],
  GQL: ['.'],
};
const completeTrigger = {
  ODPSSQL: [' ', '.', '='],
  GQL: [' ', '.'],
};

async function asyncItemSimpleCaseHandler(
  simpleCase: asyncItemsType,
  options: CustomCompletionProviderOptions
) {
  if (simpleCase.hitCache) {
    return Promise.resolve({
      visitedTableIncrement: undefined,
      items: simpleCase.items?.map((item) => ({
        ...item,
        sortText: priority(item?.label, item?.kind, [], 9),
        insertText: item?.insertText || item?.label,
      })),
    });
  } else if (/* options.query */ false) {
    // const request = transformOptions(options).request;
    // const startFetch = new Date().getTime();
    // try {
    //   const tables = await request(...simpleCase.params);
    //   let visitedTableIncrement;
    //   /**
    //    * 缓存注释
    //    * 根据后端返回的allEntities判定，若为true，则已经获取符合该前缀的所有实体，此时缓存前缀和实体的映射关系
    //    */
    //   /** 只有查表场景，包含第二个参数
    //    * 1. 需要存储sqlType
    //    * 2. 需要自动回填表前缀
    //    */
    //   const sqlType = simpleCase.params[1];
    //   const keyword = simpleCase.params[0];
    //   if (_get(tables, 'data.allEntities')) {
    //     let record = {
    //       name: keyword,
    //       sqlType,
    //       data: _get(tables, 'data.entities'),
    //     };
    //     if (!sqlType) {
    //       delete record.sqlType;
    //     }
    //     visitedTableIncrement = record;
    //   }
    //   const items = (_get(tables, 'data.entities') || []).map(table => {
    //     const item = generateCompleteItem(
    //       table.name,
    //       SQLEditorModel.historyWords.HotWords,
    //       false,
    //       complementedInsertText(
    //         table,
    //         options.completionTypes,
    //         sqlType ? !keyword || keyword.split('.').length < 2 : true,
    //       ),
    //     );
    //     return {
    //       ...item,
    //     };
    //   });
    //   if (_get(options, 'options.monitorTime')) {
    //     // 当通过query参数内置请求时，输出请求接口的时间
    //     console.log('fetch time:', new Date().getTime() - startFetch);
    //   }
    //   return {
    //     visitedTableIncrement,
    //     items,
    //   };
    // } catch (e) {
    //   throw new Error(e);
    // }
  } else {
    /** 用户定义cb场景 */
    let asyncItemsArr: any[] = [];
    const cbType = simpleCase.type;
    // @ts-ignore
    const sqlType = simpleCase.params[1];
    // @ts-ignore

    const keyword = simpleCase.params[0];

    const cacheItem = SQLEditorModel.visitedTable.find(({ name }) => name === keyword);

    if (cacheItem && !options.options.disableAsyncItemCache) {
      asyncItemsArr = cacheItem.data;
    } else {
      if (cbType === CompleteType.table && options.onSuggestTables) {
        asyncItemsArr = await options.onSuggestTables(keyword, { sqlType });
      } else if (cbType === CompleteType.field && options.onSuggestFields) {
        asyncItemsArr = await options.onSuggestFields(keyword);
      } else if (cbType === CompleteType.setParam && options.onSuggestSetParams) {
        asyncItemsArr = await options.onSuggestSetParams(keyword, { sqlType });
      } else if (cbType === CompleteType.setValue && options.onSuggestSetValues) {
        asyncItemsArr = await options.onSuggestSetValues(keyword, { sqlType });
      } else {
        // 如果没有type，那么默认走字段提示
        // @ts-ignore
        asyncItemsArr = await options.onSuggestFields(keyword);
      }
      SQLEditorModel.visitedTable.push({
        name: keyword,
        sqlType: SQLType.DQL,
        data: asyncItemsArr,
      });
    }
    return {
      // 编辑器内部不处理，统一交给业务层处理
      visitedTableIncrement: undefined,
      items: _cloneDeep(asyncItemsArr),
    };
  }
}

// 检查当前异步代码补全是否是字段补全
function checkIsFieldComplete(info: CompleteProviderReturnType) {
  const asyncItems = info.asyncItems || {};
  // @ts-ignore
  const isJoinPart = info.asyncItems?.isJoinPart;
  const fieldComplete = asyncItems.type === CompleteType.field && !isJoinPart;
  return fieldComplete;
}

class CompletionAdapter implements monaco.languages.CompletionItemProvider {
  private options: CustomCompletionProviderOptions;
  private languageId;
  constructor(
    private _worker: WorkerAccessor,
    options: CustomCompletionProviderOptions,
    languageId: string
  ) {
    this.options = options;
    this.languageId = languageId;
  }

  public cleanCache() {
    SQLEditorModel.visitedTable = [];
  }

  public updateOptions(options) {
    this.options = options;
  }

  public get triggerCharacters(): string[] {
    if (this.options.intelligentDegrade) {
      // 智能提示降级
      return completeDegradeTrigger[this.languageId];
    }
    return completeTrigger[this.languageId];
  }

  formatSyncItems = (
    info: CompleteProviderReturnType,
    completionTypes: CustomCompletionProviderOptions['completionTypes']
  ): monaco.languages.CompletionItem[] => {
    if (!info.syncItems) {
      return [];
    }

    return info.syncItems.map((syncItem) => {
      let item: monaco.languages.CompletionItem = {
        label: syncItem.label,
        insertText: syncItem?.insertText || syncItem.label,
        filterText: syncItem.filterText,
        documentation: syncItem.documentation,
        detail: syncItem.detail,
        kind: syncItem.kind,
        insertTextRules: syncItem.insertTextRules,
      } as monaco.languages.CompletionItem;

      if (syncItem.textEdit) {
        // @ts-ignore
        item.range = toRange(syncItem.textEdit.range);
        item.insertText = syncItem.textEdit.text;
      }

      if (syncItem.additionalTextEdits) {
        // @ts-ignore TODO: 可能这句就是有问题的，检查了类型确实不匹配，只能暂时先 ignore @shiluo.dwt
        item.additionalTextEdits = syncItem.additionalTextEdits.map(toTextEdit);
      }

      if (this.options.sorter) {
        item.sortText = this.options.sorter(syncItem.builtInCompletionType);
      }

      // 过滤掉函数和代码片段
      if (syncItem.kind === completionTypes![builtInCompletionType.KEYWORD].kind) {
        // 默认关键词自动增加空格
        item.insertText = item?.insertText + ' ';
      }
      return item;
    });
  };

  // 依赖异步数据的代码提示 items
  getAsyncItems = async (info: CompleteProviderReturnType) => {
    let asyncItemsArr: monaco.languages.CompletionItem[] = [];

    if (info.asyncItems) {
      console.log('asyncItems')
      // 暂存所有提示字段或表名
      if (info.asyncItems.completeType === 'recombination') {
        const resultArray = await Promise.all(
          // @ts-ignore
          info.asyncItems.items.map((item) => asyncItemSimpleCaseHandler(item, this.options))
        );

        resultArray.forEach((result: any) => {
          const { items: simpleCaseItems, visitedTableIncrement } = result;
          asyncItemsArr = asyncItemsArr.concat(simpleCaseItems);
          if (visitedTableIncrement) {
            SQLEditorModel.visitedTable.push(visitedTableIncrement);
          }
        });
      } else {
        console.log('asyncItems')

        const { items: simpleCaseItems, visitedTableIncrement } = await asyncItemSimpleCaseHandler(
          info.asyncItems,
          this.options
        );

        // @ts-ignore
        asyncItemsArr = asyncItemsArr.concat(simpleCaseItems);

        if (visitedTableIncrement) {
          SQLEditorModel.visitedTable.push(visitedTableIncrement);
        }
      }
    }

    return asyncItemsArr;
  };

  provideCompletionItems(
    model: monaco.editor.IReadOnlyModel,
    position: Position,
    context: monaco.languages.CompletionContext,
    token: CancellationToken
  ): Thenable<monaco.languages.CompletionList> {
    const resource = model.uri;
    // @ts-ignore
    return wireCancellationToken(
      token,
      this._worker(resource)
        .then((worker) => {
          return worker.doComplete(
            resource.toString(),
            fromPosition(position),
            this.languageId,
            SQLEditorModel.historyWords,
            SQLEditorModel.visitedTable,
            {
              options: this.options.options,
              completionTypes: this.options.completionTypes,
              lowerCaseComplete: this.options.lowerCaseComplete,
              degenerate: this.options.degenerate,
            }
          );
        })
        .then(async (info: CompleteProviderReturnType) => {
          if (!info) {
            this.options.editorMap
              .get(model.id)
              ?.getContribution<SuggestControllerProps>('editor.contrib.suggestController')
              ?.cancelSuggestWidget();
            // @ts-ignore
            this.options.customizeFieldSuggest(false);
            return;
          }

          // 是否配置了跳过性能分析上报
          const skipCompletionReport = _get(this.options, 'options.skipReport', false);
          if (!skipCompletionReport) {
            // handleTimeAnalysis(info.monitorInfo);
          }

          const syncItems = this.formatSyncItems(info, this.options.completionTypes);
          console.log('info', info);
          const asyncItems = await this.getAsyncItems(info);

          const items = syncItems.concat(asyncItems).filter((item) => item?.label);

          // 缓存提示内容
          SQLEditorModel.prevSuggestions = {
            syncItems,
            asyncItems,
          };

          // 根据autofix，更新现有内容，同时提供下一个token的提示
          if (info.fixedValue) {
            model.applyEdits([
              {
                range: new Range(
                  info.fixedValue.startLineNumber + 1,
                  info.fixedValue.startColumn + 1,
                  info.fixedValue.endLineNumber + 1,
                  info.fixedValue.endColumn + 1
                ),
                text: info.fixedValue.text,
              },
            ]);
          }

          /** webworker无法传入方法，因此将ast透出，在主流程中调用 */
          if (this.options.onParser) {
            this.options.onParser(info.ast);
          }

          // 是否在控制台输出解析 ast 的时间
          const needConsoleParseTime = _get(this.options, 'options.monitorTime');
          if (needConsoleParseTime) {
            console.log('parser time:', _get(info, 'monitorInfo.parseTime', 0));
          }

          // 没有提示内容，关闭提示 widget
          if (items.length === 0) {
            this.options.editorMap
              .get(model.id)
              ?.getContribution<SuggestControllerProps>('editor.contrib.suggestController')
              ?.cancelSuggestWidget();
            return;
          }

          const { onProvideCompletion } = this.options;

          if (onProvideCompletion) {
            onProvideCompletion({
              workerTime: _get(info, 'monitorInfo.workerTime'),
            });
          }
          // 字段补全并用户劫持了补全，交给用户自定义逻辑
          if (checkIsFieldComplete(info) && this.options.customizeFieldSuggest) {
            this.showUserWidget(
              model,
              position,
              info.ast,
              info.currentSqlIndex || 0,
              syncItems,
              info.asyncItems
            );
            return;
          }

          // 当异步内容大于100项时，默认深度查询。
          // 合理的方式应该是onSuggestFileds新增参数标记，由业务控制
          // 但是考虑改动不兼容，先特殊处理
          const incomplete = asyncItems.length > 100;
          const completionItems = items.map((item) => {
            const text = item.insertText || (item.label as string);
            if (text.endsWith(' ')) {
              // 当选中补全后自动再触发补全
              return {
                ...item,
                command: {
                  id: 'editor.action.triggerSuggest',
                },
              }
            }
            return item;
          });
          return {
            incomplete,
            suggestions: completionItems,
          };
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  showUserWidget(
    model: monaco.editor.IReadOnlyModel,
    position: Position,
    ast: any,
    currentSqlIndex: number,
    syncItems: any[],
    asyncItems: any
  ) {
    if (!this.options.customizeFieldSuggest || !ast) return;
    // 清除 monaco 自带提示
    this.options.editorMap
      .get(model.id)
      ?.getContribution<SuggestControllerProps>('editor.contrib.suggestController')
      ?.cancelSuggestWidget();

    // 根据 ast 信息 剥离出 tableNames
    const tableNames = this.extractTableNameFromAst(ast.cst, currentSqlIndex);
    // 根据当前编辑位置，剥离当前用于过滤的关键词 filterKeywords: { text: '', range: Range }
    const currentLineText = model.getValue().split('\n')[position.lineNumber - 1];
    let keywordsText =
      currentLineText.slice(0, position.column - 1).match(/(\,|\(|\s)(\w+)$/)?.[2] || '';

    const keywords: { text: string; range: Range } = {
      text: keywordsText,
      range: new Range(
        position.lineNumber,
        position.column - (keywordsText?.length || 0),
        position.lineNumber,
        position.column
      ),
    };

    //产品需求: 字段智能提示 关键词 只展示 * 和 DISTINCT，函数照常展示
    // 产品需求: 如果上下文是 where，字段智能提示为空
    const syncItemList = asyncItems?.isWhereClause
      ? []
      : syncItems
          .filter((item) => {
            return keywordsText
              ? item.label.toLowerCase().includes(keywordsText.toLowerCase())
              : item;
          })
          .filter(
            (item) =>
              item.detail === '函数' ||
              item.label === '*' ||
              item.label === 'DISTINCT' ||
              item.label === 'distinct'
          );

    // 组件会根据表名、过滤关键词做相关交互
    // 控制自定义组件挂载显示
    this.options.customizeFieldSuggest(
      true,
      tableNames,
      keywords,
      syncItemList,
      asyncItems?.isWhereClause
    );
  }

  extractTableNameFromAst(cst: any, idx: number) {
    const atomQueryExpressions = peelCstToAtomQuerysWithOtherType(cst);
    const queryFromClause = _get(atomQueryExpressions[idx], 'children.fromClause[0]');
    const queryTables = peelFromClauseToTableName(queryFromClause, false, true)?.split(',');
    return queryTables;
  }

  resolveCompletionItem(
    item: monaco.languages.CompletionItem,
    token: CancellationToken
  ): Thenable<monaco.languages.CompletionItem> {
    // 用户可以自己对 completionItem 进行修改，比如异步的获取 doc
    if (this.options.resolveCodeCompletionItem) {
      return this.options.resolveCodeCompletionItem(item);
    }
    return Promise.resolve(item);
  }
}

export default CompletionAdapter;
