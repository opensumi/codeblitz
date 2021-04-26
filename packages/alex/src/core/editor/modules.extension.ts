/**
 * kaitian
 */
import { CommentsModule } from '@ali/ide-comments/lib/browser';
import { ExtensionStorageModule } from '@ali/ide-extension-storage/lib/browser';
import { KaitianExtensionModule } from '@ali/ide-kaitian-extension/lib/browser';
import { StaticResourceModule } from '@ali/ide-static-resource/lib/browser';
import { WebviewModule } from '@ali/ide-webview/lib/browser';

/**
 * editor special
 */
import { WorkerPatchModule } from '../worker/worker.module';
import { ExtensionActivateModule } from './editor.extension';

import { setExtensionModules } from './modules';

setExtensionModules([
  StaticResourceModule,
  ExtensionStorageModule,
  WebviewModule,
  KaitianExtensionModule,
  CommentsModule,
  WorkerPatchModule,
  ExtensionActivateModule,
]);
