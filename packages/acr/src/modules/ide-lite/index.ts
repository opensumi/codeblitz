import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { CommonServerPath } from '@opensumi/ide-core-common';

import { CommonCommandsContribution } from '../common-commands/index.contribution';
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
    LanguageServiceContribution,
  ];
}
