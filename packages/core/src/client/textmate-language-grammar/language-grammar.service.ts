import { Autowired } from '@ali/common-di';
import { Disposable, URI, Domain } from '@ali/ide-core-common';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';
import { centerRegistry } from '@alipay/alex-registry';
import { TextmateKey } from './base';

@Domain()
export class LanguageGrammarRegistrationService extends Disposable {
  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  async initRegisterLanguageAndGrammar() {
    // 没啥作用，只是确保传参类型正确
    const uri = new URI();

    this.addDispose(
      centerRegistry.onRegister<LanguagesContribution>(TextmateKey.language, (contrib) => {
        this.textMateService.registerLanguage(contrib, uri);
      })
    );

    this.addDispose(
      centerRegistry.onRegister<GrammarsContribution>(TextmateKey.grammar, (contrib) => {
        this.textMateService.registerGrammar(contrib, uri);
      })
    );

    const languageContrib =
      centerRegistry.getData<LanguagesContribution>(TextmateKey.language) || [];
    const grammarContrib = centerRegistry.getData<GrammarsContribution>(TextmateKey.grammar) || [];

    return Promise.all([
      ...languageContrib.map((contrib) => this.textMateService.registerLanguage(contrib, uri)),
      ...grammarContrib.map((contrib) => this.textMateService.registerGrammar(contrib, uri)),
    ]);
  }
}
