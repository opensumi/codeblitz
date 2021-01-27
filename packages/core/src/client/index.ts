import { Injectable, Injector, ConstructorOf, Provider } from '@ali/common-di';
import {
  BrowserModule,
  ClientApp as BasicClientApp,
  IAppRenderer,
  IClientAppOpts,
} from '@ali/ide-core-browser';
import { BasicModule } from '@ali/ide-core-common';
import { WSChannelHandler } from '@ali/ide-connection';

import { FCServiceCenter, ClientPort, initFCService } from '../connection';
import { KaitianExtFsProvider, KtExtFsProviderContribution } from './extension';
import { TextmateLanguageGrammarContribution } from './textmate-language-grammar/index.contribution';
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base';
import { LanguageGrammarRegistrationService } from './textmate-language-grammar/language-grammar.service';
import { injectDebugPreferences } from './debug';
import { IServerApp } from '../common';
import { IServerAppOpts, ServerApp } from '../server/core/app';
import { isBackServicesInBrowser } from '../common/util';
import {
  FileTreeCustomContribution,
  EditorActionEventContribution,
  MenuConfigContribution,
} from './custom';
import { EditorEmptyContribution } from './editor-empty/editor-empty.contribution';
import { WelcomeContribution } from './welcome/welcome.contributon';

export * from './extension';

export { TextmateLanguageGrammarContribution, LanguageGrammarRegistrationService };

export type ModuleConstructor = ConstructorOf<BrowserModule>;

@Injectable()
export class ClientModule extends BrowserModule {
  providers = [
    KaitianExtFsProvider,
    KtExtFsProviderContribution,
    TextmateLanguageGrammarContribution,
    {
      token: ILanguageGrammarRegistrationService,
      useClass: LanguageGrammarRegistrationService,
    },
    FileTreeCustomContribution,
    EditorActionEventContribution,
    EditorEmptyContribution,
    WelcomeContribution,
    MenuConfigContribution,
  ];
  preferences = injectDebugPreferences;
}

export interface IAppOpts extends IClientAppOpts, IServerAppOpts {}

export { IClientAppOpts };

export class ClientApp extends BasicClientApp {
  private disposed = false;

  constructor(opts: IAppOpts) {
    super(opts);
    this.initServer(opts);
  }

  private initServer(opts: IAppOpts) {
    const serverApp = new ServerApp({
      injector: this.injector,
      modules: this.modules,
      appConfig: this.config,
      logDir: opts.logDir,
      logLevel: opts.logLevel,
      LogServiceClass: opts.LogServiceClass,
      extensionMetadata: opts.extensionMetadata,
      blockPatterns: opts.blockPatterns,
    });
    this.injector.addProviders({
      token: IServerApp,
      useValue: serverApp,
    });
  }

  public async start(container: HTMLElement | IAppRenderer, type?: string): Promise<void> {
    // 先启动 server 进行必要的初始化，应用的权限等也在 server 中处理
    await (this.injector.get(IServerApp) as IServerApp).start();
    bindConnectionService(this.injector, this.modules);
    // 避免 KaitianExtensionClientAppContribution.onStop 报错
    this.injector.addProviders({
      token: WSChannelHandler,
      useValue: { clientId: 'alex' },
    });
    return super.start(container, type);
  }

  stopContributions() {
    if (!this.disposed) {
      super.stopContributions();
    }
  }

  preventStop() {
    if (!this.disposed) {
      return super.preventStop();
    }
    return false;
  }

  /**
   * kaitian 中没有注销注册在 window 上上的事件，在把 IDE 销毁后，此时刷新页面依然会执行事件
   * 此时 injector.get 都会报错，因此这里加个状态判断
   */
  dispose() {
    this.disposed = true;
  }
}

export async function bindConnectionService(injector: Injector, modules: ModuleConstructor[]) {
  const clientCenter = new FCServiceCenter(ClientPort);

  const { getFCService } = initFCService(clientCenter);

  for (const module of modules) {
    const moduleInstance = injector.get(module) as BasicModule;
    if (!moduleInstance.backServices) {
      continue;
    }
    for (const backService of moduleInstance.backServices) {
      if (!isBackServicesInBrowser(backService)) {
        continue;
      }
      const { servicePath } = backService;
      const fcService = getFCService(servicePath);

      const injectService = {
        token: servicePath,
        useValue: fcService,
      } as Provider;

      injector.addProviders(injectService);

      if (backService.clientToken) {
        const clientService = injector.get(backService.clientToken);
        fcService.onRequestService(clientService);
      }
    }
  }
}
