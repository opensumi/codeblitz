import { commands } from 'vscode';
import type { IPluginAPI, IPluginModule } from '@alipay/alex/lib/editor';


export default class SQLPlugin implements IPluginModule {
  /**
   * 插件 ID，用于唯一标识插件
   */
  PLUGIN_ID = 'sql-plugin';
  private _id: number;
  commands: IPluginAPI['commands'];
  static api: any;

  constructor(
    id: number
  ) {
    this._id = id;
  }

  /**
   * 激活插件
   */
  activate = ({ commands }: IPluginAPI) => {
    this.commands = commands;
    commands.registerCommand('alex.update.perference', async (key) => {
      return commands.executeCommand('')
    });
    console.log(commands)
  };

  /**
   * 注销插件，可在此时机清理副作用
   */
  deactivate() {}
}