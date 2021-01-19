import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';
import { LanguageGrammarRegistrationService } from '@alipay/alex-core';

export const registerLanguage = (contrib: LanguagesContribution) => {
  LanguageGrammarRegistrationService.languageEmitter.fire(contrib);
};

export const registerGrammar = (contrib: GrammarsContribution) => {
  LanguageGrammarRegistrationService.grammarEmitter.fire(contrib);
};
