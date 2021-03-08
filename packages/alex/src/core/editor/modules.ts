/**
 * kaitian
 */
import { ClientCommonModule, ModuleConstructor } from '@ali/ide-core-browser';
import { DecorationModule } from '@ali/ide-decoration/lib/browser';
import { EditorModule } from '@ali/ide-editor/lib/browser';
import { FileSchemeModule } from '@ali/ide-file-scheme/lib/browser';
import { FileServiceClientModule } from '@ali/ide-file-service/lib/browser';
import { KeymapsModule } from '@ali/ide-keymaps/lib/browser';
import { LogModule } from '@ali/ide-logs/lib/browser';
import { MainLayoutModule } from '@ali/ide-main-layout/lib/browser';
import { MonacoModule } from '@ali/ide-monaco/lib/browser';
import { MonacoEnhanceModule } from '@ali/ide-monaco-enhance/lib/browser/module';
import { OverlayModule } from '@ali/ide-overlay/lib/browser';
import { PreferencesModule } from '@ali/ide-preferences/lib/browser';
import { QuickOpenModule } from '@ali/ide-quick-open/lib/browser';
import { SCMModule } from '@ali/ide-scm/lib/browser';
import { StatusBarModule } from '@ali/ide-status-bar/lib/browser';
import { StorageModule } from '@ali/ide-storage/lib/browser';
import { ThemeModule } from '@ali/ide-theme/lib/browser';
import { WorkspaceModule } from '@ali/ide-workspace/lib/browser';

/**
 * alex
 */
import { ClientModule, ServerModuleCollection } from '@alipay/alex-core';

/**
 * editor special
 */
import { EditorSpecialModule } from './editor.module';

export const modules: ModuleConstructor[] = [
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

  MonacoEnhanceModule,

  // Alex
  ClientModule,
  ...ServerModuleCollection,

  // Editor Special
  EditorSpecialModule,
];
