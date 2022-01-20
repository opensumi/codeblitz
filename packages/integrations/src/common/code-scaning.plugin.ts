import { IPluginAPI, IPluginModule } from '@alipay/alex/lib/editor';

export class Plugin implements IPluginModule {
  PLUGIN_ID = 'CODE_SCANING';

  private _commands: IPluginAPI['commands'] | null = null;

  private _ready: boolean = false;

  private props: null = null;

  get commands() {
    return this._commands;
  }

  get ready() {
    return this._ready;
  }

  setProps(props) {
    this.props = props;
  }

  async activate({ context, commands }: IPluginAPI) {
    this._commands = commands;
    context.subscriptions.push(
      commands.registerCommand('antcode-cr.plugin.props', async () => {
        this._ready = true;
        return this.props;
      })
    );
  }

  deactivate() {
    this._commands = null;
  }
}

export default new Plugin();
