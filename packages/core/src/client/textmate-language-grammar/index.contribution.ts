import { Autowired } from '@ali/common-di';
import { Disposable, Domain } from '@ali/ide-core-common';
import { MonacoContribution } from '@ali/ide-core-browser';

import { ILanguageGrammarRegistrationService } from './base';

@Domain(MonacoContribution)
export class TextmateLanguageGrammarContribution extends Disposable implements MonacoContribution {
  @Autowired(ILanguageGrammarRegistrationService)
  private readonly languageGrammarService: ILanguageGrammarRegistrationService;

  async onMonacoLoaded() {
    // 确保按 monaco load 才能注册语言
    await this.languageGrammarService.initRegisterLanguageAndGrammar();
  }
}
