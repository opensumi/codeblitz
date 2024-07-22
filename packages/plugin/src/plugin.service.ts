import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import { Deferred } from '@opensumi/ide-core-common';
import { createAPIFactory } from './api/plugin.api.impl';
import { PluginContext } from './api/plugin.context';
import { IPluginAPI, IPluginModule } from './types';

interface ActivatorPlugin {
  subscriptions: { dispose(): any }[];
}

@Injectable()
export class PluginService {
  private plugins: IPluginModule[];
  private pluginAPIFactory: (plugin: IPluginModule) => IPluginAPI;
  private pluginDispose: () => void;
  private pluginActivator = new Map<string, ActivatorPlugin>();

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  constructor() {
    const { factory, dispose } = createAPIFactory(this.injector);
    this.pluginAPIFactory = factory;
    this.pluginDispose = dispose;
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
      } catch (err: any) {
        console.error(`
          [Alex Plugin]: deactivate plugin module error ${err.message} \n\n
          Stack: ${err.stack && err.stack}
        `);
        return err;
      }

      const subscriptions = this.pluginActivator.get(plugin.PLUGIN_ID)?.subscriptions;

      if (subscriptions) {
        subscriptions.forEach((disposable) => {
          try {
            disposable.dispose();
          } catch (e) {
            console.log('plugin deactivated error');
            console.warn(e);
          }
        });
        subscriptions.length = 0;
      }
    });

    this.pluginDispose();
  }

  private activatePlugin(plugin: IPluginModule) {
    if (!plugin.PLUGIN_ID) {
      throw new Error('Must provide `PLUGIN_ID` for plugin');
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
