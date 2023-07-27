import { MonacoOverrides } from './override/monacoOverride/index';
import { Injectable, Injector, ConstructorOf, Provider } from '@opensumi/di';
import {
  BrowserModule,
  IAppRenderer,
  IClientAppOpts,
  PreferenceProviderProvider,
  PreferenceScope,
  PreferenceProvider,
  IContextKeyService,
} from '@opensumi/ide-core-browser';
import { ClientApp as BasicClientApp } from '@opensumi/ide-core-browser/lib/bootstrap/app';

import { BackService, BasicModule, Disposable } from '@opensumi/ide-core-common';
import { WSChannelHandler } from '@opensumi/ide-connection/lib/browser';

import { FCServiceCenter, ClientPort, initFCService } from '../connection';
import { OpenSumiExtFsProvider, KtExtFsProviderContribution } from './extension';
import { TextmateLanguageGrammarContribution } from './textmate-language-grammar/index.contribution';
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base';
import { LanguageGrammarRegistrationService } from './textmate-language-grammar/language-grammar.service';
import { injectDebugPreferences } from './debug';
import { IServerApp, RootFS } from '../common';
import { IServerAppOpts, ServerApp } from '../server/core/app';
import { isBackServicesInBrowser } from '../common/util';
import {
  FileTreeCustomContribution,
  EditorActionEventContribution,
  MenuConfigContribution,
} from './custom';
import { EditorEmptyContribution } from './editor-empty/editor-empty.contribution';
import { WelcomeContribution } from './welcome/welcome.contributon';
import { FileSchemeContribution } from './file-scheme/index.contribution';
import { PreferenceSettingContribution } from './preference/preference.setting.contribution';
import { LayoutRestoreContributation } from './layout/index.contribution';

import { BreadCrumbServiceImplOverride, IBreadCrumbService } from './override/breadcrumb.service';
import { SearchContribution } from './search/index.contribution';
import {
  MonacoSnippetSuggestProviderOverride,
  MonacoSnippetSuggestProvider,
} from './override/snippet.service';
import { IMonacoOverrideService, MonacoOverrideService } from './override/monacoContextKeyService';
import {
  VSCodeContributesServiceOverride,
  VSCodeContributesServiceToken,
} from './override/vscodeContributesService';

import {
  IMonacoCommandServiceProxy,
  monacoCommandServiceProxy,
} from './override/monacoOverride/commandService';
import { ICommandServiceToken } from '@opensumi/ide-monaco/lib/browser/contrib/command';
import { MonacoCommandService } from '@opensumi/ide-editor/lib/browser/monaco-contrib/command/command.service';
import {
  IMonacoCodeService,
  MonacoCodeService,
  monacoCodeServiceProxy,
} from './override/monacoOverride/codeEditorService';
import { MonacoContextKeyServiceOverride } from './override/monacoOverride/contextKeyService';

// import { MonacoOverrides } from './override/monacoOverride';
export * from './override/monacoOverride/codeEditorService';

export { ExtensionManagerModule as ExtensionClientManagerModule } from './extension-manager';

export * from './extension';

export { TextmateLanguageGrammarContribution, LanguageGrammarRegistrationService };

export type ModuleConstructor = ConstructorOf<BrowserModule>;

@Injectable()
export class ClientModule extends BrowserModule {
  providers: Provider[] = [
    OpenSumiExtFsProvider,
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
    FileSchemeContribution,
    SearchContribution,
    PreferenceSettingContribution,
    LayoutRestoreContributation,

    /*  monaco override*/
    // ...MonacoOverrides,
    {
      token: ICommandServiceToken,
      useValue: monacoCommandServiceProxy,
      override: true,
    },
    {
      token: IMonacoCommandServiceProxy,
      useClass: MonacoCommandService,
    },
    {
      token: MonacoCodeService,
      useValue: monacoCodeServiceProxy,
      override: true,
    },
    {
      token: IMonacoCodeService,
      useClass: MonacoCodeService,
    },
    /* monaco override */
    {
      token: IBreadCrumbService,
      useClass: BreadCrumbServiceImplOverride,
      override: true,
    },
    {
      token: MonacoSnippetSuggestProvider,
      useClass: MonacoSnippetSuggestProviderOverride,
      override: true,
    },
    {
      token: VSCodeContributesServiceToken,
      useClass: VSCodeContributesServiceOverride,
      override: true,
    },
    {
      token: IMonacoOverrideService,
      useClass: MonacoOverrideService,
    },
    {
      token: IContextKeyService,
      useClass: MonacoContextKeyServiceOverride,
      override: true,
    },
  ];
  preferences = injectDebugPreferences;
}

export interface IAppOpts extends IClientAppOpts, IServerAppOpts {}

export { IClientAppOpts };

// FIXME: 默认 dispose 会调用 disposeSideEffect，因为实例已销户，会重新生成实例导致报错
// 先 dispose，待 opensumi 修复
// @ts-ignore
export class ClientApp extends BasicClientApp {
  private disposeSideEffect = () => {};

  private modules: ModuleConstructor[] = [];

  private disposer = new Disposable();

  constructor(opts: IAppOpts) {
    super(opts);
    this.modules = opts.modules;
    this.initServer(opts);
    this.initMonacoProxy();
  }

  initMonacoProxy() {
    this.disposer.addDispose(monacoCommandServiceProxy.setInjector(this.injector));
    this.disposer.addDispose(monacoCodeServiceProxy.setInjector(this.injector));
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

  public async start(
    container: HTMLElement | IAppRenderer,
    type?: 'electron' | 'web'
  ): Promise<void> {
    // 先启动 server 进行必要的初始化，应用的权限等也在 server 中处理
    const serverApp: IServerApp = this.injector.get(IServerApp);
    await serverApp.start();
    this.setWorkspaceReadOnly(serverApp.rootFS);

    bindConnectionService(this.injector, this.modules);
    // 避免 KaitianExtensionClientAppContribution.onStop 报错
    this.injector.addProviders({
      token: WSChannelHandler,
      useValue: { clientId: 'alex' },
    });
    return super.start(container, type);
  }

  /**
   * 根据文件系统来设置空间是否只读
   */
  private setWorkspaceReadOnly(rootFS: RootFS) {
    const workspaceFS = rootFS._getFs(this.config.workspaceDir);
    if (workspaceFS.fs.isReadOnly()) {
      const providerFactory: PreferenceProviderProvider = this.injector.get(
        PreferenceProviderProvider
      );
      const defaultPreference: PreferenceProvider = providerFactory(PreferenceScope.Default);
      defaultPreference.setPreference('editor.readonlyFiles', [
        `${this.config.workspaceDir}/**`,
        ...(defaultPreference.get<string[]>('editor.readonlyFiles') || []),
      ]);
    }
  }
  async dispose() {
    super.dispose();
    this.disposer.dispose();
  }
}

export async function bindConnectionService(injector: Injector, modules: ModuleConstructor[]) {
  const clientCenter = new FCServiceCenter(ClientPort);

  const { getFCService } = initFCService(clientCenter);

  const backServiceList: BackService[] = [];

  for (const module of modules) {
    const moduleInstance = injector.get(module) as BasicModule;
    if (moduleInstance.backServices) {
      for (const backService of moduleInstance.backServices) {
        if (isBackServicesInBrowser(backService)) {
          backServiceList.push(backService);
        }
      }
    }
  }

  for (const backService of backServiceList) {
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
