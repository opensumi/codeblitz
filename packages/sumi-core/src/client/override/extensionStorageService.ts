import { Injectable } from '@opensumi/di';
import { ClientAppContribution, Domain } from '@opensumi/ide-core-browser';
import { IExtensionStorageService } from '@opensumi/ide-extension-storage';
import { ExtensionStorageService } from '@opensumi/ide-extension-storage/lib/browser/storage.service';

// TODO
// 这里手动初始化 否则 ExtensionStoragePathServer 中 deferredStoragePath 会卡住

@Domain(ClientAppContribution)
export class ExtensionStorageServiceOverride extends ExtensionStorageService
  implements IExtensionStorageService, ClientAppContribution
{
  constructor() {
    super();
  }

  initialize() {}
}
