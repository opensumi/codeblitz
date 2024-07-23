import { Registry } from '@codeblitzjs/ide-registry';
import { Autowired } from '@opensumi/di';
import { Disposable, Domain, URI } from '@opensumi/ide-core-common';
import { GrammarsContribution, LanguagesContribution } from '@opensumi/ide-monaco';
import { ITextmateTokenizer } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import type { ITextmateTokenizerService } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import { TextmateKey } from './base';

@Domain()
export class LanguageGrammarRegistrationService extends Disposable {
  @Autowired(ITextmateTokenizer)
  private readonly textMateService: ITextmateTokenizerService;

  async initRegisterLanguageAndGrammar() {
    // 没啥作用，只是确保传参类型正确
    const uri = new URI();

    this.addDispose(
      Registry.onRegister<LanguagesContribution>(TextmateKey.language, (contrib) => {
        this.textMateService.registerLanguage(contrib, uri);
      }),
    );

    this.addDispose(
      Registry.onRegister<GrammarsContribution>(TextmateKey.grammar, (contrib) => {
        this.textMateService.registerGrammar(contrib, uri);
      }),
    );

    const languageContrib = Registry.getData<LanguagesContribution>(TextmateKey.language) || [];
    const grammarContrib = Registry.getData<GrammarsContribution>(TextmateKey.grammar) || [];

    return Promise.all([
      ...languageContrib.map((contrib) => this.textMateService.registerLanguage(contrib, uri)),
      ...grammarContrib.map((contrib) => this.textMateService.registerGrammar(contrib, uri)),
    ]);
  }
}
