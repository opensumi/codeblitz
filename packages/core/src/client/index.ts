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
import {
  MonacoCodeService,
  IMonacoCodeService,
  codeServiceEditor,
} from './override/codeEditorService';

export * from './extension';

export { TextmateLanguageGrammarContribution, LanguageGrammarRegistrationService };

export type ModuleConstructor = ConstructorOf<BrowserModule>;

@Injectable()
export class ClientModule extends BrowserModule {
  providers: Provider[] = [
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
    {
      token: MonacoCodeService,
      useValue: codeServiceEditor,
    },
    {
      token: IMonacoCodeService,
      useClass: MonacoCodeService,
    },
  ];
  preferences = injectDebugPreferences;
}

export interface IAppOpts extends IClientAppOpts, IServerAppOpts {}

export { IClientAppOpts };

export class ClientApp extends BasicClientApp {
  private clearInjector: () => void;

  constructor(opts: IAppOpts) {
    super(opts);
    this.initServer(opts);
    this.initCodeServiceEditor();
  }

  initCodeServiceEditor() {
    this.clearInjector = codeServiceEditor.setInjector(this.injector);
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

  dispose() {
    super.dispose();
    this.clearInjector();
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
