import type { IPluginAPI } from '@alipay/alex/lib/editor';

export const PLUGIN_ID = 'sql-plugin';

export const activate = ({ commands }: IPluginAPI) => {
  commands.registerCommand('alex.update.perference', async (key) => {
    return commands.executeCommand('')
  });
};
