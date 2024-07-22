/**
 * kaitian
 */
import { ClientCommonModule, ModuleConstructor } from '@opensumi/ide-core-browser';
import { DecorationModule } from '@opensumi/ide-decoration/lib/browser';
import { EditorModule } from '@opensumi/ide-editor/lib/browser';
import { FileSchemeModule } from '@opensumi/ide-file-scheme/lib/browser';
import { FileServiceClientModule } from '@opensumi/ide-file-service/lib/browser';
import { KeymapsModule } from '@opensumi/ide-keymaps/lib/browser';
import { LogModule } from '@opensumi/ide-logs/lib/browser';
import { MainLayoutModule } from '@opensumi/ide-main-layout/lib/browser';
import { MonacoEnhanceModule } from '@opensumi/ide-monaco-enhance/lib/browser/module';
import { MonacoModule } from '@opensumi/ide-monaco/lib/browser';
import { OutputModule } from '@opensumi/ide-output/lib/browser';
import { OverlayModule } from '@opensumi/ide-overlay/lib/browser';
import { PreferencesModule } from '@opensumi/ide-preferences/lib/browser';
import { QuickOpenModule } from '@opensumi/ide-quick-open/lib/browser';
import { SCMModule } from '@opensumi/ide-scm/lib/browser';
import { StatusBarModule } from '@opensumi/ide-status-bar/lib/browser';
import { StorageModule } from '@opensumi/ide-storage/lib/browser';
import { ThemeModule } from '@opensumi/ide-theme/lib/browser';
import { WorkspaceEditModule } from '@opensumi/ide-workspace-edit/lib/browser';
import { WorkspaceModule } from '@opensumi/ide-workspace/lib/browser';

/**
 * alex
 */
import { PluginModule } from '@codeblitzjs/ide-plugin';
import { ClientModule, ServerModuleCollection } from '@codeblitzjs/ide-sumi-core';

/**
 * editor special
 */
import { EditorSpecialModule } from './editor.module';

let extensionModules: ModuleConstructor[] = [];
export const setExtensionModules = (modules: ModuleConstructor[]) => {
  extensionModules = modules;
};

export const getModules: () => ModuleConstructor[] = () => [
  MainLayoutModule,
  OverlayModule,
  LogModule,
  ClientCommonModule,
  MonacoModule,
  StatusBarModule,
  EditorModule,
  FileServiceClientModule,
  FileSchemeModule,
  QuickOpenModule,

  ThemeModule,
  WorkspaceModule,
  StorageModule,
  PreferencesModule,
  SCMModule,
  DecorationModule,
  KeymapsModule,
  WorkspaceEditModule,
  OutputModule,
  MonacoEnhanceModule,

  ...extensionModules,

  // Alex
  ClientModule,
  PluginModule,
  ...ServerModuleCollection,

  // Editor Special
  EditorSpecialModule,
];
