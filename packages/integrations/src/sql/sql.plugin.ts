import type { IPluginAPI } from '@alipay/alex';

export const PLUGIN_ID = 'sql-plugin';
let _commands: IPluginAPI['commands'] | null = null;

export const api = {
  get commands() {
    return _commands;
  },
};

export const activate = ({ commands }: IPluginAPI) => {
  // 只需获取command 方法
  _commands = commands;
};
