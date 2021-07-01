export const ILanguageGrammarRegistrationService = Symbol('ILanguageGrammarRegistrationService');

export interface ILanguageGrammarRegistrationService {
  languageDidRegistered: Promise<void>;
  initRegisterLanguageAndGrammar: () => Promise<void>;
  registerByFilenames: (filenames: string[]) => Promise<void>;
  registerLanguageAndGrammar: (languageId: string) => Promise<void>;
}
