import { Autowired, Injectable } from '@opensumi/di';
import { ClientAppStateService } from '@opensumi/ide-core-browser';
import {
  CommandService,
  Deferred,
  IStorage,
  localize,
  MessageType,
  STORAGE_SCHEMA,
  StorageProvider,
  URI,
} from '@opensumi/ide-core-common';
import { IDialogService, IMessageService } from '@opensumi/ide-overlay';
import { DialogService } from '@opensumi/ide-overlay/lib/browser/dialog.service';
import { CodePlatformRegistry } from './config';
import { ATOMGIT_PRIVATE_TOKEN, GITEE_PRIVATE_TOKEN, GITHUB_OAUTH_TOKEN, GITLAB_PRIVATE_TOKEN } from './constant';
import { ICodePlatform } from './types';

/**
 * 使用 localStorage 存储 token 够用了
 * TODO: 需要简单加密下 token
 */

@Injectable()
export class HelperService {
  @Autowired(StorageProvider)
  private provideStorage: StorageProvider;

  @Autowired(CommandService)
  private readonly commandService: CommandService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired(IDialogService)
  public dialogService: DialogService;

  @Autowired(ClientAppStateService)
  stateService: ClientAppStateService;

  private _storageDeferred: Deferred<IStorage>;

  async getStorage() {
    if (!this._storageDeferred) {
      this._storageDeferred = new Deferred();
      const storage = await this.provideStorage(
        new URI('code-api').withScheme(STORAGE_SCHEMA.SCOPE),
      );
      this._storageDeferred.resolve(storage);
    }
    return this._storageDeferred.promise;
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  get GITHUB_TOKEN() {
    return this.get(GITHUB_OAUTH_TOKEN);
  }

  set GITHUB_TOKEN(value: string | null) {
    if (value === null) {
      this.delete(GITHUB_OAUTH_TOKEN);
    } else {
      this.set(GITHUB_OAUTH_TOKEN, value);
    }
  }

  get GITLAB_TOKEN() {
    return this.get(GITLAB_PRIVATE_TOKEN);
  }

  set GITLAB_TOKEN(value: string | null) {
    if (value === null) {
      this.delete(GITLAB_PRIVATE_TOKEN);
    } else {
      this.set(GITLAB_PRIVATE_TOKEN, value);
    }
  }

  get ATOMGIT_TOKEN() {
    return this.get(ATOMGIT_PRIVATE_TOKEN);
  }

  set ATOMGIT_TOKEN(value: string | null) {
    if (value === null) {
      this.delete(ATOMGIT_PRIVATE_TOKEN);
    } else {
      this.set(ATOMGIT_PRIVATE_TOKEN, value);
    }
  }

  get GITEE_TOKEN() {
    return this.get(GITEE_PRIVATE_TOKEN);
  }

  set GITEE_TOKEN(value: string | null) {
    if (value === null) {
      this.delete(GITEE_PRIVATE_TOKEN);
    } else {
      this.set(GITEE_PRIVATE_TOKEN, value);
    }
  }

  async revealView(id: string) {
    await this.stateService.reachedState('ready');
    this.commandService.executeCommand(`workbench.view.${id}`);
  }

  reinitializeCodeService(isForce: boolean = false) {
    this.commandService.executeCommand('code-service.reinitialize', isForce);
  }

  showMessage(
    platform: ICodePlatform | string,
    msg: { type: MessageType; status?: number; symbol?: string; args?: any[]; message?: string },
    config?: { buttons?: string[]; closable?: boolean },
  ) {
    const message = `${msg.status ? `${msg.status} - ` : ''}${
      msg.symbol ? localize(msg.symbol, ...(msg.args || [])) : msg.message
    }`;
    const platformConfig = CodePlatformRegistry.instance().getPlatformConfig(platform);

    return this.messageService.open(
      message,
      msg.type,
      config?.buttons,
      config?.closable,
      platformConfig.brand,
    );
  }

  async showDialog(
    msg: {
      message: string | React.ReactNode;
      type: MessageType;
      buttons?: any[];
      closable?: boolean;
    },
  ) {
    const { message, type, buttons = [], closable = true } = msg;
    return this.dialogService.open(message, type, buttons, closable);
  }
}
