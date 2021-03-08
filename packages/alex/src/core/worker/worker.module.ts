import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';

import { WorkerExtensionService } from '@ali/ide-kaitian-extension/lib/browser/extension.worker.service';
import { WorkerExtensionServicePatch } from './worker.service';

@Injectable()
export class WorkerPatchModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: WorkerExtensionService,
      useClass: WorkerExtensionServicePatch,
    },
  ];
}
