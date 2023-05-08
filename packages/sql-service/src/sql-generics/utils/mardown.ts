import * as ls from 'vscode-languageserver-types';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
function isMarkupContent(thing: any): thing is ls.MarkupContent {
  return thing && typeof thing === 'object' && typeof (<ls.MarkupContent>thing).kind === 'string';
}

function toMarkdownString(entry: ls.MarkupContent | ls.MarkedString): monaco.IMarkdownString {
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
  contents: ls.MarkupContent | ls.MarkedString | ls.MarkedString[],
): monaco.IMarkdownString[] {
  if (!contents) {
    return [];
  }
  if (Array.isArray(contents)) {
    return contents.map(toMarkdownString);
  }
  return [toMarkdownString(contents)];
}

export { toMarkedStringArray };
