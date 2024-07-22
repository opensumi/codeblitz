import { Injectable } from '@opensumi/di';
import { Disposable, DisposableCollection, IDisposable, URI } from '@opensumi/ide-core-common';
import {
  MonacoSnippetSuggestProvider,
  SnippetLoadOptions,
} from '@opensumi/ide-monaco/lib/browser/monaco-snippet-suggest-provider';

// opensumi 中对资源都默认是根据 file 协议处理，node 和 worker 协议不一样
// 需要统一在 opensumi 中修复处理
// 先临时修复发版
@Injectable()
export class MonacoSnippetSuggestProviderOverride extends MonacoSnippetSuggestProvider {
  fromPath(path: string, options: SnippetLoadOptions): IDisposable {
    const toDispose = new DisposableCollection(
      Disposable.create(() => {
        /* mark as not disposed */
      }),
    );
    const snippetURI = URI.parse(options.extPath).resolve(path.replace(/^\.\//, ''));
    const pending = this.loadURI(snippetURI.codeUri, options, toDispose);
    const { language } = options;
    const scopes = Array.isArray(language) ? language : !!language ? [language] : ['*'];
    for (const scope of scopes) {
      const pendingSnippets = this.pendingSnippets.get(scope) || [];
      pendingSnippets.push(pending);
      this.pendingSnippets.set(scope, pendingSnippets);
    }
    return toDispose;
  }
}

export { MonacoSnippetSuggestProvider };
