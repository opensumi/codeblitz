import { Injectable, Injector, ConstructorOf, Provider } from '@ali/common-di';
import {
  BrowserModule,
  ClientApp as BasicClientApp,
  IAppRenderer,
  IClientAppOpts as IBasicClientAppOpts,
} from '@ali/ide-core-browser';
import { BasicModule } from '@ali/ide-core-common';

import { FCServiceCenter, ClientPort, initFCService } from '../connection';
import { KaitianExtFsProvider, KtExtFsProviderContribution } from './extension';
import { TextmateLanguageGrammarContribution } from './textmate-language-grammar/index.contribution';
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base';
import { LanguageGrammarRegistrationService } from './textmate-language-grammar/language-grammar.service';
import { injectDebugPreferences } from './debug';
import { IServerApp } from '../common';
import { IServerAppOpts, ServerApp } from '../server/core/app';
import { isBackServicesInBrowser } from '../common/util';
import { RuntimeConfig } from '../common/types';

export * from './extension';

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
  ];
  preferences = injectDebugPreferences;
}

export interface IClientAppOpts extends IBasicClientAppOpts {
  serverOptions?: IServerAppOpts;
  runtimeConfig?: RuntimeConfig;
}

export class ClientApp extends BasicClientApp {
  constructor(opts: IClientAppOpts) {
    super(opts);

    const runtimeConfig = opts.runtimeConfig || {};
    // 基于场景的运行时数据
    this.injector.addProviders({
      token: RuntimeConfig,
      useValue: runtimeConfig,
    });

    (window as any)[RuntimeConfig] = runtimeConfig;

    this.initServer(opts);
  }

  private initServer(opts: IClientAppOpts) {
    const serverApp = new ServerApp({
      injector: this.injector,
      workspaceDir: opts.workspaceDir,
      extensionDir: opts.extensionDir,
      extensionMetadata: opts.serverOptions?.extensionMetadata,
      modules: this.modules,
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
    return super.start(container, type);
  }

  public dispose() {
    this.injector.disposeAll();
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
