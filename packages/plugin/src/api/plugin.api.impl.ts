import { Injector } from '@opensumi/di';
import type * as vscode from 'vscode';
import { IPluginAPI, IPluginModule } from '../types';
import { PluginCommands } from './plugin.commands';

export const createAPIFactory = (injector: Injector) => {
  let pluginCommands: PluginCommands = injector.get(PluginCommands);

  const factory = (plugin: IPluginModule): IPluginAPI => {
    const commands: any = {
      registerCommand(
        id: string,
        command: <T>(...args: any[]) => T | Thenable<T>,
        thisArgs?: any,
      ): vscode.Disposable {
        return pluginCommands.registerCommand(true, id, command, thisArgs);
      },
      executeCommand<T>(id: string, ...args: any[]): Thenable<T> {
        return pluginCommands.executeCommand<T>(id, ...args);
      },
      getCommands(filterInternal: boolean = false): Thenable<string[]> {
        return pluginCommands.getCommands(filterInternal);
      },

      afterExecuteCommand<T>(id: string, callback: (result: T) => void): vscode.Disposable {
        return pluginCommands.afterExecuteCommand<T>(id, callback);
      },
    };

    return {
      context: undefined!,
      commands,
    };
  };

  const dispose = () => {
    pluginCommands = null!;
  };

  return {
    factory,
    dispose,
  };
};
