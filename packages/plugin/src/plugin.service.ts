import { Injectable, Autowired, Injector, INJECTOR_TOKEN } from '@ali/common-di';
import { Deferred } from '@ali/ide-core-common';
import { IPluginModule, IPluginAPI } from './types';
import { createAPIFactory } from './api/plugin.api.impl';
import { PluginContext } from './api/plugin.context';

interface ActivatorPlugin {
  subscriptions: { dispose(): any }[];
}

@Injectable()
export class PluginService {
  private plugins: IPluginModule[];
  private pluginAPIFactory: (plugin: IPluginModule) => IPluginAPI;
  private pluginActivator = new Map<string, ActivatorPlugin>();

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  constructor() {
    this.pluginAPIFactory = createAPIFactory(this.injector);
  }

  readonly whenReady = new Deferred();

  activate(plugins: IPluginModule[]) {
    this.plugins = plugins.slice();
    plugins.forEach((plugin) => this.activatePlugin(plugin));
    this.whenReady.resolve();
  }

  deactivate() {
    this.plugins.forEach((plugin) => {
      try {
        plugin.deactivate?.();
      } catch (err) {
        console.error(`
          [Alex Plugin]: deactivate plugin module error ${err.message} \n\n
          Stack: ${err.stack && err.stack}
        `);
        return err;
      }

      this.pluginActivator.get(plugin.PLUGIN_ID)?.subscriptions.forEach((disposable) => {
        try {
          disposable.dispose();
        } catch (e) {
          console.log('plugin deactivated error');
          console.warn(e);
        }
      });
    });
  }

  private activatePlugin(plugin: IPluginModule) {
    if (!plugin.PLUGIN_ID) {
      throw new Error('Must provider `PLUGIN_ID` for plugin');
    }

    if (plugin.activate) {
      const api = this.pluginAPIFactory(plugin);
      const context = new PluginContext({ pluginId: plugin.PLUGIN_ID });
      api.context = context;
      plugin.activate(api);
      this.pluginActivator.set(plugin.PLUGIN_ID, { subscriptions: context.subscriptions });
    }
  }
}
