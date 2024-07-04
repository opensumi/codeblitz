import { Injectable, Injector, ConstructorOf, Provider } from '@opensumi/di';
import {
  BrowserModule,
  IAppRenderer,
  IClientAppOpts,
  PreferenceProviderProvider,
  PreferenceScope,
  PreferenceProvider,
  IContextKeyService,
  getPreferenceThemeId,
} from '@opensumi/ide-core-browser';
import { ClientApp as BasicClientApp } from '@opensumi/ide-core-browser/lib/bootstrap/app';

import { Disposable, GeneralSettingsId } from '@opensumi/ide-core-common';

import { OpenSumiExtFsProvider, KtExtFsProviderContribution } from './extension';
import { TextmateLanguageGrammarContribution } from './textmate-language-grammar/index.contribution';
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base';
import { LanguageGrammarRegistrationService } from './textmate-language-grammar/language-grammar.service';
import { injectDebugPreferences } from './debug';
import { IServerApp, RootFS } from '../common';
import { IServerAppOpts, ServerApp } from '../server/core/app';
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
  monacoCommandServiceProxy,
} from './override/monacoOverride/commandService';
import {
  monacoCodeServiceProxy,
} from './override/monacoOverride/codeEditorService';
import { MonacoContextKeyServiceOverride } from './override/monacoOverride/contextKeyService';
import { ExtensionStorageServiceOverride } from './override/extensionStorageService';
import { IExtensionStorageService } from '@opensumi/ide-extension-storage';
import { MonacoOverrides } from './override/monacoOverride';
import { monacoTextModelServiceProxy } from './override/monacoOverride/textModelService';
import { monacoBulkEditServiceProxy } from './override/monacoOverride/workspaceEditService';
import { CodeBlitzConnectionHelper } from './override/webConnectionHelper';
import { WebConnectionHelper } from '@opensumi/ide-core-browser/lib/application/runtime';
import { CodeBlitzAINativeContribution } from './ai-native';
import { injectAINativePreferences } from './ai-native/preferences';
import { getThemeTypeByPreferenceThemeId } from '../common/theme';
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
    CodeBlitzAINativeContribution,
    ...MonacoOverrides,
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
    {
      token: IExtensionStorageService,
      useClass: ExtensionStorageServiceOverride,
      override: true,
    },
    {
      token: WebConnectionHelper,
      useClass: CodeBlitzConnectionHelper,
      override: true,
    },
  ];
  preferences = (injector: Injector) => {
    injectDebugPreferences(injector);
    injectAINativePreferences(injector);
  };
}

export interface IAppOpts extends IClientAppOpts, IServerAppOpts {}

export { IClientAppOpts };

// FIXME: 默认 dispose 会调用 disposeSideEffect，因为实例已销毁，会重新生成实例导致报错
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
    this.disposer.addDispose(monacoTextModelServiceProxy.setInjector(this.injector));
    this.disposer.addDispose(monacoBulkEditServiceProxy.setInjector(this.injector));
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

  public async start(container: HTMLElement | IAppRenderer): Promise<void> {
    // 先启动 server 进行必要的初始化，应用的权限等也在 server 中处理
    const serverApp: IServerApp = this.injector.get(IServerApp);
    await serverApp.start();
    this.setWorkspaceReadOnly(serverApp.rootFS);

    await this.createConnection('web');

    return super.start(container);
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

  unmountRootFS() {
    const serverApp: IServerApp = this.injector.get(IServerApp);
    if (serverApp) {
      serverApp.unmountRootFS();
    }
  }

  get currentThemeType() {
    const themeId = getPreferenceThemeId() || this.opts.defaultPreferences?.[GeneralSettingsId.Theme];
    return getThemeTypeByPreferenceThemeId(themeId, (this.opts as IAppOpts).extensionMetadata);
  }

  async dispose() {
    super.dispose();
    this.disposer.dispose();
  }
}
