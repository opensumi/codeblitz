'use strict';
import { Thenable, worker } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api.d';
import IWorkerContext = worker.IWorkerContext;
import { initialize } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.worker';
import { TableAuthResponse } from '../tools/validationRules/TableAuth';

import * as ls from 'vscode-languageserver-types';
// import _find from 'lodash/find';
// import _filter from 'lodash/filter';
// import _flatten from 'lodash/flatten';
// import _isEmpty from 'lodash/isEmpty';
// import _union from 'lodash/union';
// import _uniq from 'lodash/uniq';
// import _get from 'lodash/get';
// import _orderByget from 'lodash/orderBy';
// import _flattenDeep from 'lodash/flattenDeep';
// import _findLast from 'lodash/findLast';
// import _orderBy from 'lodash/orderBy';
import { validateGroupBy, validateSelectAll, validateTableAuth } from '../tools/validationRules';
import { functionTypeTextMap } from '../sql-functions/odps/definitions';
import { InputStream, CommonTokenStream } from 'antlr4';

import { SymSpell } from '../tools/autofix/SymSpell';
import { dictionary, wordList, maxLength } from '../tools/autofix/sqlDict';
import {
  SQLType,
  translateLabel,
  IgnoreLabel,
  generateCompleteItem,
  EscapeLabel,
  ODPSFunction,
  CompletionProviderOptions,
  IType,
  CompleteProviderReturnType,
  builtInCompletionType,
  ICreateData,
  ValidationReturnType,
  ODPSSnippetsMap,
  ValidationRules,
  CompleteType,
} from '../types';

import { parseGenerator } from 'bravo-parser/lib/sql-parser';
import * as sqlPrettier from 'sql-prettier';
// import { Parser, Lexer, SyntaxKind, Tokens } from 'bravo-parser/lib/sql-parser/ODPS/parser.g';

import { OB3XParserLexer as Lexer, OB3XParserParser as Parser } from '../parser/db-parser/index';

import { createUtils } from 'bravo-parser/lib/utils';
import { parseErrorChecker } from '../tools/parserChecker';
import {
  buildError,
  Range,
  hasPotentialIds,
  AnalyzeQueryStatement,
  getFilteredNode,
  ParserManage,
  getFunctionDetail,
  calculateHoverFuncName,
} from './utils';

self.onmessage = () => {
  // ignore the first message
  initialize((ctx, createData) => {
    return new OBWorker(ctx, createData);
  });
};

class OBWorker {

  private _ctx: IWorkerContext;
  private parser: ParserManage;
  private languageId: string;
  private tokens: any;
  private utils: any;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this.languageId = createData.languageId;
    /** Lexer方法耗时2s，注意缓存 */
    // this.parser = new ParserManage(parseGenerator(Parser, Lexer));
    const tokens = new CommonTokenStream(Lexer);
    const parser = new Parser(tokens);
    // this.parser = new Parser();
    // this.utils = createUtils(SyntaxKind, createData.languageTokens, Tokens);
    this.tokens = createData.languageTokens;
    console.log(tokens, parser);


    console.log('lexer ==> ',Lexer)
    console.log('tokens ==> ',tokens)
    console.log('parser ==> ',parser)

  }


  // async doComplete(
  //   uri: string,
  //   position: ls.Position,
  //   languageId,
  //   Global,
  //   visitedTable,
  //   options: CompletionProviderOptions,
  // ): Promise<CompleteProviderReturnType> {
  //   try {
  //     let { document } = this._getTextDocument(uri);
  //     const text = document.getText();
  //     // const final = this.transformOptions(options);
  //     /** 当前keyword用于进行退化场景的查找 */
  //     const { keyword, current, duplicateTrigger } = this.positionKeyWord(text, position);
  //     let fixedValue;

  //     if (options.degenerate) {
  //       return Promise.resolve({
  //         isIncomplete: true,
  //         fixedValue,
  //         asyncItems: {
  //           hitCache: false,
  //           params: [keyword, SQLType.DQL],
  //           // 类型待定
  //         },
  //       });
  //     }

  //     /** autofix场景 */
  //     if (_get(options, 'options.autofix')) {
  //       /** preKeyword用于在输入空格时对上一个keyword autofix */
  //       const { keyword: preKeyword, startPos, endPos } = this.positionKeyWord(text, {
  //         ...position,
  //         character: position.character - 1,
  //       });
  //       /** 多个空格时，不需要重复fix，因为在输入第一个空格时，已经完成了对前一个关键词的fix */
  //       if (current === ' ' && preKeyword !== ' ') {
  //         const syncItems = await this.getPreTokenTips(
  //           document,
  //           text,
  //           position,
  //           languageId,
  //           options,
  //           Global,
  //           {
  //             preKeyword,
  //             startPos,
  //             endPos,
  //           },
  //         );
  //         const suggestion = this.triggerAutofix(preKeyword, syncItems);
  //         /** 找到合适的替换方案之后，选择distance最近的方案进行替换， 同时不重复替换 */
  //         if (suggestion) {
  //           fixedValue = {
  //             startLineNumber: position.line,
  //             startColumn: startPos,
  //             endLineNumber: position.line,
  //             endColumn: endPos,
  //             text: preKeyword[0] >= 'a' ? suggestion.toLowerCase() : suggestion.toUpperCase(),
  //           };
  //         }
  //       }
  //     }

  //     const startTime = new Date().getTime();

  //     const ast = await this.parser.parse(text, true, position);
  //     /** 额外获取补全信息的接口，基于光标位置构建ast，提供补全信息 */
  //     const completeErrors = ast.nextToken;

  //     console.log('==> ast', ast, completeErrors)
  //     /** 语法解析时长 */
  //     const parseTime = new Date().getTime() - startTime;

  //     /** .之后输入空格，不触发补全 */
  //     if (duplicateTrigger) {
  //       return Promise.resolve({
  //         isIncomplete: false,
  //         fixedValue,
  //         ast,
  //       });
  //     }

  //     /** 获取ddl创建的参数别名map*/
  //     const ddlMap = [];
  //     // this.utils.getViewDetails(ast.cst);

  //     /** 全部补全error */
  //     let flattenError = [] as any[];
  //     /** 提供给monaco的补全项 */
  //     let syncItems = [] as any[];
  //     /** 异步场景查询参数 */
  //     let asyncItems;

  //     /** 两类补全信息
  //      * 1. 基于ast，提供必选字段的补全信息，包含完整补全信息，ast.parserError
  //      *    (用于如select from 等场景下nextToken计算不出的问题，基于必填项的报错内容)
  //      * 2. 官方api，提供可选字段的补全信息，仅包含补全类型，nextToken
  //      */
  //     const errors = this.utils.getCompleteInfo(ast, position, languageId);
  //     /** 错误信息定位时长 */
  //     let traverseTime = new Date().getTime() - parseTime - startTime;

  //     const { targetError, targetErrorPos } = this.getNearestError(errors, position, document);

  //     /** 目标错误提示补全多字段场景 */
  //     targetError?.completeType?.forEach((err, idx) => {
  //       if (err.errType.split(', ').length > 1) {
  //         err.errType.split(', ').forEach(type => {
  //           flattenError.push({
  //             ...err,
  //             errType: type,
  //           });
  //         });
  //       } else {
  //         flattenError.push(err);
  //       }
  //     });

  //     /** flatternError需要放在前面，
  //      * 移除completeErrors中的ID错误，统一采用flatternError中的完整ID错误信息
  //      * (最终决定还是保留completeErrors中的ID，一些用户输入字符的场景下，flatternError提示信息不全)
  //      * 得到最终所需的全部补全error
  //      */
  //     flattenError = _uniq(flattenError.map(err => err.errType).concat(completeErrors));
  //     const hasPotentialId = hasPotentialIds(targetError, ast?.originalToken);

  //     if (hasPotentialId) {
  //       /** 正在编辑中的SQL的序号 */
  //       let targetSQLIdx = this.calcCurrentSqlIndex(ast, position);

  //       if (targetSQLIdx !== -1) {
  //         /** ID场景下需要上下文信息，统一改为使用pos信息获取 */
  //         asyncItems = this.getAsyncCompleteInfo(
  //           ast.cst.children.sqlStatements[targetSQLIdx],
  //           Global,
  //           visitedTable,
  //           options.completionTypes,
  //           position,
  //           ddlMap,
  //         );
  //         if (
  //           current === '.' &&
  //           _get(asyncItems, 'params[0]') &&
  //           _get(asyncItems, 'hitCache') === false
  //         ) {
  //           asyncItems.params[0] += current;
  //         }
  //       }
  //     }
  //     flattenError.forEach(err => {
  //       if (err !== 'CAST') {
  //         /** 根据current大小写判断补全大小写 */
  //         const isLowerCase = options.lowerCaseComplete;
  //         syncItems.push(
  //           ...this.getSyncCompleteInfo(err, Global.HotWords, options.completionTypes, isLowerCase),
  //         );
  //       }
  //     });

  //     // 根据CAST默认加上内置函数的提示内容, 或者是（,这种认为是字母开头的函数
  //     const isFunc = flattenError.find(label => label === 'CAST' || label === 'LPAREN');
  //     if (options.options?.useInnerFunction && isFunc) {
  //       // 函数检测是全量匹配的，只需要进入一次
  //       syncItems = ODPSFunction.reduce((arr, item) => {
  //         if (item?.toLowerCase().includes(keyword?.toLowerCase())) {
  //           const func = generateCompleteItem(item, Global.HotWords, !!options.lowerCaseComplete, {
  //             detail: options.completionTypes?.FUNCTION.text,
  //             builtInCompletionType: builtInCompletionType.FUNCTION,
  //             kind: options.completionTypes[builtInCompletionType.FUNCTION].kind,
  //           });
  //           return [...arr, func];
  //         }
  //         return arr;
  //       }, syncItems);
  //     }

  //     /** worker中停留的总时长 */
  //     let workerTime = new Date().getTime() - startTime;
  //     const idx = this.calcCurrentSqlIndex(ast, position);
  //     let currentSqlIndex;

  //     if (ast) {
  //       currentSqlIndex = idx;
  //     }

  //     /** FIXME：对于关键词补全的时候需要设置isIncomplete为false，允许用户进行本地查找，如果为ID补全，则为true，只能访问远程，混合情况比较难以处理 */
  //     return Promise.resolve({
  //       isIncomplete: hasPotentialId ? true : false,
  //       fixedValue,
  //       syncItems,
  //       asyncItems,
  //       monitorInfo: {
  //         parseTime,
  //         traverseTime,
  //         workerTime,
  //       },
  //       ast,
  //       currentSqlIndex,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     /** TODO：异常上报 */
  //   }
  // }

  

}

export function create(ctx: IWorkerContext, createData: ICreateData): OBWorker {
  return new OBWorker(ctx, createData);
}