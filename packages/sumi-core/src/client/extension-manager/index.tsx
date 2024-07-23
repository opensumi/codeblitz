import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IExtensionManagerService } from './base';
import { ExtensionManagerContribution } from './extension-manager.contribution';
import { ExtensionManagerService } from './extension-manager.service';

@Injectable()
export class ExtensionManagerModule extends BrowserModule {
  providers: Provider[] = [
    ExtensionManagerContribution,
    {
      token: IExtensionManagerService,
      useClass: ExtensionManagerService,
    },
  ];
}
