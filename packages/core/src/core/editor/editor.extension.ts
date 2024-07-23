import { IPluginService } from '@codeblitzjs/ide-plugin';
import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IExtensionStorageService } from '@opensumi/ide-extension-storage';
import { ExtensionServiceImpl } from '@opensumi/ide-extension/lib/browser/extension.service';
import { ExtensionService } from '@opensumi/ide-extension/lib/common';
import { ExtensionActivateContribution } from '../extension/extension.contribution';

@Injectable()
class ExtensionServiceImplOverride extends ExtensionServiceImpl {
  @Autowired(IPluginService)
  pluginService: IPluginService;

  @Autowired(IExtensionStorageService)
  extensionStorageServiceOverride: IExtensionStorageService;

  async activate(): Promise<void> {
    await this.extensionStorageServiceOverride.whenReady;
    await this.lazyActivate();
    return Promise.resolve();
  }

  /**
   * 不阻塞启动
   * TODO: 目前使用私有属性，待升级后改造
   */
  async lazyActivate(this: any) {
    await this.initExtensionMetaData();
    await this.initExtensionInstanceData();
    await this.runEagerExtensionsContributes();
    await this.runExtensionContributes();
    await this.setupExtensionNLSConfig();
    this.doActivate();
    // 无需监听插件重启
  }
}

@Injectable()
export class ExtensionActivateModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ExtensionService,
      useClass: ExtensionServiceImplOverride,
      override: true,
    },
    ExtensionActivateContribution,
  ];
}
