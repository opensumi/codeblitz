import { CommentsModule } from '@opensumi/ide-comments/lib/browser';
import { ExtensionStorageModule } from '@opensumi/ide-extension-storage/lib/browser';
import { ExtensionModule } from '@opensumi/ide-extension/lib/browser';
import { WebviewModule } from '@opensumi/ide-webview/lib/browser';

/**
 * editor special
 */
import { ExtensionActivateModule } from './editor.extension';

import { setExtensionModules } from './modules';
import '../extension/extension.patch';

setExtensionModules([
  ExtensionStorageModule,
  WebviewModule,
  ExtensionModule,
  CommentsModule,
  ExtensionActivateModule,
]);
