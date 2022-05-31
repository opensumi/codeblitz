import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { ExtensionManagerContribution } from './extension-manager.contribution';
import { ExtensionManagerService } from './extension-manager.service';
import { IExtensionManagerService } from './base';

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
