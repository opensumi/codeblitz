import { Autowired, Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ExtensionServiceImpl } from '@ali/ide-kaitian-extension/lib/browser/extension.service';
import { IPluginService } from '@alipay/alex-plugin';
import { ExtensionService } from '@ali/ide-kaitian-extension/lib/common';
import { ExtensionActivateContribution } from '../extension/extension.contribution';

@Injectable()
class ExtensionServiceImplOverride extends ExtensionServiceImpl {
  @Autowired(IPluginService)
  pluginService: IPluginService;

  activate(): Promise<void> {
    this.lazyActivate();
    return Promise.resolve();
  }

  /**
   * 不阻塞启动
   * TODO: 目前使用私有属性，待升级后改造
   */
  async lazyActivate(this: any) {
    await this.initExtensionMetaData();
    await this.initExtensionInstanceData();
    await this.runExtensionContributes();
    await this.initThemeAndColor();
    this.doActivate();
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
