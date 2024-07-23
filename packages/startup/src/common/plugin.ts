import { IPluginAPI, IPluginModule } from '@codeblitzjs/ide-core/lib/editor';

export class Plugin implements IPluginModule {
  PLUGIN_ID = 'PLUGIN_TEST';

  private _commands: IPluginAPI['commands'] | null = null;

  get commands() {
    return this._commands;
  }

  activate({ context, commands }: IPluginAPI) {
    this._commands = commands;
    context.subscriptions.push(
      commands.registerCommand('plugin.command.add', (x: number) => {
        commands.executeCommand('plugin.command.say', 'alex is great');
        return x + x;
      }),
    );
  }
}

export default new Plugin();
