import _isEmpty from 'lodash/isEmpty';
import _uniqueId from 'lodash/uniqueId';
import * as ls from 'vscode-languageserver-types';
import { IRange, Position, Range, MarkerSeverity, Uri } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

function fromPosition(position: Position): ls.Position {
  if (!position) {
    return { line: 0, character: 0 };
  }
  return { character: position.column - 1, line: position.lineNumber - 1 };
}

function toRange(range: ls.Range): Range {
  if (!range) {
    return {} as Range;
  }

  return new Range(
    range.start.line + 1,
    range.start.character + 1,
    range.end.line + 1,
    range.end.character + 1,
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
    return {} as monaco.editor.ISingleEditOperation;
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

  (rules || []).forEach(custom => {
    formatText = formatText.replace(custom.regex, match => {
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
    callback: text2 => {
      let formatQuery = text2;
      // 将预处理的文案，还原成用户自定义格式。
      if (!_isEmpty(customMap)) {
        // reserved的目的是，先将id值大的先进行替换。如unique_11会被unique_1匹配到。导致bug
        const entries = Object.entries(customMap).reverse();
        entries.forEach(custom => {
          if (typeof custom[1].replacer === 'function') {
            formatQuery = formatQuery.replace(new RegExp(custom[0], 'g'), () =>
              custom[1].replacer(custom[1].match),
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
        result = line
          .trim()
          .split(' ')
          .pop();
        break;
      }
    }
  }
  if (!result) {
    result = sentence
      .trim()
      .split(' ')
      .pop();
  }
  return result;
  // return Object.keys(TokenMap.ODPSSQL).includes(result.toUpperCase()) ? result : LOG_ID
}

function findItemInSuggestion(arr, item) {
  return !!arr.find(i => String(i?.insertText).toUpperCase() === String(item).toUpperCase());
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

function toSeverity(lsSeverity?: number): MarkerSeverity {
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
    severity: toSeverity(diag?.severity),
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
