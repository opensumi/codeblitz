import { MainLayoutModule } from '@ali/ide-main-layout/lib/browser';
import { LogModule } from '@ali/ide-logs/lib/browser';
import { MonacoModule } from '@ali/ide-monaco/lib/browser';
import { ClientCommonModule, BrowserModule } from '@ali/ide-core-browser';
import { CoreQuickOpenModule as QuickOpenModule } from '@ali/ide-quick-open/lib/browser';
import { ConstructorOf } from '@ali/ide-core-common';
import { FileServiceClientModule } from '@ali/ide-file-service/lib/browser';
import { ThemeModule } from '@ali/ide-theme/lib/browser';
import { WorkspaceModule } from '@ali/ide-workspace/lib/browser';
import { ExtensionStorageModule } from '@ali/ide-extension-storage/lib/browser';
import { StorageModule } from '@ali/ide-storage/lib/browser';
import { DecorationModule } from '@ali/ide-decoration/lib/browser';
import { PreferencesModule } from '@ali/ide-preferences/lib/browser';
import { OverlayModule } from '@ali/ide-overlay/lib/browser';
import { SCMModule } from '@ali/ide-scm/lib/browser';
import { StaticResourceModule } from '@ali/ide-static-resource/lib/browser';
import { WorkspaceEditModule } from '@ali/ide-workspace-edit/lib/browser';
import { KeymapsModule } from '@ali/ide-keymaps/lib/browser';
import { CommentsModule } from '@ali/ide-comments/lib/browser';
import { WebviewModule } from '@ali/ide-webview/lib/browser';
import { OutputModule } from '@ali/ide-output/lib/browser';
import { EditorModule } from '@ali/ide-editor/lib/browser';
import { KaitianExtensionModule } from '@ali/ide-kaitian-extension/lib/browser';

// alex modules
import { AlexModule } from '@alipay/alex/lib/core/alex.module';
import { ClientModule, ServerModuleCollection } from '@alipay/alex-core';
import { PluginModule } from '@alipay/alex-plugin';

import { BrowserFileSchemeModule } from '../overrides/browser-file-scheme';

export const CommonBrowserModules: ConstructorOf<BrowserModule>[] = [
  FileServiceClientModule,
  MainLayoutModule,
  OverlayModule,
  LogModule,
  ClientCommonModule,
  MonacoModule,
  EditorModule,
  QuickOpenModule,
  KeymapsModule,
  ThemeModule,
  WorkspaceModule,
  ExtensionStorageModule,
  StorageModule,
  PreferencesModule,
  DecorationModule,
  SCMModule,
  StaticResourceModule,
  WorkspaceEditModule,
  CommentsModule,
  WebviewModule,
  OutputModule,
  // browser custom modules
  BrowserFileSchemeModule,

  // extension
  KaitianExtensionModule,
  // Alex
  ClientModule,
  PluginModule,
  ...ServerModuleCollection,
  AlexModule,
];
