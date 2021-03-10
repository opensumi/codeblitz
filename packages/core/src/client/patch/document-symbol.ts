import { DocumentSymbolStore } from '@ali/ide-editor/lib/browser/breadcrumb/document-symbol';
import { IDisposable } from '@ali/ide-core-common';

export { DocumentSymbolStore };

let _onDidChange: any;

/**
 * TODO: PR 到 kaitian 中
 */
export class DocumentSymbolPatch extends DocumentSymbolStore {
  constructor() {
    const monaco: any = window.monaco;
    if (!_onDidChange) {
      _onDidChange = monaco.modes.DocumentSymbolProviderRegistry.onDidChange;
    }
    let disposer: IDisposable | null = null;
    Object.defineProperty(monaco.modes.DocumentSymbolProviderRegistry, 'onDidChange', {
      value: function (...args: any[]) {
        disposer = _onDidChange.call(this, ...args);
        return disposer;
      },
      configurable: true,
    });
    super();
    if (disposer) {
      this.addDispose(disposer);
    }
  }
}
