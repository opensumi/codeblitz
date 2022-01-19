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
      commands.registerCommand('antcode-cr.plugin.ready', async () => {
        this._ready = (await commands.executeCommand('antcode-cr.ready')) as boolean;
        return true;
      }),

      commands.registerCommand('antcode-cr.plugin.update.annotations', async (props) => {
        try {
          await commands.executeCommand('antcode-cr.update', 'annotations', props);
        } catch (err) {
          console.log('CODE_SCANING PLUGIN ERR', err);
        }
      }),
      commands.registerCommand('antcode-cr.plugin.update.comments', async (props) => {
        try {
          await commands.executeCommand('antcode-cr.update', 'comments', props);
        } catch (err) {
          console.log('CODE_SCANING PLUGIN ERR', err);
        }
      }),
      commands.registerCommand('antcode-cr.plugin.update.replyIdSet', async (props) => {
        try {
          await commands.executeCommand('antcode-cr.update', 'replyIdSet', props);
        } catch (err) {
          console.log('CODE_SCANING PLUGIN ERR', err);
        }
      })
    );
  }

  deactivate() {
    this._commands = null;
  }
}

export default new Plugin();
