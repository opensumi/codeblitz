import { CompletionProviderOptions, SQLType } from '../types';

import {
  CancellationToken,
  Thenable,
  Position,
  Range,
  MarkerSeverity,
  Uri,
  IRange,
} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

import _isEmpty from 'lodash/isEmpty';
import _uniqueId from 'lodash/uniqueId';
// import { Position, Range, MarkerSeverity, Uri } from 'monaco-editor';
import * as ls from 'vscode-languageserver-types';

function fromPosition(position: Position): ls.Position {
  if (!position) {
    return { line: 0, character: 0 };
  }
  return { character: position.column - 1, line: position.lineNumber - 1 };
}

function toRange(range: ls.Range): Range {
  if (!range) {
    return new Range(0, 0, 0, 0);
  }

  return new Range(
    range.start.line + 1,
    range.start.character + 1,
    range.end.line + 1,
    range.end.character + 1
  );
}

function fromRange(range: IRange): ls.Range {
  if (!range) {
    return { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } };
  }
  return {
    start: { line: range.startLineNumber - 1, character: range.startColumn - 1 },
    end: { line: range.endLineNumber - 1, character: range.endColumn - 1 },
  };
}

function toTextEdit(textEdit: ls.TextEdit): monaco.editor.ISingleEditOperation {
  if (!textEdit) {
    return { 
      range: new Range(0, 0, 0, 0),
      text: '',
    }
  }
  return {
    range: toRange(textEdit.range),
    text: textEdit.newText,
  };
}

interface UniqMap {
  match: string; // 原SQL中的值
  replacer: (t: string) => string; // 自定义的格式
}

/** 根据用户自定义替换规则，预处理SQL。避免格式化通用化处理。多用于参数定义 */
const transferFormatTextByCustomRules = (text, rules) => {
  let formatText = text;
  const customMap = {} as Record<string, UniqMap>;
  if (_isEmpty(rules)) {
    return null;
  }

  (rules || []).forEach((custom) => {
    formatText = formatText.replace(custom.regex, (match) => {
      const uniqueId = _uniqueId('custom_unique_');
      customMap[uniqueId] = {
        match: match,
        replacer: custom.value,
      };
      return uniqueId;
    });
  });

  return {
    value: formatText,
    // 避免混淆，所以用text2.虽然不会影响
    callback: (text2) => {
      let formatQuery = text2;
      // 将预处理的文案，还原成用户自定义格式。
      if (!_isEmpty(customMap)) {
        // reserved的目的是，先将id值大的先进行替换。如unique_11会被unique_1匹配到。导致bug
        const entries = Object.entries(customMap).reverse();
        entries.forEach((custom) => {
          if (typeof custom[1].replacer === 'function') {
            formatQuery = formatQuery.replace(new RegExp(custom[0], 'g'), () =>
              custom[1].replacer(custom[1].match)
            );
          } else {
            formatQuery = formatQuery.replace(new RegExp(custom[0], 'g'), custom[1].replacer);
          }
        });
      }
      return formatQuery;
    },
  };
};

function getPreviousWord(text, range: IRange) {
  const lineArr = text.split('\n');
  const currentLine = lineArr[range.startLineNumber - 1];
  const sentence = currentLine.slice(0, range.startColumn - 1);
  let result = null;
  if (!sentence.trim()) {
    for (let i = range.startLineNumber - 2; i >= 0; i--) {
      const line = lineArr[i];
      if (!!line.trim()) {
        result = line.trim().split(' ').pop();
        break;
      }
    }
  }
  if (!result) {
    result = sentence.trim().split(' ').pop();
  }
  return result;
  // return Object.keys(TokenMap.ODPSSQL).includes(result.toUpperCase()) ? result : LOG_ID
}

function findItemInSuggestion(arr, item) {
  return !!arr.find((i) => String(i?.insertText).toUpperCase() === String(item).toUpperCase());
}

/** 判断当前输入内容是否使用智能提示内容 */
function checkCompeleteItem(prevSuggestions, item) {
  const isSyncItem = findItemInSuggestion(prevSuggestions.syncItems, item);
  const isAsyncItem = findItemInSuggestion(prevSuggestions.asyncItems, item);
  return {
    isSyncItem,
    isAsyncItem,
    isCompelete: isSyncItem || isAsyncItem,
  };
}

function toSeverity(lsSeverity: number): MarkerSeverity {
  switch (lsSeverity) {
    case ls.DiagnosticSeverity.Error:
      return MarkerSeverity.Error;
    case ls.DiagnosticSeverity.Warning:
      return MarkerSeverity.Warning;
    case ls.DiagnosticSeverity.Information:
      return MarkerSeverity.Info;
    case ls.DiagnosticSeverity.Hint:
      return MarkerSeverity.Hint;
    default:
      return MarkerSeverity.Info;
  }
}

function toDiagnostics(resource: Uri, diag: ls.Diagnostic): monaco.editor.IMarkerData {
  let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;
  return {
    severity: toSeverity(diag?.severity || 0),
    startLineNumber: diag.range.start.line + 1,
    startColumn: diag.range.start.character + 1,
    endLineNumber: diag.range.end.line + 1,
    endColumn: diag.range.end.character + 1,
    message: diag.message,
    code: code,
    source: diag.source,
    // @ts-ignore
    tags: diag.tags,
  };
}

export {
  fromPosition,
  toTextEdit,
  fromRange,
  toRange,
  transferFormatTextByCustomRules,
  getPreviousWord,
  checkCompeleteItem,
  toDiagnostics,
};

// import * as ls from 'vscode-languageserver-types';

// 早期 monaco 中使用的是一个叫 winJS 的 promise 的库
//  后期慢慢下线了，我们用的还是 老版本 monaco
// 具体下线相关可以见: https://github.com/microsoft/vscode/issues/53526

export interface MarkupContent {
  /**
   * The type of the Markup
   */
  kind: MarkupKind;
  /**
   * The content itself
   */
  value: string;
}
export declare namespace MarkupContent {
  /**
   * Checks whether the given value conforms to the [MarkupContent](#MarkupContent) interface.
   */
  function is(value: any): value is MarkupContent;
}
export declare type MarkupKind = 'plaintext' | 'markdown';

export declare type MarkedString =
  | string
  | {
      language: string;
      value: string;
    };
function wireCancellationToken<T>(token: CancellationToken, promise: Promise<T>): Thenable<T> {
  token.onCancellationRequested(() => {});
  return promise;
}

/** 自动补全参数转换 */
function transformOptions(options: CompletionProviderOptions) {
  const final = {} as any;
  // if (options.query) {
  //   if (options.query.url === 'mock') {
  //     /** Demos场景下，提供mock数据*/
  //     final.request = () =>
  //       Promise.resolve({
  //         data: {
  //           allEntities: true,
  //           entities: [
  //             {
  //               name: 'sampleOne',
  //               des: '样例数据，补充前缀场景',
  //               parentEntityName: 'prefix_will_be_insert',
  //               type: 'SAMPLE_TYPE_ONE',
  //             },
  //             {
  //               name: 'sampleTwo',
  //               des: '样例数据，无前缀场景',
  //               parentEntityName: 'prefix_will_not_be_insert',
  //               type: 'SAMPLE_TYPE_TWO',
  //             },
  //           ],
  //         },
  //       });
  //   } else {
  //     let completeUrl = `${options.query.url}?`;
  //     Object.entries(options.query.params).forEach(([key, value]) => {
  //       completeUrl += `${key}=${value}&`;
  //     });

  //     final.request = (keyword, sqlType: SQLType = SQLType.DQL) => {
  //       return fetch(
  //         `${completeUrl}keyword=${encodeURIComponent(keyword || '')}&sqlType=${sqlType}`,
  //         {
  //           credentials: 'include',
  //         },
  //       )
  //         .then(data => data.json())
  //         .catch(err => console.error(err));
  //     };
  //   }
  // }

  return final;
}

function isMarkupContent(thing: any): thing is MarkupContent {
  return thing && typeof thing === 'object' && typeof (<MarkupContent>thing).kind === 'string';
}

function toMarkdownString(entry: MarkupContent | MarkedString): monaco.IMarkdownString {
  if (typeof entry === 'string') {
    return {
      value: entry,
    };
  }
  if (isMarkupContent(entry)) {
    if (entry.kind === 'plaintext') {
      return {
        value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'),
      };
    }
    return {
      value: entry.value,
    };
  }

  return { value: '```' + entry.language + '\n' + entry.value + '\n```\n' };
}

function toMarkedStringArray(
  contents: MarkupContent | MarkedString | MarkedString[]
): monaco.IMarkdownString[] {
  if (!contents) {
    // return void 0;
    return [];
  }
  if (Array.isArray(contents)) {
    return contents.map(toMarkdownString);
  }
  return [toMarkdownString(contents)];
}

export { transformOptions, wireCancellationToken, toMarkedStringArray };
