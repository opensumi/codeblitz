import { Autowired } from '@opensumi/di';
import { ClientAppContribution } from '@opensumi/ide-core-browser';
import { Disposable, Domain } from '@opensumi/ide-core-common';

import { ILanguageGrammarRegistrationService } from './base';

@Domain(ClientAppContribution)
export class TextmateLanguageGrammarContribution implements ClientAppContribution {
  @Autowired(ILanguageGrammarRegistrationService)
  private readonly languageGrammarService: ILanguageGrammarRegistrationService;

  async initialize() {
    await this.languageGrammarService.initRegisterLanguageAndGrammar();
  }
}
