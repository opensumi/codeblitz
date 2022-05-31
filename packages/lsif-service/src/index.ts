import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { LsifContribution } from './language-service.contribution';
import { bindLsifPreference } from './lsif-preferences';

@Injectable()
export class LsifModule extends BrowserModule {
  providers: Provider[] = [LsifContribution];

  preferences = bindLsifPreference;
}
