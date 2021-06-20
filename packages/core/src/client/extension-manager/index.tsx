import { Provider, Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
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
