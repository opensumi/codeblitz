import { IPluginAPI, IPluginModule } from '@alipay/alex/lib/editor';

export class Plugin implements IPluginModule {
  PLUGIN_ID = 'CODE_SCANING';

  private _commands: IPluginAPI['commands'] | null = null;

  get commands() {
    return this._commands;
  }

  get ready() {
    return this._ready;
  }

  private _ready: boolean = false;

  async activate({ context, commands }: IPluginAPI) {
    this._commands = commands;
    context.subscriptions.push(
      // 判断 extension 注册成功
      commands.registerCommand('antcode-cr.plugin.ready', async () => {
        this._ready = (await commands.executeCommand('antcode-cr.ready')) as boolean;
        return true;
      })
    );
  }

  deactivate() {
    this._commands = null;
  }
}

export default new Plugin();
