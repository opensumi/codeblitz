/**
 * kaitian
 */

import { ClientAddonModule } from '@ali/ide-addons/lib/browser';
import { CommentsModule } from '@ali/ide-comments/lib/browser';
import { ClientCommonModule, ModuleConstructor } from '@ali/ide-core-browser';
import { DebugModule } from '@ali/ide-debug/lib/browser';
import { DecorationModule } from '@ali/ide-decoration/lib/browser';
import { EditorModule } from '@ali/ide-editor/lib/browser';
import { ExplorerModule } from '@ali/ide-explorer/lib/browser';
import { ExtensionStorageModule } from '@ali/ide-extension-storage/lib/browser';
import { FileSchemeModule } from '@ali/ide-file-scheme/lib/browser';
import { FileServiceClientModule } from '@ali/ide-file-service/lib/browser';
import { FileTreeNextModule } from '@ali/ide-file-tree-next/lib/browser';
import { KaitianExtensionModule } from '@ali/ide-kaitian-extension/lib/browser';
import { KeymapsModule } from '@ali/ide-keymaps/lib/browser';
import { LogModule } from '@ali/ide-logs/lib/browser';
import { MainLayoutModule } from '@ali/ide-main-layout/lib/browser';
import { MarkdownModule } from '@ali/ide-markdown/lib/browser';
import { MarkersModule } from '@ali/ide-markers/lib/browser';
import { MenuBarModule } from '@ali/ide-menu-bar/lib/browser';
import { MonacoModule } from '@ali/ide-monaco/lib/browser';
import { MonacoEnhanceModule } from '@ali/ide-monaco-enhance/lib/browser/module';
import { OpenedEditorModule } from '@ali/ide-opened-editor/lib/browser';
import { OutlineModule } from '@ali/ide-outline/lib/browser';
import { OutputModule } from '@ali/ide-output/lib/browser';
import { OverlayModule } from '@ali/ide-overlay/lib/browser';
import { PreferencesModule } from '@ali/ide-preferences/lib/browser';
import { QuickOpenModule } from '@ali/ide-quick-open/lib/browser';
import { SCMModule } from '@ali/ide-scm/lib/browser';
import { SearchModule } from '@ali/ide-search/lib/browser';
import { StaticResourceModule } from '@ali/ide-static-resource/lib/browser';
import { StatusBarModule } from '@ali/ide-status-bar/lib/browser';
import { StorageModule } from '@ali/ide-storage/lib/browser';
import { ThemeModule } from '@ali/ide-theme/lib/browser';
import { ToolbarModule } from '@ali/ide-toolbar/lib/browser';
import { VariableModule } from '@ali/ide-variable/lib/browser';
import { WebviewModule } from '@ali/ide-webview/lib/browser';
import { WorkspaceModule } from '@ali/ide-workspace/lib/browser';
import { WorkspaceEditModule } from '@ali/ide-workspace-edit/lib/browser';

/**
 * alex
 */

import { ClientModule, ServerModuleCollection } from '@alipay/alex-core';

/**
 * special
 */

import { WorkerPatchModule } from './worker/worker.module';

// TODO: 部分模块需要注意顺序，否则会报错，待框架侧调整修复
export const modules: ModuleConstructor[] = [
  MainLayoutModule,
  OverlayModule,
  LogModule,
  ClientCommonModule,
  MenuBarModule,
  MonacoModule,
  StatusBarModule,
  EditorModule,
  ExplorerModule,
  FileTreeNextModule,
  FileServiceClientModule,
  StaticResourceModule,
  SearchModule,
  FileSchemeModule,
  OutputModule,
  QuickOpenModule,
  MarkersModule,

  ThemeModule,
  WorkspaceModule,
  ExtensionStorageModule,
  StorageModule,
  OpenedEditorModule,
  OutlineModule,
  PreferencesModule,
  ToolbarModule,
  WebviewModule,
  MarkdownModule,
  WorkspaceEditModule,
  SCMModule,
  DecorationModule,
  DebugModule,
  VariableModule,
  KeymapsModule,
  // TerminalNextModule,

  // Extension Modules
  KaitianExtensionModule,
  // FeatureExtensionModule,
  // ExtensionManagerModule,
  MonacoEnhanceModule,

  // addons
  ClientAddonModule,
  CommentsModule,
  // TaskModule,

  // Alex
  ClientModule,
  ...ServerModuleCollection,

  // special
  WorkerPatchModule,
];
