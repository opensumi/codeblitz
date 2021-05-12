import { Autowired } from '@ali/common-di';
import { Disposable, Domain } from '@ali/ide-core-common';
import { ClientAppContribution } from '@ali/ide-core-browser';

import { ILanguageGrammarRegistrationService } from './base';

@Domain(ClientAppContribution)
export class TextmateLanguageGrammarContribution implements ClientAppContribution {
  @Autowired(ILanguageGrammarRegistrationService)
  private readonly languageGrammarService: ILanguageGrammarRegistrationService;

  async initialize() {
    await this.languageGrammarService.initRegisterLanguageAndGrammar();
  }
}
