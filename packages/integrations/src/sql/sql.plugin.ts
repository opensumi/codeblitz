import type { IPluginAPI } from '@alipay/alex/lib/editor';

export const PLUGIN_ID = 'sql-plugin';
let _commands: IPluginAPI['commands'] | null = null;

export const api = {
  get commands() {
    return _commands;
  },
};

export const activate = ({ commands }: IPluginAPI) => {
  _commands = commands;
  commands.registerCommand('alex.update.perference', async (key) => {
    return commands.executeCommand('')
  });
};
