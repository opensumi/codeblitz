import { MonacoTextModelService } from '@opensumi/ide-editor/lib/browser/doc-model/override';
import { Injector } from '@opensumi/di';

import {
  ICommandServiceToken,
  IMonacoActionRegistry,
  IMonacoCommandsRegistry,
  IMonacoCommandService,
  ICommandEvent,
  ICommandService,
} from '@opensumi/ide-monaco/lib/browser/contrib/command';
import { Event } from '@opensumi/ide-monaco';

export const IMonacoCommandServiceProxy = Symbol('IMonacoCommandServiceProxy');
export { MonacoTextModelService };

class MonacoCommandServiceProxy implements IMonacoCommandService {
  _serviceBrand: undefined;

  private injector: Injector | null = null;
  private uid = 0;

  setInjector(injector: Injector) {
    this.injector = injector;
    this.uid++;
    const currentUId = this.uid;
    return {
      dispose: () => {
        if (currentUId === this.uid && this.injector) {
          this.injector = null;
        }
      },
    };
  }

  setDelegate(delegate: ICommandService): void {
    return this.injector!.get(IMonacoCommandServiceProxy).setDelegate(delegate);
  }
  get onWillExecuteCommand(): Event<ICommandEvent> {
    return this.injector!.get(IMonacoCommandServiceProxy).onWillExecuteCommand;
  }
  get onDidExecuteCommand(): Event<ICommandEvent> {
    return this.injector!.get(IMonacoCommandServiceProxy).onDidExecuteCommand;
  }
  executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined> {
    return this.injector!.get(IMonacoCommandServiceProxy).executeCommand(commandId, ...args);
  }
}

export const monacoCommandServiceProxy = new MonacoCommandServiceProxy();
