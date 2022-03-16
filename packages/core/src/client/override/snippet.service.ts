import { Injectable } from '@ali/common-di';
import {
  MonacoSnippetSuggestProvider,
  SnippetLoadOptions,
} from '@ali/ide-monaco/lib/browser/monaco-snippet-suggest-provider';
import { URI } from '@ali/ide-core-common';

// kaitian 中对资源都默认是根据 file 协议处理，node 和 worker 协议不一样
// 需要统一在 kaitian 中修复处理
// 先临时修复发版
@Injectable()
export class MonacoSnippetSuggestProviderOverride extends MonacoSnippetSuggestProvider {
  fromPath(path: string, options: SnippetLoadOptions): Promise<void> {
    const snippetURI = URI.parse(options.extPath).resolve(path.replace(/^\.\//, ''));
    const pending = this.loadURI(snippetURI.codeUri, options);
    const { language } = options;
    const scopes = Array.isArray(language) ? language : !!language ? [language] : ['*'];
    for (const scope of scopes) {
      const pendingSnippets = this.pendingSnippets.get(scope) || [];
      pendingSnippets.push(pending);
      this.pendingSnippets.set(scope, pendingSnippets);
    }
    return pending;
  }
}

export { MonacoSnippetSuggestProvider };
