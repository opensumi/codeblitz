interface PluginContextOptions {
  pluginId: string;
}

export class PluginContext {
  readonly subscriptions: { dispose(): any }[] = [];

  constructor(options: PluginContextOptions) {}
}
