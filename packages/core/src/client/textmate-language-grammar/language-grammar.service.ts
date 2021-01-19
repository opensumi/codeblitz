import { Autowired, Injectable } from '@ali/common-di';
import { Disposable, Deferred, Emitter, Event, URI } from '@ali/ide-core-common';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';

@Injectable()
export class LanguageGrammarRegistrationService extends Disposable {
  static languageEmitter = new Emitter<LanguagesContribution>();
  static grammarEmitter = new Emitter<GrammarsContribution>();

  static languageEvent = Event.buffer(LanguageGrammarRegistrationService.languageEmitter.event);
  static grammarEvent = Event.buffer(LanguageGrammarRegistrationService.grammarEmitter.event);

  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  private languageDidRegisterDeferred = new Deferred<void>();
  public get languageDidRegistered() {
    return this.languageDidRegisterDeferred.promise;
  }

  async initRegisterLanguageAndGrammar() {
    // TODO: 框架侧参数类型改为可选
    const uri = new URI();
    LanguageGrammarRegistrationService.languageEvent((contrib) => {
      this.textMateService.registerLanguage(contrib, uri);
    });
    LanguageGrammarRegistrationService.grammarEvent((contrib) => {
      this.textMateService.registerGrammar(contrib, uri);
    });
    this.languageDidRegisterDeferred.resolve();
  }
}
