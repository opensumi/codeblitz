export const ILanguageGrammarRegistrationService = Symbol('ILanguageGrammarRegistrationService')

export interface ILanguageGrammarRegistrationService {
  languageDidRegistered: Promise<void>
  initRegisterLanguageAndGrammar: () => Promise<void>
  registerLanguageAndGrammar: (languageId: string) => Promise<void>
  registerByFilename: (filename: string) => Promise<void>
}
