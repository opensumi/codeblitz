// @ts-nocheck

'use strict';
import { Thenable, worker } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api.d';
import IWorkerContext = worker.IWorkerContext;
import { initialize } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.worker';
import { TableAuthResponse } from '../tools/validationRules/TableAuth';

import * as ls from 'vscode-languageserver-types';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _isEmpty from 'lodash/isEmpty';
import _union from 'lodash/union';
import _uniq from 'lodash/uniq';
import _get from 'lodash/get';
import _orderByget from 'lodash/orderBy';
import _flattenDeep from 'lodash/flattenDeep';
import _findLast from 'lodash/findLast';
import _orderBy from 'lodash/orderBy';
import { validateGroupBy, validateSelectAll, validateTableAuth } from '../tools/validationRules';
import { functionTypeTextMap } from '../sql-functions/odps/definitions';

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
import { Parser, Lexer, SyntaxKind, Tokens } from 'bravo-parser/lib/sql-parser/ODPS/parser.g';

// import { OdpsSqlLexer as Lexer, OdpsSqlParser as Parser, OdpsSqlListener, OdpsSqlVisitor } from '../parser/odps-parser/index';

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
    return new ODPSWorker(ctx, createData);
  });
};


export class ODPSWorker {
  private _ctx: IWorkerContext;
  private parser: ParserManage;
  private languageId: string;
  private tokens: any;
  private utils: any;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this.languageId = createData.languageId;
    /** Lexer方法耗时2s，注意缓存 */
    this.parser = new ParserManage(parseGenerator(Parser, Lexer));

    this.utils = createUtils(SyntaxKind, createData.languageTokens, Tokens);
    this.tokens = createData.languageTokens;
  }

  async doValidation(
    uri: string,
    options: CompletionProviderOptions,
  ): Promise<ValidationReturnType> {
    let { document } = this._getTextDocument(uri);
    try {
      // 若满足【不存在model】、【降级方案】其中一项时，不进行检查
      // 【配置项禁用静态检查】时，进行检查，但是不提示在编辑器上。
      const skipDiagnose = !document || options.degenerate;
      const validationRules = _get(options, 'options.validationRules', []);
      if (skipDiagnose) {
        return Promise.resolve({
          diagnostics: [],
          errors: [],
        });
      }
      const inputText = document.getText();
      const ast = (await this.parser.parse(inputText)) as any;
      let authInfo: TableAuthResponse = [];
      /**
       * 存在语法错误时，从ast语法树中，找到独立sql语句上报
       * 原因是：上报接口限定最长字符为2k，减少不必要的字节
       */
      const parseErrorMsg = parseErrorChecker(ast, inputText, this.utils.getFilteredNode);
      /** 自定义错误抛出 */
      const customRulesDiagnostics = [] as ls.Diagnostic[];
      if (validationRules.includes(ValidationRules.GROUP_BY)) {
        customRulesDiagnostics.push(...validateGroupBy(ast.cst));
      }
      if (validationRules.includes(ValidationRules.SELECT_STAR)) {
        customRulesDiagnostics.push(...validateSelectAll(ast.cst));
      }
      if (validationRules.includes(ValidationRules.TABLE_AUTH)) {
        // 表权限校验开启，则向外部抛出当前出现的表名和字段等信息
        authInfo = validateTableAuth(ast.cst);
      }

      return Promise.resolve({
        diagnostics: parseErrorMsg.concat(customRulesDiagnostics),
        astInfo: {
          ast,
          sql: inputText,
        },
        authInfo,
      });
    } catch (e) {
      // 异常抛出
      return Promise.reject(e);
    }
  }

  /** 递归查找指定属性*/
  deepFind(aliasMap, filter) {
    return _filter(
      _flatten(
        aliasMap.map(item => {
          if (filter(item)) {
            return item;
          } else if (_get(item, 'availableFields[0]')) {
            return _flatten(this.deepFind(item.availableFields, filter));
          } else {
            return;
          }
        }),
      ),
      o => o,
    );
  }

  getAsyncCompleteInfo(cst, Global, visitedTable, completionTypes, position: ls.Position, ddlMap) {
    /** TODO:目前parser无法提供完整的字段类型信息，只能人为区分tableName和Field */
    /** 空字符串作为字段名, UNION ALL过滤 */
    const HotWords = Global.HotWords;

    /** 获取补全Token类型
     * ID补全场景应该只包括表名和字段
     * 表名场景时直接补全，字段场景时基于recoveredNode类型在调用栈中查找对应的原始表名或提示表别名
     */
    const targetNode = this.utils.getPositiondNode(cst, {
      line: position.line + 1,
      offset: position.character,
    })[0];

    /** escape场景 */
    if (_find(targetNode?.ruleStack, rule => rule.name === 'createTableStatement')) {
      return null;
    }

    /** 当前场景是一句 where clause */
    const isWhereClause = _find(targetNode?.ruleStack, rule => rule.name === 'whereClause') && targetNode?.ruleStack.pop().name === 'mathExpression';
    const isJoinPart = targetNode?.ruleStack.pop()?.name === 'joinToken';

    const analyzeResult = AnalyzeQueryStatement(targetNode, SyntaxKind, completionTypes);
    // 基于cst语法树，找到了需要提示的内容，就提示
    if (analyzeResult?.items) {
      return {
        hitCache: true,
        isJoinPart,
        isWhereClause,
        ...analyzeResult,
      };
    }
    // 需要请求接口的情况，先检查缓存，然后发起
    if (analyzeResult?.type) {
      if (analyzeResult?.type === CompleteType.setParam) {
        return {
          hitCache: false,
          params: [analyzeResult?.keyword, SQLType.SET],
          ...analyzeResult,
        };
      }
      if (analyzeResult?.type === CompleteType.setValue) {
        return {
          hitCache: false,
          params: [analyzeResult?.keyword, SQLType.SET],
          ...analyzeResult,
        };
      }
      if (analyzeResult?.type === CompleteType.field) {
        // 字段提示同时透出是否是 where 语句触发
        return {
          hitCache: false,
          params: [analyzeResult?.keyword, SQLType.DQL],
          isWhereClause,
          isJoinPart,
          ...analyzeResult
        }
      }
      return {
        hitCache: false,
        params: [analyzeResult?.keyword, SQLType.DQL],
        ...analyzeResult,
      };
    }
    return;
  }

  getSyncCompleteInfo(err, HotWords, completionTypes, lowerCase) {
    if (IgnoreLabel[err] || EscapeLabel[err]) {
      /** TODO：对于复杂的正则表达式不做匹配 */
      return [];
    }
    if (ODPSSnippetsMap[err]) {
      /** 代码段补全场景 */
      let completeItems = [] as any; // monaco.languages.CompletionItem[] 不想引入monaco，体积问题
      let items = ODPSSnippetsMap[err];
      if (!Array.isArray(items)) {
        items = [items];
      }
      const originText = translateLabel[err] || this.tokens[err] || err;
      items.forEach(item => {
        const snippetsText = item.text || item;
        completeItems.push(
          generateCompleteItem(snippetsText, HotWords, lowerCase, {
            detail: completionTypes.SNIPPET.text,
            builtInCompletionType: builtInCompletionType.SNIPPET,
            kind: completionTypes[builtInCompletionType.SNIPPET].kind,
            insertText: item?.insertText,
            insertTextRules: 4,
          }),
        );
      });
      completeItems.push(
        generateCompleteItem(originText, HotWords, lowerCase, {
          detail: completionTypes.KEYWORD.text,
          builtInCompletionType: builtInCompletionType.KEYWORD,
          kind: completionTypes[builtInCompletionType.KEYWORD].kind,
        }),
      );
      return completeItems;
    } else {
      // 存在部分特殊情况，需要替换为实际意义的关键词如：null_litter
      const text = translateLabel[err] || this.tokens[err] || err;
      return [
        // generateCompleteItem(lowerCase ? text.toLowerCase() : text, HotWords, { detail: '关键词', kind: CompletionItemKind.Keyword })
        generateCompleteItem(text, HotWords, lowerCase, {
          detail: completionTypes.KEYWORD.text,
          builtInCompletionType: builtInCompletionType.KEYWORD,
          kind: completionTypes[builtInCompletionType.KEYWORD].kind,
        }),
      ];
    }
  }

  /** 退化场景下对text进行拆分，根据光标位置判断查询的keyword */
  positionKeyWord(text: string, position: ls.Position) {
    const currLine = text.split('\n')[position.line];
    let current;
    let duplicateTrigger = false;
    let startPos = -1;
    let endPos = currLine.length;
    // 这边可能没有空格连续的 fun(fuxn(),xxx,ssss)
    for (let start = position.character - 1; start >= -1; start--) {
      if ([' ', ',', '('].includes(currLine[start])) {
        startPos = start;
        break;
      }
    }

    for (let end = position.character - 1; end <= currLine.length - 1; end++) {
      if ([' ', ')', ','].includes(currLine[end])) {
        endPos = end;
        break;
      }
    }

    current = currLine[position.character - 1];
    /** https://work.aone.alibaba-inc.com/issue/20044436
     * .之后输入空格时，duplicateTrigger置位true，不重复触发补全
     */
    if (current === ' ') {
      let i = position.character - 1;
      while (i >= 0) {
        if (currLine[i] === ' ') {
          i--;
        } else {
          if (currLine[i] === '.') {
            duplicateTrigger = true;
          }
          break;
        }
      }
    }

    return {
      duplicateTrigger,
      keyword: currLine.slice(startPos + 1, endPos),
      current,
      startPos: startPos < 0 ? startPos : startPos + 1,
      endPos,
    };
  }

  /** 目前没有很好的办法准确区分需要fix的字段是否为关键词还是字符串，因此增加一下额外的autofix触发条件 */
  triggerAutofix(preKeyword, syncItems) {
    if (syncItems && syncItems.length === 0) {
      /** 没有匹配的直接返回 */
      return false;
    }
    const normalized = preKeyword.toLowerCase().trim();
    const specialLetter = [',', '.', '(', ')', '-'];
    /** 检查preKeyword中是否存在特殊字符，如果存在则一定不是关键词，相等说明不存在特殊字符 */
    if (
      _union(normalized.split(''), specialLetter).length ===
      _uniq(normalized.split('')).length + specialLetter.length
    ) {
      const spellFixer = new SymSpell(undefined, {
        dictionary,
        wordList,
        maxLength,
      });
      const suggestions = spellFixer.correct(normalized, '');
      const syncItemsLabel = syncItems?.map(item => item.label);
      if (suggestions.length && suggestions[0].term) {
        /** distance默认小于2视为匹配，关键词长度不大于4的情况，distance不能大于1 */
        let suggest = '';
        suggestions?.some(item => {
          if (syncItemsLabel.includes(item.term) && item.distance <= 2) {
            suggest = item.term;
            return true;
          }
          return false;
        });
        if (suggest) {
          return suggest;
        }
      }
    }

    return false;
  }

  /** 判断当前错误是否为光标所在位置 */
  isPositionedError = (error, position, document) => {
    const previousToken = error && error.previousToken;
    if (!_get(error, 'previousToken.image')) {
      return true;
    }
    let start = {
      character: previousToken.startColumn + previousToken.image.length,
      line: previousToken.startLine - 1,
    };
    let end = {
      ...position,
    };

    const textBetween = document.getText({ start, end });
    if (textBetween.trim() === '') {
      return true;
    }
    return false;
  };

  // 找到errors中，当前光标位置对应的错误信息
  getNearestError = (errors, position, document) => {
    /** 距离补全位置最近的error在队列中的位置 */
    let targetErrorPos = 0;

    /** 存在多个语法错误时，根据光标位置匹配对应语法错误，提示补全信息 */
    const targetError = errors.find((item, idx) => {
      if (!_get(item, 'previousToken.image')) {
        return true;
      }

      const previousToken = item?.previousToken;
      const start = {
        character: previousToken.startColumn + previousToken.image.length - 1,
        line: previousToken.startLine - 1,
      };
      const end = {
        ...position,
      };
      const errorRange = new Range(start);
      const pRange = new Range(position);
      const isFrontofPos = errorRange.isFrontOf(pRange);

      const textBetween = document.getText({ start, end });
      if (textBetween.trim() === '' && isFrontofPos) {
        targetErrorPos = idx;
        return true;
      }
      return false;
    });

    if (targetError) {
      return { targetError, targetErrorPos };
    }

    return {};
  };

  /** 当前编辑的sql -> index */
  calcCurrentSqlIndex = (ast, position) => {
    let targetSQLIdx = -1;
    let targetToken = null;
    const posRange = new Range(position);
    const topSql = _get(ast.cst, 'children.sqlStatements', '');
    if (!_isEmpty(topSql)) {
      /** 多条SQL时，找到每条SQL的首个非终极符的token与光标的距离最近，且位于光标之前，则为正在编辑的SQL */
      for (let i = 0; i < topSql.length; i++) {
        const firstToken = this.utils.getFilteredNode(
          topSql[i],
          item => item.image && item?.image !== ';',
        )[0];
        if (!firstToken) {
          break;
        }
        const topToken = new Range({
          line: firstToken?.startLine - 1,
          character: firstToken?.startColumn + firstToken?.image?.length - 1,
        });
        /** 顺序一定是从前向后，逐步逼近光标位置，所以不需要记录最小距离 */
        if (topToken.isFrontOf(posRange)) {
          targetSQLIdx = i;
          targetToken = firstToken;
        } else {
          break;
        }
      }
    }
    return targetSQLIdx;
  };

  /** 替换word为空字符串 */
  changeWordToEpmty(text, line, start, end) {
    let texts = text.split('\n');
    let currentLineWord = texts[line];
    let currentLineWords = currentLineWord.split('');
    for (let i = start + 1; i < end; i++) {
      currentLineWords[i] = ' ';
    }
    texts[line] = currentLineWords.join('');
    texts = texts.join('\n');
    return texts;
  }

  /** 获取上一个token的提示信息 */
  getPreTokenTips = async (
    document,
    text,
    position,
    languageId,
    options,
    Global,
    { preKeyword, startPos, endPos },
  ) => {
    try {
      let ast = await this.parser.parse(text, true, position);
      const parseErrors = ast.parseErrors;
      let flag =
        parseErrors.filter(item => {
          return (
            preKeyword.trim() === item.token.image && item.token.tokenType.name === 'COMMON_STRING'
          );
        }).length > 0;
      if (flag) {
        let newText = this.changeWordToEpmty(text, position.line, startPos, endPos);
        ast = await this.parser.parse(newText, true, {
          line: position.line,
          character: position.character - 1,
        });
      }
      const completeErrors = ast.nextToken;

      let flattenError = [] as any[];
      let syncItems = [] as any[];
      const errors = this.utils.getCompleteInfo(ast, position, languageId);
      const { targetError, targetErrorPos } = this.getNearestError(errors, position, document);

      targetError?.completeType?.forEach((err, idx) => {
        if (err.errType.split(', ').length > 1) {
          err.errType.split(', ').forEach(type => {
            flattenError.push({
              ...err,
              errType: type,
            });
          });
        } else {
          flattenError.push(err);
        }
      });

      flattenError = _uniq(flattenError.map(err => err.errType).concat(completeErrors));
      flattenError.forEach(err => {
        if (
          err !== this.tokens.COMMON_STRING &&
          err !== this.tokens.LOGICAL_SYMBOL &&
          err !== 'DOT'
        ) {
          /**
           * 非ID场景，错误提示仅需要errType
           * 根据current大小写判断补全大小写
           */
          const isLowerCase = options.lowerCaseComplete;
          syncItems.push(
            ...this.getSyncCompleteInfo(err, Global.HotWords, options.completionTypes, isLowerCase),
          );
        }
      });
      return syncItems;
    } catch (e) {
      console.log(e);
    }
  };

  async doComplete(
    uri: string,
    position: ls.Position,
    languageId,
    Global,
    visitedTable,
    options: CompletionProviderOptions,
  ): Promise<CompleteProviderReturnType> {
    try {
      let { document } = this._getTextDocument(uri);
      const text = document.getText();
      // const final = this.transformOptions(options);
      /** 当前keyword用于进行退化场景的查找 */
      const { keyword, current, duplicateTrigger } = this.positionKeyWord(text, position);
      let fixedValue;

      if (options.degenerate) {
        return Promise.resolve({
          isIncomplete: true,
          fixedValue,
          asyncItems: {
            hitCache: false,
            params: [keyword, SQLType.DQL],
            // 类型待定
          },
        });
      }

      /** autofix场景 */
      if (_get(options, 'options.autofix')) {
        /** preKeyword用于在输入空格时对上一个keyword autofix */
        const { keyword: preKeyword, startPos, endPos } = this.positionKeyWord(text, {
          ...position,
          character: position.character - 1,
        });
        /** 多个空格时，不需要重复fix，因为在输入第一个空格时，已经完成了对前一个关键词的fix */
        if (current === ' ' && preKeyword !== ' ') {
          const syncItems = await this.getPreTokenTips(
            document,
            text,
            position,
            languageId,
            options,
            Global,
            {
              preKeyword,
              startPos,
              endPos,
            },
          );
          const suggestion = this.triggerAutofix(preKeyword, syncItems);
          /** 找到合适的替换方案之后，选择distance最近的方案进行替换， 同时不重复替换 */
          if (suggestion) {
            fixedValue = {
              startLineNumber: position.line,
              startColumn: startPos,
              endLineNumber: position.line,
              endColumn: endPos,
              text: preKeyword[0] >= 'a' ? suggestion.toLowerCase() : suggestion.toUpperCase(),
            };
          }
        }
      }

      const startTime = new Date().getTime();

      const ast = await this.parser.parse(text, true, position);
      /** 额外获取补全信息的接口，基于光标位置构建ast，提供补全信息 */
      const completeErrors = ast.nextToken;

      /** 语法解析时长 */
      const parseTime = new Date().getTime() - startTime;

      /** .之后输入空格，不触发补全 */
      if (duplicateTrigger) {
        return Promise.resolve({
          isIncomplete: false,
          fixedValue,
          ast,
        });
      }

      /** 获取ddl创建的参数别名map*/
      const ddlMap = [];
      // this.utils.getViewDetails(ast.cst);

      /** 全部补全error */
      let flattenError = [] as any[];
      /** 提供给monaco的补全项 */
      let syncItems = [] as any[];
      /** 异步场景查询参数 */
      let asyncItems;

      /** 两类补全信息
       * 1. 基于ast，提供必选字段的补全信息，包含完整补全信息，ast.parserError
       *    (用于如select from 等场景下nextToken计算不出的问题，基于必填项的报错内容)
       * 2. 官方api，提供可选字段的补全信息，仅包含补全类型，nextToken
       */
      const errors = this.utils.getCompleteInfo(ast, position, languageId);
      /** 错误信息定位时长 */
      let traverseTime = new Date().getTime() - parseTime - startTime;

      const { targetError, targetErrorPos } = this.getNearestError(errors, position, document);

      /** 目标错误提示补全多字段场景 */
      targetError?.completeType?.forEach((err, idx) => {
        if (err.errType.split(', ').length > 1) {
          err.errType.split(', ').forEach(type => {
            flattenError.push({
              ...err,
              errType: type,
            });
          });
        } else {
          flattenError.push(err);
        }
      });

      /** flatternError需要放在前面，
       * 移除completeErrors中的ID错误，统一采用flatternError中的完整ID错误信息
       * (最终决定还是保留completeErrors中的ID，一些用户输入字符的场景下，flatternError提示信息不全)
       * 得到最终所需的全部补全error
       */
      flattenError = _uniq(flattenError.map(err => err.errType).concat(completeErrors));
      const hasPotentialId = hasPotentialIds(targetError, ast?.originalToken);

      if (hasPotentialId) {
        /** 正在编辑中的SQL的序号 */
        let targetSQLIdx = this.calcCurrentSqlIndex(ast, position);

        if (targetSQLIdx !== -1) {
          /** ID场景下需要上下文信息，统一改为使用pos信息获取 */
          asyncItems = this.getAsyncCompleteInfo(
            ast.cst.children.sqlStatements[targetSQLIdx],
            Global,
            visitedTable,
            options.completionTypes,
            position,
            ddlMap,
          );
          if (
            current === '.' &&
            _get(asyncItems, 'params[0]') &&
            _get(asyncItems, 'hitCache') === false
          ) {
            asyncItems.params[0] += current;
          }
        }
      }
      flattenError.forEach(err => {
        if (err !== 'CAST') {
          /** 根据current大小写判断补全大小写 */
          const isLowerCase = options.lowerCaseComplete;
          syncItems.push(
            ...this.getSyncCompleteInfo(err, Global.HotWords, options.completionTypes, isLowerCase),
          );
        }
      });

      // 根据CAST默认加上内置函数的提示内容, 或者是（,这种认为是字母开头的函数
      const isFunc = flattenError.find(label => label === 'CAST' || label === 'LPAREN');
      if (options.options?.useInnerFunction && isFunc) {
        // 函数检测是全量匹配的，只需要进入一次
        syncItems = ODPSFunction.reduce((arr, item) => {
          if (item?.toLowerCase().includes(keyword?.toLowerCase())) {
            const func = generateCompleteItem(item, Global.HotWords, !!options.lowerCaseComplete, {
              detail: options.completionTypes?.FUNCTION.text,
              builtInCompletionType: builtInCompletionType.FUNCTION,
              kind: options.completionTypes[builtInCompletionType.FUNCTION].kind,
            });
            return [...arr, func];
          }
          return arr;
        }, syncItems);
      }

      /** worker中停留的总时长 */
      let workerTime = new Date().getTime() - startTime;
      const idx = this.calcCurrentSqlIndex(ast, position);
      let currentSqlIndex;

      if (ast) {
        currentSqlIndex = idx;
      }

      /** FIXME：对于关键词补全的时候需要设置isIncomplete为false，允许用户进行本地查找，如果为ID补全，则为true，只能访问远程，混合情况比较难以处理 */
      return Promise.resolve({
        isIncomplete: hasPotentialId ? true : false,
        fixedValue,
        syncItems,
        asyncItems,
        monitorInfo: {
          parseTime,
          traverseTime,
          workerTime,
        },
        ast,
        currentSqlIndex,
      });
    } catch (e) {
      console.log(e);
      /** TODO：异常上报 */
    }
  }

  async doHover(
    uri: string,
    position: ls.Position,
    options: CompletionProviderOptions,
  ): Promise<{
    range: ls.Range;
    contents: string | number;
    type: string;
    vectorTokens: any[];
  }> {
    try {
      let { document } = this._getTextDocument(uri);
      const ast = await this.parser.parse(document.getText());
      let contents = undefined;
      let type;
      let endColumn = 0;
      let startColumn = 0;

      const target = this.utils.getClassification(ast.cst, position)[0];

      // ------ 函数 hover 提示逻辑 -------- //
      // 对 ast 做分析，看当前 hover 位置是不是函数, 如果是函数返回函数 hover 提示
      // 下面那段走函数提示的代码，应该是没法正常工作的，后续重构删除一下
      const { funcName, funcToken, nextToken } = calculateHoverFuncName(
        ast.assistanceTokenVector,
        position,
      );

      if (funcName) {
        const detail = getFunctionDetail(funcName);
        // @ts-ignore
        return Promise.resolve({
          range: {
            start: {
              line: funcToken.startLine - 1,
              character: funcToken.startColumn,
            },
            end: {
              line: funcToken.startLine - 1,
              character: nextToken.startColumn,
            },
          },
          type: IType.FUNCTION,
          contents: [
            {
              value: `${detail.usageCommand}[查看详情](${detail.docUrl})`,
              kind: 'markdown',
            },
            {
              value: [
                `用途: ${detail.simpleDesc}`,
                `类型: ${functionTypeTextMap[detail.functionType]}`,
                `参数说明: ${detail.paramDocs.map(item => `${item.label}: ${item.desc}`).join('')}`,
                `使用示例: ${detail.example}`,
              ].join('\n\n'),
              kind: 'markdown',
            },
          ],
          vectorTokens: ast?.assistanceTokenVector,
        });
      }

      // ------ 字段 hover 提示逻辑 -------- //
      // 计算当前 hover 位置的 sql，拿到对应 ast，不仅要拿到字段，并解析字段对应的表名
      const currentSqlIndex = this.calcCurrentSqlIndex(ast, position);
      const currentSqlCst = ast?.cst?.children?.sqlStatements?.[currentSqlIndex];

      // 字段名在 hover 时 ruleStack 最后一项为 fullId
      const fullIdInLast =
        target.ruleStack[target.ruleStack.length - 1].name === 'fullId' &&
        target.ruleStack[target.ruleStack.length - 2].name === 'selectItem';

      if (fullIdInLast) {
        const currentSqlTableNameTarget = this.utils.getFilteredNode(
          currentSqlCst,
          target => target.name === SyntaxKind.tableName,
        )[0];

        if (currentSqlTableNameTarget) {
          const fullNameNodes = _orderBy(
            getFilteredNode(currentSqlTableNameTarget, target => target.image, true),
            ['startOffset'],
            ['asc'],
          );

          const tableName = fullNameNodes.map(({ image }) => image).join('');
          const fieldName = target.image;

          // @ts-ignore
          return Promise.resolve({
            range: {
              start: {
                line: target.startLine - 1,
                character: target.startColumn,
              },
              end: {
                line: target.startLine - 1,
                character: target.startColumn + fieldName.length,
              },
            },
            type: IType.FIELD,
            contents: `${tableName}-${fieldName}`,
            vectorTokens: ast?.assistanceTokenVector,
          });
        }
      }

      // 其他 老的 hover 逻辑
      if (target) {
        const { startLine } = target;

        const targetNode = this.utils.getPositiondNode(ast.cst, {
          line: position.line + 1,
          offset: position.character,
        })[0];

        const isFunc = _find(targetNode.ruleStack, rule => {
          return rule.name === SyntaxKind.functionCall || rule.name === SyntaxKind.udfFunctionCall;
        });

        const isTable = _find(targetNode.ruleStack, rule => {
          return rule.name === SyntaxKind.tableName;
        });

        const isField = _find(targetNode.ruleStack, {
          name: SyntaxKind.tableAllColumns,
        });

        if (isFunc) {
          type = IType.FUNCTION;
        } else if (isTable) {
          type = IType.TABLE;
        } else if (isField) {
          type = IType.FIELD;
        }

        // HOVER是，字段、表名时。提示内容为完整节点：如 databaseA.tableB.filedC
        if (isTable || isField) {
          const fullNameNodes = _orderBy(
            getFilteredNode(isTable ?? isField, tg => tg.image, true),
            ['startOffset'],
            ['asc'],
          );
          contents = fullNameNodes.map(({ image }) => image).join('');
          startColumn = fullNameNodes[0].startColumn;
          endColumn = contents?.length + target?.startColumn;
        } else {
          contents = target.image;
          startColumn = target?.startColumn;
          endColumn = _get(target, 'image.length') + target?.startColumn;
        }
        // 如果没有识别出来，在检测下是否为内置函数
        if (!type) {
          // 如果是函数，先检查内置函数有没有
          const data = ODPSFunction.find(item => item.toLowerCase() === contents?.toLowerCase());
          if (data) {
            // 如果和内置函数一致
            type = IType.FUNCTION;
          }
        }
        /** 区分字段&表，UDF，内建函数 */
        return Promise.resolve({
          range: {
            start: {
              line: startLine - 1,
              character: startColumn,
            },
            end: {
              line: startLine - 1,
              character: endColumn,
            },
          },
          type,
          contents,
          vectorTokens: ast?.assistanceTokenVector,
        });
      } else {
        return Promise.resolve({
          range: {
            start: {
              line: -1,
              character: -1,
            },
            end: {
              line: -1,
              character: -1,
            },
          },
          type: undefined,
          contents: undefined,
          vectorTokens: [],
        });
      }
    } catch (e) {
      /** TODO：异常上报 */
    }
    // }, 200)
  }

  async doDefinition(
    uri: string,
    position: ls.Position,
  ): Promise<{ range: ls.Range; contents: string | number; type: string }> {
    try {
      let { document } = this._getTextDocument(uri);
      const ast = await this.parser.parse(document.getText());
      let contents = undefined;
      let endColumn = 0;
      const target = this.utils.getClassification(ast.cst, position)[0];
      if (target) {
        let { startLine, startColumn } = target;
        const targetNode = this.utils.getPositiondNode(ast.cst, {
          line: position.line + 1,
          offset: position.character,
        })[0];
        contents = target.image;
        endColumn = _get(target, 'image.length') + startColumn;
        // 处理函数
        const isFunc = _find(targetNode.ruleStack, item => {
          [SyntaxKind.functionCall, SyntaxKind.udfFunctionCall].includes(item.name);
        });
        if (isFunc) {
          return Promise.resolve({
            range: {
              start: {
                line: startLine,
                character: startColumn,
              },
              end: {
                line: startLine,
                character: endColumn,
              },
            },
            type: IType.FUNCTION,
            contents,
          });
        }
        // 处理表
        const isTable = _find(targetNode.ruleStack, rule => {
          return rule.name === SyntaxKind.tableName;
        });
        if (isTable) {
          // 判断下是否以点开头，则需要补充板块或者项目
          const fullNameNodes = _orderBy(
            getFilteredNode(isTable, tg => tg.image, true),
            ['startOffset'],
            ['asc'],
          );
          contents = fullNameNodes
            .map(({ image }) => image)
            .join('')
            ?.trim();
          startColumn = fullNameNodes[0].startColumn;
          endColumn = contents?.length + startColumn;
          return Promise.resolve({
            range: {
              start: {
                line: startLine,
                character: startColumn,
              },
              end: {
                line: startLine,
                character: endColumn,
              },
            },
            type: IType.TABLE,
            contents,
          });
        }
      }
      // 其余情况则无
      return Promise.resolve({
        range: {
          start: {
            line: -1,
            character: -1,
          },
          end: {
            line: -1,
            character: -1,
          },
        },
        type: undefined,
        contents: undefined,
      });
    } catch (e) {
      /** TODO：异常上报 */
    }
  }

  async format(uri, text, options): Promise<string> {
    try {
      // 调用sql-prettier获取格式化结果
      const document = sqlPrettier.format(text, options);
      return Promise.resolve(document);
    } catch (e) {
      /** TODO：异常上报 */
    }
  }

  private _getTextDocument(uri: string): { document: ls.TextDocument; model: worker.IMirrorModel } {
    let models = this._ctx.getMirrorModels();
    for (let model of models) {
      if (model.uri.toString() === uri) {
        return {
          document: ls.TextDocument.create(uri, this.languageId, model.version, model.getValue()),
          model,
        };
      }
    }
    return {} as any;
  }

  async doSignatureHelp(
    uri: string,
    position: ls.Position,
    triggerContext: monaco.languages.SignatureHelpContext,
  ) {
    // 解析当前正在输入的函数名
    // 计算当前函数的详细文档，一并返回
    try {
      let { document } = this._getTextDocument(uri);

      const { triggerCharacter, triggerKind } = triggerContext;

      let funcName;
      let activeParameter = 0;
      let funcPosition;

      const currentLineText = document.getText({
        start: {
          line: position.line,
          character: 0,
        },
        end: position,
      });

      if (triggerCharacter === '(') {
        funcName = currentLineText.match(/(\s+|^|\(|\,)(\w+)(\s+|)\($/)?.[2];
        funcPosition = {
          start: {
            line: position.line,
            character: currentLineText.indexOf(funcName),
          },
          end: {
            line: position.line,
            character: currentLineText.indexOf(funcName) + funcName.length,
          },
        };
      }

      // 内容发生变化之后触发的函数提示
      if (triggerKind === 3 || triggerCharacter === ',') {
        const lastTimeSignature = triggerContext?.activeSignatureHelp?.signatures[0];
        // 这种情况也要更新函数提示的位置和姓名，否则下次就丢了
        // @ts-ignore
        funcPosition = lastTimeSignature.funcPosition;
        // @ts-ignore
        funcName = lastTimeSignature.funcName;


        // 根据上一次的位置获取 `函数名到当前位置` 的文本
        let textBetweenFuncNameAndCurrentPosition = document.getText({
          start: funcPosition.start,
          end: position,
        });

        const newStr = textBetweenFuncNameAndCurrentPosition
          .split(' ')
          .join('')
          .split('\n')
          .join('');

        const newFuncName = newStr.match(/(\s+|^|\(|\,)(\w+)(\s+|)\(/)?.[2];

        // 如果函数名发生了变化一般就是函数名和括号被删了，这个时候直接取消提示
        // 如果进入到函数右括号右边，也取消函数提示
        if (newFuncName !== funcName || newStr.slice(-1) === ')') {
          funcName = '';
          funcPosition = {};
        } else {
          // 函数名如果没有变化，只需要更新所处参数位置
          // 解析类似 funcName(xxx, 'yyy', zzz, 'ddd') 字符串中的逗号数量
          const fn = str =>
            str.replace(/(\'.*?\')|(\".*?\")|((\"|\').*?$)/g, '').split(',')?.length - 1;
          activeParameter = fn(newStr);
        }
      }

      if (funcName) {
        const detail = getFunctionDetail(funcName);

        return Promise.resolve({
          signatures: [
            {
              funcName,
              funcPosition,
              label: detail.usageCommand,
              documentation: {
                value: [
                  `用途: ${detail.usageDesc}`,
                  ``,
                  `返回值: ${detail.returnDesc}`,
                  ``,
                  `示例: ${detail.example}`,
                  ``,
                  `[查看详情](${detail.docUrl})`,
                ].join('\n'),
              },
              parameters: detail.paramDocs.map(item => {
                return {
                  label: item.label,
                  documentation: `参数${item.label}: ${item.desc}`,
                };
              }),
            },
          ],
          activeSignature: 0,
          activeParameter,
        });
      }
    } catch (e) {
      // TODO: 异常上报
    }
  }
}

export function create(ctx: IWorkerContext, createData: ICreateData): ODPSWorker {
  return new ODPSWorker(ctx, createData);
}
