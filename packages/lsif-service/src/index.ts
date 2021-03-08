import { Provider, Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';

import { LsifContribution } from './language-service.contribution';
import { bindLsifPreference } from './lsif-preferences';

@Injectable()
export class LsifModule extends BrowserModule {
  providers: Provider[] = [LsifContribution];

  preferences = bindLsifPreference;
}
