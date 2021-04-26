import { IPluginAPI } from '@alipay/alex/lib/editor';

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
    commands.registerCommand('plugin.command.add', (x: number) => {
      commands.executeCommand('plugin.command.say', 'alex is great');
      return x + x;
    })
  );
};
