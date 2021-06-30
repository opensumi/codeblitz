import { ExtensionServiceImpl } from '@ali/ide-kaitian-extension/lib/browser/extension.service';
import { MainThreadLanguages } from '@ali/ide-kaitian-extension/lib/browser/vscode/api/main.thread.language';

// TODO：待 kaitian 中去掉，临时覆盖掉实现，这样 loader 可移除了
ExtensionServiceImpl.prototype.initCommonBrowserDependency = () => Promise.resolve();
ExtensionServiceImpl.prototype.initKaitianBrowserAPIDependency = () => Promise.resolve();

// TODO: PR to kaitian, monaco 内会 dispose，先临时 override
// @ts-ignore
const _createSignatureHelpProvider = MainThreadLanguages.prototype.createSignatureHelpProvider;
// @ts-ignore
MainThreadLanguages.prototype.createSignatureHelpProvider = function (...args: any[]) {
  const provider = _createSignatureHelpProvider.call(this, ...args);
  const _provideSignatureHelp = provider.provideSignatureHelp;
  provider.provideSignatureHelp = function (...args: any[]) {
    return (_provideSignatureHelp.call(this, ...args) as Promise<any>).then((v) => {
      if (v) {
        v.dispose = () => {};
      }
      return v;
    });
  };
  return provider;
};
