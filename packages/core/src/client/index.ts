import { Injectable, Injector, ConstructorOf, Provider } from '@ali/common-di';
import {
  BrowserModule,
  ClientApp as BasicClientApp,
  IAppRenderer,
  IClientAppOpts,
  NO_KEYBINDING_NAME,
} from '@ali/ide-core-browser';
import { BasicModule, isOSX, DisposableCollection } from '@ali/ide-core-common';
import { WSChannelHandler } from '@ali/ide-connection';
// import { WorkerExtensionService } from '@ali/ide-kaitian-extension/lib/browser/extension.worker.service';
// import { WorkerExtensionServicePatch } from './patch/extension.worker.service';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import { TextmateServicePatch } from './patch/textmate.service';

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
    // {
    //   token: WorkerExtensionService,
    //   useClass: WorkerExtensionServicePatch,
    // },
    {
      token: TextmateService,
      useClass: TextmateServicePatch,
    },
  ];
  preferences = injectDebugPreferences;
}

export interface IAppOpts extends IClientAppOpts, IServerAppOpts {}

export { IClientAppOpts };

export class ClientApp extends BasicClientApp {
  private disposeCollection = new DisposableCollection();

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

  /**
   * 注册全局事件监听
   * TODO: kaitian 中无 removeEventLister 逻辑，这里 override 下，待提 mr
   */
  protected registerEventListeners(): void {
    const addEventListener = (
      target: Window | HTMLElement,
      type: string,
      listener: (...args: any[]) => any,
      ...extra: any
    ) => {
      target.addEventListener(type, listener, ...extra);
      this.disposeCollection.push({
        dispose() {
          target.removeEventListener(type, listener, ...extra);
        },
      });
    };

    addEventListener(window, 'beforeunload', (event) => {
      // 为了避免不必要的弹窗，如果页面并没有发生交互浏览器可能不会展示在 beforeunload 事件中引发的弹框，甚至可能即使发生交互了也直接不显示。
      if (this.preventStop()) {
        (event || window.event).returnValue = true;
        return true;
      }
    });
    addEventListener(window, 'unload', () => {
      // 浏览器关闭事件
      this.stateService.state = 'closing_window';
      this.stopContributions();
    });

    addEventListener(window, 'resize', () => {
      // 浏览器resize事件
    });
    // 处理中文输入回退时可能出现多个光标问题
    // https://github.com/eclipse-theia/theia/pull/6673
    let inComposition = false;
    addEventListener(window, 'compositionstart', (event) => {
      inComposition = true;
    });
    addEventListener(window, 'compositionend', (event) => {
      inComposition = false;
    });
    addEventListener(
      window,
      'keydown',
      (event: any) => {
        if (event && event.target!.name !== NO_KEYBINDING_NAME && !inComposition) {
          this.keybindingService.run(event);
        }
      },
      true
    );

    if (isOSX) {
      addEventListener(
        document.body,
        'wheel',
        (event) => {
          // 屏蔽在OSX系统浏览器中由于滚动导致的前进后退事件
        },
        { passive: false }
      );
    }
  }

  /**
   * kaitian 中没有注销注册在 window 上的事件
   */
  dispose() {
    this.disposeCollection.dispose();
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
