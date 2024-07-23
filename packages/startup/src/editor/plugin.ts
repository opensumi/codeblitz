import { IPluginAPI } from '@codeblitzjs/ide-core/lib/editor';

export const PLUGIN_ID = 'editor';

let _commands: IPluginAPI['commands'] | null = null;

export const api = {
  get commands() {
    return _commands;
  },
};

export const activate = ({ context, commands }: IPluginAPI) => {
  _commands = commands;
  context.subscriptions.push(
    commands.registerCommand('plugin.command.add', async (x: number) => {
      commands.executeCommand('plugin.command.say', 'alex is great');
      return x + x;
    }),
    commands.registerCommand('plugin.command.changeTheme', (value) => {
      commands.executeCommand('alex.setDefaultPreference', 'general.theme', value, 1);
    }),
    commands.afterExecuteCommand('plugin.command.add', (result) => {
      console.log('afterExecuteCommand plugin.command.add', result);
    }),
  );
};
