import { Autowired } from '@ali/common-di';
import { ClientAppContribution, Domain } from '@ali/ide-core-browser';
import { IPluginService, IPluginConfig } from './types';

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
    this.pluginService.deactivate();
  }
}
