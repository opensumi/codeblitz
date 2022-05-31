import { MainLayoutModule } from '@opensumi/ide-main-layout/lib/browser';
import { LogModule } from '@opensumi/ide-logs/lib/browser';
import { MonacoModule } from '@opensumi/ide-monaco/lib/browser';
import { ClientCommonModule, BrowserModule } from '@opensumi/ide-core-browser';
import { CoreQuickOpenModule as QuickOpenModule } from '@opensumi/ide-quick-open/lib/browser';
import { ConstructorOf } from '@opensumi/ide-core-common';
import { FileServiceClientModule } from '@opensumi/ide-file-service/lib/browser';
import { ThemeModule } from '@opensumi/ide-theme/lib/browser';
import { WorkspaceModule } from '@opensumi/ide-workspace/lib/browser';
import { ExtensionStorageModule } from '@opensumi/ide-extension-storage/lib/browser';
import { StorageModule } from '@opensumi/ide-storage/lib/browser';
import { DecorationModule } from '@opensumi/ide-decoration/lib/browser';
import { PreferencesModule } from '@opensumi/ide-preferences/lib/browser';
import { OverlayModule } from '@opensumi/ide-overlay/lib/browser';
import { SCMModule } from '@opensumi/ide-scm/lib/browser';
import { StaticResourceModule } from '@opensumi/ide-static-resource/lib/browser';
import { WorkspaceEditModule } from '@opensumi/ide-workspace-edit/lib/browser';
import { KeymapsModule } from '@opensumi/ide-keymaps/lib/browser';
import { CommentsModule } from '@opensumi/ide-comments/lib/browser';
import { WebviewModule } from '@opensumi/ide-webview/lib/browser';
import { OutputModule } from '@opensumi/ide-output/lib/browser';
import { EditorModule } from '@opensumi/ide-editor/lib/browser';
import { ExtensionModule } from '@opensumi/ide-extension/lib/browser';

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
  ExtensionModule,
  // Alex
  ClientModule,
  PluginModule,
  ...ServerModuleCollection,
  AlexModule,
];
