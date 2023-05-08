// @ts-nocheck

import { ErrorType, ErrorTypeMap, TokenLabel, ValidationRules } from '../types';
import * as ls from 'vscode-languageserver-types';
import _get from 'lodash/get';
// import {onPostGoldLog} from './goldLog'
type Token = {
  image?: string;
  startColumn: number;
  startLine: number;
  startOffset: number;
  tokenTypeIdx: number;
  tokenType: any;
};
type Error = {
  context: any;
  previousToken: Token;
  token: Token;
};
/** 根据前后token的位置，获取报错范围character类型为（start, end] */
function getErrorRange(prevToken, endToken): ls.Range {
  const isEndTokenExit = endToken && endToken.image;
  const isPrevTokenExit = prevToken && prevToken.image;
  /** 不存在prevToken,则报错内容为endToken */
  if (!isPrevTokenExit && isEndTokenExit) {
    return {
      start: {
        line: endToken.startLine - 1,
        character: endToken.startColumn - 1,
      },
      end: {
        line: endToken.startLine - 1,
        character: endToken.startColumn + endToken.image.length - 1,
      },
    };
  }
  /** 不存在endToken,则报错内容为prevToken的下一格 */
  if (!isEndTokenExit && isPrevTokenExit) {
    return {
      start: {
        line: prevToken.startLine - 1,
        character: prevToken.startColumn + prevToken.image.length - 1,
      },
      end: {
        line: prevToken.startLine - 1,
        character: prevToken.startColumn + prevToken.image.length,
      },
    };
  }
  /** 报错位置为下一个token的开头 */
  if (isEndTokenExit && isPrevTokenExit) {
    return {
      start: {
        line: endToken.startLine - 1,
        character: endToken.startColumn - 2,
      },
      end: {
        line: endToken.startLine - 1,
        character: endToken.startColumn - 1,
      },
    };
  }

  return {
    start: {
      line: 0,
      character: 0,
    },
    end: {
      line: 0,
      character: 0,
    },
  };
}
/** 处理handleMissMatchedError */
const handleMissMatchedError = (error: Error, code: string) => {
  // 标记下一个token
  const markNext = error.token.image && code;
  return {
    message: code ? `${code} expected.` : 'variable tokens expected.',
    severity: ls.DiagnosticSeverity.Error,
    source: ValidationRules.DEFAULT,
    range: getErrorRange(!markNext && error.previousToken, error.token),
  };
};
/** 处理NotAllInputError逻辑 */
const handleNotAllInputError = (error: Error, getNextToken) => {
  const currentErrorImage = (error.token.image || '').toUpperCase();
  // TODO：错误出现在独立语句的开头第一个token，ast构建结束。考虑提示出当前用户可能的输入,可加入缓存
  const nextTokens = getNextToken('').filter(token => token.startsWith(currentErrorImage));
  const suggest = nextTokens.length
    ? `${nextTokens[0]} expected.`
    : `can't find name ${error.token.image}`;
  return {
    message: suggest,
    severity: ls.DiagnosticSeverity.Error,
    source: ValidationRules.DEFAULT,
    range: getErrorRange(null, error.token),
  };
};
/** 处理NoVariableAltError */
const handleNoVariableAltError = (error: Error) => {
  return {
    message: 'Unsupported Grammars Or Back Quote Expected',
    severity: ls.DiagnosticSeverity.Error,
    source: ValidationRules.DEFAULT,
    range: getErrorRange(error.previousToken, error.token),
  };
};
/** 处理EarlyExitError */
const handleEarlyExitError = (error: Error) => {
  /** 可以通过getNextToken分析出缺少的内容 */
  return {
    message: 'Variable Tokens Expected.',
    severity: ls.DiagnosticSeverity.Error,
    source: ValidationRules.DEFAULT,
    range: getErrorRange(error.previousToken, error.token),
  };
};
/** 特殊情况处理 */
export function parseErrorChecker(ast, inputText, getFilteredNode): ls.Diagnostic[] {
  let errorMsg: ls.Diagnostic[] = [];
  const errors = ast.parseErrors || [];
  errorMsg = errors.map(error => {
    // 判断错误类型
    const currentErrorType = ErrorTypeMap.find(p => p.type === error.name);
    const matched = error.message.match(currentErrorType.pattern);

    if (matched) {
      /** 特殊场景处理,将关键词作为参数使用 */
      if (matched.includes('ID')) {
        const message = error.context.ruleStack.includes('tableSourceItem')
          ? `'${error.token.image}' avoid using keywords as table names`
          : `'${error.token.image}' avoid using keywords as parameters`;
        return {
          message,
          severity: ls.DiagnosticSeverity.Warning,
          source: ValidationRules.DEFAULT,
          range: getErrorRange(null, error.token),
        };
      }
      /** 存在resyncedTokens。ast构建跳过，无法定位错误情况，抛出语法不支持 */
      if (error.resyncedTokens.length > 0 && matched[1] === 'SEMI') {
        return {
          message: 'Unsupported Grammars',
          severity: ls.DiagnosticSeverity.Error,
          source: ValidationRules.DEFAULT,
          range: getErrorRange(null, error.token),
        };
      }
      /** 当错误为MismatchedTokenException，则提示缺少的字段。否则不提示错误字段 */
      let code = '';
      if (matched[1] && currentErrorType.type === 'MismatchedTokenException') {
        code = TokenLabel[matched[1]] || matched[1];
        return handleMissMatchedError(error, code);
      }
      if (currentErrorType.type === ErrorType.NotAllInputParsedException) {
        // 错误为句首第一个token错误，会影响到下面的语句错误检查，需提示
        // FIXME：
        return handleNotAllInputError(error, () => []);
      }
      if (currentErrorType.type === ErrorType.NoViableAltException) {
        /**
         * @case1 使用关键词作为id：select code from a
         * @case2 不支持语法
         * @result 目前统一提示为variable tokens expected.
         */
        return handleNoVariableAltError(error);
      }
      if (currentErrorType.type === ErrorType.EarlyExitException) {
        /**
         * @case1 select a from hello LIMIT
         */
        return handleEarlyExitError(error);
      }
    }
  });

  // 异常字符检查，common_string的定义方式不能识别出中文的标点符号，这里做一层检查
  const cnPunctuation = /[，。’‘”“：；？（）【】》、《]/g;
  const commentReg = /(--([^\n])*)|(\/\*[\s\S]*\*\/)/;
  inputText.split('\n').forEach((line, idx) => {
    /** matchAll有兼容性问题 */
    let currentError = cnPunctuation.exec(line);
    while (currentError) {
      /** STRING_LITERAL中的中文标点，不显示波浪线 */
      let stringMatchResult = getStringRangeInLine(line);
      const isString = stringMatchResult.find(
        item => item.start <= currentError.index && item.end >= currentError.index,
      );
      /** 注释中的中文标点，不显示波浪线 */
      const commentMatchResult = line.match(commentReg);
      const isComment =
        commentMatchResult &&
        currentError.index >= commentMatchResult.index &&
        commentMatchResult[0].length + commentMatchResult.index >= currentError.index;

      if (!isString && !isComment) {
        errorMsg.push({
          message: 'Unsupported Grammars',
          severity: ls.DiagnosticSeverity.Error,
          source: ValidationRules.DEFAULT,
          range: {
            start: {
              line: idx,
              character: currentError.index,
            },
            end: {
              line: idx,
              character: currentError.index + 1,
            },
          },
        });
      }

      currentError = cnPunctuation.exec(line);
    }
  });

  return errorMsg;
}

/** 一行文本，得到所有的字符串信息 */
function getStringRangeInLine(text: string) {
  const stringLiteralReg = /(\"(\w|\(|\)|[^(\")])*\"|\'(\w|\(|\)|[^(\')])*\')/g;
  let currentMatch = stringLiteralReg.exec(text);
  let result = [];
  while (currentMatch) {
    result.push({
      start: _get(currentMatch, 'index', 0),
      end: _get(currentMatch, 'index', 0) + (currentMatch[0] || '').length,
    });
    currentMatch = stringLiteralReg.exec(text);
  }
  return result;
}

/** 自定义语法，错误信息解析 */
export function customDSLErrorFormat(ast: any): ls.Diagnostic[] {
  let errorMsg: ls.Diagnostic[] = [];
  const errors = ast.parseErrors || [];
  errorMsg = errors.map(error => {
    // 判断错误类型
    const currentErrorType = ErrorTypeMap.find(p => p.type === error.name);
    const matched = error.message.match(currentErrorType.pattern);

    if (matched) {
      /** 存在resyncedTokens。ast构建跳过，无法定位错误情况，抛出语法不支持 */
      if (error.resyncedTokens.length > 0 && matched[1] === 'SEMI') {
        return {
          message: 'Unsupported Grammars',
          severity: ls.DiagnosticSeverity.Error,
          source: ValidationRules.DEFAULT,
          range: getErrorRange(null, error.token),
        };
      }
      /** 当错误为MismatchedTokenException，则提示缺少的字段。否则不提示错误字段 */
      if (matched[1] && currentErrorType.type === 'MismatchedTokenException') {
        // 标记值，缺少字段内容提示
        return handleMissMatchedError(error, matched[1]);
      }
      if (currentErrorType.type === ErrorType.NotAllInputParsedException) {
        // 错误为句首第一个token错误，会影响到下面的语句错误检查，需提示
        // FIXME：
        return handleNotAllInputError(error, () => []);
      }
      if (currentErrorType.type === ErrorType.NoViableAltException) {
        /**
         * @case1 使用关键词作为id：select code from a
         * @case2 不支持语法
         * @result 目前统一提示为variable tokens expected.
         */
        return handleNoVariableAltError(error);
      }
      if (currentErrorType.type === ErrorType.EarlyExitException) {
        /**
         * @case1 select a from hello LIMIT
         */
        return handleEarlyExitError(error);
      }
    }
  });

  return errorMsg;
}
