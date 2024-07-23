import type { Deferred, IDisposable } from '@opensumi/ide-core-common';

export const IPluginConfig = Symbol('IPluginConfig');

export type IPluginConfig = IPluginModule[];

export const IPluginService = Symbol('IPluginService');

export interface IPluginService {
  whenReady: Deferred<void>;
  activate(plugins: IPluginModule[]): void;
  deactivate(): void;
}

/**
 * Plugin API
 */
export interface IPluginAPI {
  context: {
    readonly subscriptions: { dispose(): any }[];
  };

  commands: {
    /**
     * 注册一个命令，类型和 vscode.commands.registerCommand 类似
     */
    registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): IDisposable;

    /**
     * 执行命令，类型和 vscode.commands.executeCommand 类似
     */
    executeCommand<T>(command: string, ...rest: any[]): Thenable<T | undefined>;

    /**
     * 检索所有可用命令列表，以 _ 开头的为内置命令，类型和 vscode.commands.getCommands 类似
     */
    getCommands(filterInternal?: boolean): Thenable<string[]>;

    /**
     * 注册一个命令执行后的钩子，类型和 vscode.commands.afterExecuteCommand 类似
     */
    afterExecuteCommand<T>(command: string, callback: (result: T) => void): IDisposable;
  };
}

export interface IPluginModule {
  /**
   * 插件 ID，用于唯一标识插件
   */
  PLUGIN_ID: string;
  /**
   * 激活插件
   */
  activate?(ctx: IPluginAPI): void | Promise<void>;
  /**
   * 注销插件，可在此时机清理副作用
   */
  deactivate?(): void;
}
