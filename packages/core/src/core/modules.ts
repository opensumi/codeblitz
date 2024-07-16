import { ClientAddonModule } from '@opensumi/ide-addons/lib/browser';
import { CommentsModule } from '@opensumi/ide-comments/lib/browser';
import { ClientCommonModule, ModuleConstructor } from '@opensumi/ide-core-browser';
import { DebugModule } from '@opensumi/ide-debug/lib/browser';
import { DecorationModule } from '@opensumi/ide-decoration/lib/browser';
import { DesignModule } from '@opensumi/ide-design/lib/browser';
import { EditorModule } from '@opensumi/ide-editor/lib/browser';
import { ExplorerModule } from '@opensumi/ide-explorer/lib/browser';
import { ExtensionStorageModule } from '@opensumi/ide-extension-storage/lib/browser';
import { ExtensionModule } from '@opensumi/ide-extension/lib/browser';
import { FileSchemeModule } from '@opensumi/ide-file-scheme/lib/browser';
import { FileServiceClientModule } from '@opensumi/ide-file-service/lib/browser';
import { FileTreeNextModule } from '@opensumi/ide-file-tree-next/lib/browser';
import { KeymapsModule } from '@opensumi/ide-keymaps/lib/browser';
import { LogModule } from '@opensumi/ide-logs/lib/browser';
import { MainLayoutModule } from '@opensumi/ide-main-layout/lib/browser';
import { MarkdownModule } from '@opensumi/ide-markdown/lib/browser';
import { MarkersModule } from '@opensumi/ide-markers/lib/browser';
import { MenuBarModule } from '@opensumi/ide-menu-bar/lib/browser';
import { MonacoEnhanceModule } from '@opensumi/ide-monaco-enhance/lib/browser/module';
import { MonacoModule } from '@opensumi/ide-monaco/lib/browser';
import { OpenedEditorModule } from '@opensumi/ide-opened-editor/lib/browser';
import { OutlineModule } from '@opensumi/ide-outline/lib/browser';
import { OutputModule } from '@opensumi/ide-output/lib/browser';
import { OverlayModule } from '@opensumi/ide-overlay/lib/browser';
import { PreferencesModule } from '@opensumi/ide-preferences/lib/browser';
import { QuickOpenModule } from '@opensumi/ide-quick-open/lib/browser';
import { SCMModule } from '@opensumi/ide-scm/lib/browser';
import { SearchModule } from '@opensumi/ide-search/lib/browser';
import { StatusBarModule } from '@opensumi/ide-status-bar/lib/browser';
import { StorageModule } from '@opensumi/ide-storage/lib/browser';
import { ThemeModule } from '@opensumi/ide-theme/lib/browser';
import { ToolbarModule } from '@opensumi/ide-toolbar/lib/browser';
import { VariableModule } from '@opensumi/ide-variable/lib/browser';
import { WebviewModule } from '@opensumi/ide-webview/lib/browser';
import { WorkspaceEditModule } from '@opensumi/ide-workspace-edit/lib/browser';
import { WorkspaceModule } from '@opensumi/ide-workspace/lib/browser';

/**
 * alex
 */

import { PluginModule } from '@codeblitzjs/ide-plugin';
import { ClientModule, ExtensionClientManagerModule, ServerModuleCollection } from '@codeblitzjs/ide-sumi-core';
import { AlexModule } from './alex.module';

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
  ExtensionModule,
  // FeatureExtensionModule,
  ExtensionClientManagerModule,
  MonacoEnhanceModule,

  DesignModule,

  // addons
  ClientAddonModule,
  CommentsModule,
  // TaskModule,

  // Alex
  ClientModule,
  PluginModule,
  ...ServerModuleCollection,
  AlexModule,
];
