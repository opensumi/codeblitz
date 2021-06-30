import { Autowired } from '@ali/common-di';
import { Domain, ClientAppContribution, IEventBus } from '@ali/ide-core-browser';
import { ExtensionBeforeActivateEvent } from '@ali/ide-kaitian-extension/lib/browser/types';
import { IPluginService } from '@alipay/alex-plugin';

@Domain(ClientAppContribution)
export class ExtensionActivateContribution implements ClientAppContribution {
  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  @Autowired(IPluginService)
  pluginService: IPluginService;

  initialize() {
    this.eventBus.on(ExtensionBeforeActivateEvent, async () => {
      try {
        // 确保插件先激活
        await this.pluginService.whenReady.promise;
      } catch (e) {
        console.error(e);
      }
    });
  }
}
