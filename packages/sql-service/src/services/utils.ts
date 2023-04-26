import { CompletionProviderOptions, SQLType } from './types';

import { CancellationToken, Thenable } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
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

export declare type MarkedString = string | {
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
  if (options.query) {
    if (options.query.url === 'mock') {
      /** Demos场景下，提供mock数据*/
      final.request = () =>
        Promise.resolve({
          data: {
            allEntities: true,
            entities: [
              {
                name: 'sampleOne',
                des: '样例数据，补充前缀场景',
                parentEntityName: 'prefix_will_be_insert',
                type: 'SAMPLE_TYPE_ONE',
              },
              {
                name: 'sampleTwo',
                des: '样例数据，无前缀场景',
                parentEntityName: 'prefix_will_not_be_insert',
                type: 'SAMPLE_TYPE_TWO',
              },
            ],
          },
        });
    } else {
      let completeUrl = `${options.query.url}?`;
      Object.entries(options.query.params).forEach(([key, value]) => {
        completeUrl += `${key}=${value}&`;
      });

      final.request = (keyword, sqlType: SQLType = SQLType.DQL) => {
        return fetch(
          `${completeUrl}keyword=${encodeURIComponent(keyword || '')}&sqlType=${sqlType}`,
          {
            credentials: 'include',
          },
        )
          .then(data => data.json())
          .catch(err => console.error(err));
      };
    }
  }

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
  contents: MarkupContent | MarkedString | MarkedString[],
): monaco.IMarkdownString[] {
  if (!contents) {
    return void 0;
  }
  if (Array.isArray(contents)) {
    return contents.map(toMarkdownString);
  }
  return [toMarkdownString(contents)];
}


export { transformOptions, wireCancellationToken, toMarkedStringArray };