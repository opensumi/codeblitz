import { Autowired } from '@opensumi/di';
import { Domain, ClientAppContribution, IEventBus, Disposable } from '@opensumi/ide-core-browser';
import {
  ExtensionBeforeActivateEvent,
  ExtensionWillActivateEvent,
} from '@opensumi/ide-extension/lib/browser/types';
import { IPluginService } from '@alipay/alex-plugin';
import { IMainLayoutService } from '@opensumi/ide-main-layout';

@Domain(ClientAppContribution)
export class ExtensionActivateContribution extends Disposable implements ClientAppContribution {
  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  @Autowired(IPluginService)
  pluginService: IPluginService;

  @Autowired(IMainLayoutService)
  mainLayoutService: IMainLayoutService;

  initialize() {
    this.addDispose(
      this.eventBus.on(ExtensionBeforeActivateEvent, async () => {
        try {
          // 确保插件先激活
          await this.pluginService.whenReady.promise;
        } catch (e) {
          console.error(e);
        }
      })
    );

    // 如果有 browserMain，则等待 view ready，否则可能引起 bug
    // 待 kaitian 修复 https://yuque.antfin-inc.com/ide-framework/topics/629
    this.addDispose(
      this.eventBus.on(ExtensionWillActivateEvent, (e) => {
        if (e.payload.contributes.browserMain) {
          return this.mainLayoutService.viewReady.promise;
        }
        return Promise.resolve();
      })
    );
  }
}
