import { Provider, Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { CommonServerPath } from '@ali/ide-core-common';

import { CommonCommandsContribution } from '../common-commands/index.contribution';
import { KtExtFsProviderContribution } from '../kt-ext-provider/index.contribution';
import { LanguageServiceContribution } from '../language-service/index.contribution';
import { BrowserCommonServer } from '../../overrides/browser-common-server';

// override
import { GitSchemeContribution } from '../git-scheme/index.contribution';

@Injectable()
export class WebLiteModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: CommonServerPath,
      useClass: BrowserCommonServer,
    },
    CommonCommandsContribution,
    GitSchemeContribution,
    KtExtFsProviderContribution,
    LanguageServiceContribution,
  ];
}
