import { Autowired } from '@opensumi/di';
import { ClientAppContribution, Domain } from '@opensumi/ide-core-browser';
import { IPluginConfig, IPluginService } from './types';

@Domain(ClientAppContribution)
export class PluginContribution implements ClientAppContribution {
  @Autowired(IPluginService)
  pluginService: IPluginService;

  @Autowired(IPluginConfig)
  pluginConfig: IPluginConfig;

  onStart() {
    this.pluginService.activate(this.pluginConfig || []);
  }

  dispose() {
    // dispose 阶段不保证顺序，如果 IPluginService 比 PluginContribution 先 dispose，会导致此时 `this.pluginService` 为空
    if (this.pluginService) {
      this.pluginService.deactivate();
    }
  }
}
