import { Autowired, Injectable } from '@opensumi/di';
import { CommandRegistry, Disposable, getDebugLogger, IDisposable, isFunction } from '@opensumi/ide-core-common';
import { ICommandServiceToken } from '@opensumi/ide-monaco/lib/browser/contrib/command';
import type { IMonacoCommandService } from '@opensumi/ide-monaco/lib/browser/contrib/command';
type Handler<T = any> = (...args: any[]) => T | Promise<T>;

interface CommandHandler<T> {
  handler: Handler<T>;
  thisArg?: any;
}

// TODO: 注册和 vscode 一致的内置命令

@Injectable()
export class PluginCommands {
  protected readonly logger = getDebugLogger();
  protected readonly commands = new Map<string, CommandHandler<any>>();
  private readonly commandRegistrations = new Map<string, IDisposable>();

  @Autowired(CommandRegistry)
  commandRegistry: CommandRegistry;

  @Autowired(ICommandServiceToken)
  monacoCommandService: IMonacoCommandService;

  registerCommand(global: boolean, id: string, handler: Handler, thisArg?: any): IDisposable {
    this.logger.log('PluginCommands#registerCommand', id);

    if (!id.trim().length) {
      throw new Error('invalid id');
    }

    if (this.commands.has(id)) {
      throw new Error(`command '${id}' already exists`);
    }

    if (isFunction(handler)) {
      this.commands.set(id, {
        handler,
        thisArg,
      });
    } else {
      this.commands.set(id, handler);
    }
    if (global) {
      const disposer = new Disposable();

      const execute = (...args: any[]) => {
        return this.executeLocalCommand(id, args);
      };

      const command = this.commandRegistry.getCommand(id);
      if (command) {
        disposer.addDispose(this.commandRegistry.registerHandler(id, { execute }));
      } else {
        disposer.addDispose(this.commandRegistry.registerCommand({ id }, { execute }));
      }

      this.commandRegistrations.set(id, disposer);
    }

    return Disposable.create(() => {
      if (this.commands.delete(id)) {
        if (global) {
          const command = this.commandRegistrations.get(id);
          if (command) {
            command.dispose();
            this.commandRegistrations.delete(id);
          }
        }
      }
    });
  }

  async executeCommand<T>(id: string, ...args: any[]): Promise<T | undefined> {
    this.logger.log('PluginCommands#executeCommand', id, args);

    if (this.commands.has(id)) {
      return this.executeLocalCommand<T>(id, args);
    }
    return this.monacoCommandService.executeCommand(id, ...args);
  }

  async getCommands(filterUnderscoreCommands: boolean = false): Promise<string[]> {
    this.logger.log('PluginCommands#getCommands', filterUnderscoreCommands);

    const result = this.commandRegistry.getCommands().map((command) => command.id);
    if (filterUnderscoreCommands) {
      return result.filter((command) => command[0] !== '_');
    }
    return result;
  }

  private executeLocalCommand<T>(id: string, args: any[]): Promise<T> {
    const commandHandler = this.commands.get(id);
    if (!commandHandler) {
      throw new Error(`Command ${id} no handler`);
    }
    const { handler, thisArg } = commandHandler;

    try {
      const result = handler.apply(thisArg, args);
      return Promise.resolve(result);
    } catch (err) {
      this.logger.error(err, id);
      return Promise.reject(new Error(`Running the contributed command:'${id}' failed.`));
    }
  }

  afterExecuteCommand<T>(id: string, callback: (result: T) => void): IDisposable {
    this.logger.log('PluginCommands#afterExecuteCommand', id);
    return this.commandRegistry.afterExecuteCommand(id, callback);
  }

  dispose() {
    this.commandRegistrations.forEach((comamnd) => {
      comamnd.dispose();
    });
    this.commandRegistrations.clear();
    this.commands.clear();
  }
}
