import '../core/normalize.less';
import React from 'react';
import { ClientApp, IAppOpts, RuntimeConfig, makeWorkspaceDir } from '@alipay/alex-core';
import '@ali/ide-i18n/lib/browser';
import { SlotRenderer, SlotLocation } from '@ali/ide-core-browser';
import { BoxPanel, SplitPanel } from '@ali/ide-core-browser/lib/components';
import {
  ClientModule,
  ServerModuleCollection,
  ClientCommonModule,
  FileServiceClientModule,
  MainLayoutModule,
  OverlayModule,
  LogModule,
  MonacoModule,
  ExplorerModule,
  EditorModule,
  QuickOpenModule,
  KeymapsModule,
  FileTreeNextModule,
  ThemeModule,
  WorkspaceModule,
  ExtensionStorageModule,
  StorageModule,
  PreferencesModule,
  OpenedEditorModule,
  DecorationModule,
  StaticResourceModule,
  WorkspaceEditModule,
  WebviewModule,
  FileSchemeModule,
  KaitianExtensionModule,
  OutlineModule,
  CommentsModule,
  StatusBarModule,
  MenuBarModule,
} from '../core/modules';
import { IconSlim, GeekTheme } from '../core/extensions';

export { SlotLocation, SlotRenderer, BoxPanel, SplitPanel };

export interface IAppConfig {
  /**
   * 应用相关配置
   */
  appConfig?: IAppOpts | ((defaultOpts: IAppOpts) => IAppOpts);
  /**
   * 运行相关配置
   */
  runtimeConfig?: RuntimeConfig;
}

export const DEFAULT_APP_CONFIG: IAppOpts = {
  modules: [
    ClientCommonModule,
    FileServiceClientModule,
    MainLayoutModule,
    OverlayModule,
    LogModule,
    MonacoModule,
    ExplorerModule,
    EditorModule,
    QuickOpenModule,
    KeymapsModule,
    FileTreeNextModule,
    ThemeModule,
    WorkspaceModule,
    ExtensionStorageModule,
    StorageModule,
    PreferencesModule,
    OpenedEditorModule,
    DecorationModule,
    StaticResourceModule,
    WorkspaceEditModule,
    WebviewModule,
    FileSchemeModule,
    KaitianExtensionModule,
    OutlineModule,
    CommentsModule,
    StatusBarModule,
    MenuBarModule,
    ClientModule,
    ...ServerModuleCollection,
  ],
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: __WORKER_HOST__,
  webviewEndpoint: __WEBVIEW_ENDPOINT__,
  defaultPreferences: {
    'general.theme': 'alipay-geek-dark',
    'general.icon': 'vsicons-slim',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 10,
    'editor.quickSuggestionsMaxCount': 50,
    'editor.scrollBeyondLastLine': false,
    'general.language': 'zh-CN',
    'settings.userBeforeWorkspace': true,
  },
  extensionMetadata: [IconSlim, GeekTheme],
  layoutComponent: () => (
    <BoxPanel direction="top-to-bottom">
      <SplitPanel overflow="hidden" id="main-horizontal" flex={1}>
        <SlotRenderer slot="left" defaultSize={310} minResize={204} minSize={49} />
        <SplitPanel id="main-vertical" minResize={300} flexGrow={1} direction="top-to-bottom">
          <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
        </SplitPanel>
      </SplitPanel>
    </BoxPanel>
  ),
  layoutConfig: {
    [SlotLocation.action]: {
      modules: [''],
    },
    [SlotLocation.left]: {
      modules: ['@ali/ide-explorer'],
    },
    [SlotLocation.main]: {
      modules: ['@ali/ide-editor'],
    },
    [SlotLocation.extra]: {
      modules: ['breadcrumb-menu'],
    },
  },
};

export function createApp({ appConfig, runtimeConfig }: IAppConfig) {
  const opts =
    (typeof appConfig === 'function' ? appConfig(DEFAULT_APP_CONFIG) : appConfig) ??
    DEFAULT_APP_CONFIG;

  if (!opts.workspaceDir) {
    throw new Error('请配置 workspaceDir，需确保 workspaceDir 唯一，推荐 group/repository 的形式');
  }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir);

  const app = new ClientApp(opts);

  // 基于场景的运行时数据
  app.injector.addProviders({
    token: RuntimeConfig,
    useValue: runtimeConfig,
  });

  (window as any)[RuntimeConfig] = runtimeConfig;

  return app;
}
