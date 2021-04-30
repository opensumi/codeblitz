import { Autowired } from '@ali/common-di';
import { Disposable, Deferred, Emitter, Event, URI, Domain } from '@ali/ide-core-common';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';

const languageListCache: LanguagesContribution[] = [];
const grammarListCache: GrammarsContribution[] = [];

class SingleEventEmitter<T> extends Emitter<T> {
  clear() {
    this._listeners?.clear();
  }
}

@Domain()
export class LanguageGrammarRegistrationService extends Disposable {
  static languageEmitter = new SingleEventEmitter<LanguagesContribution>();
  static grammarEmitter = new SingleEventEmitter<GrammarsContribution>();

  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  private languageDidRegisterDeferred = new Deferred<void>();
  public get languageDidRegistered() {
    return this.languageDidRegisterDeferred.promise;
  }

  async initRegisterLanguageAndGrammar() {
    // 没啥作用，只是确保传参类型正确
    const uri = new URI();
    languageListCache.forEach((contrib) => {
      this.textMateService.registerLanguage(contrib, uri);
    });
    grammarListCache.forEach((contrib) => {
      this.textMateService.registerGrammar(contrib, uri);
    });
    this.clear();
    LanguageGrammarRegistrationService.languageEmitter.event((contrib) => {
      this.textMateService.registerLanguage(contrib, uri);
    });
    LanguageGrammarRegistrationService.grammarEmitter.event((contrib) => {
      this.textMateService.registerGrammar(contrib, uri);
    });
    this.languageDidRegisterDeferred.resolve();
  }

  clear() {
    LanguageGrammarRegistrationService.languageEmitter.clear();
    LanguageGrammarRegistrationService.grammarEmitter.clear();
  }

  dispose() {
    this.clear();
  }
}

LanguageGrammarRegistrationService.languageEmitter.event((e) => {
  languageListCache.push(e);
});

LanguageGrammarRegistrationService.grammarEmitter.event((e) => {
  grammarListCache.push(e);
});
