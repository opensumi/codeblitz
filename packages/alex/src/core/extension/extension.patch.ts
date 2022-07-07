import { MainThreadLanguages } from '@opensumi/ide-extension/lib/browser/vscode/api/main.thread.language';
import { AbstractExtInstanceManagementService } from '@opensumi/ide-extension/lib/browser/types';

import { disposableCollection } from '../patch';

import { ExtensionClientAppContribution } from '@opensumi/ide-extension/lib/browser/extension.contribution';
import { FileServiceClient } from '@opensumi/ide-file-service/lib/browser/file-service-client';

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

disposableCollection.push((injector) => {
  (
    injector.get(AbstractExtInstanceManagementService) as AbstractExtInstanceManagementService
  ).dispose();
});

ExtensionClientAppContribution.prototype.onDisposeSideEffects = function () {
  // 临时修复 防止dispose报错
};
