import { Autowired, Injectable } from '@ali/common-di';
import { MonacoContribution, ClientAppContribution } from '@ali/ide-core-browser';
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

@Domain(ClientAppContribution, MonacoContribution)
export class LanguageGrammarRegistrationService
  extends Disposable
  implements ClientAppContribution, MonacoContribution {
  static languageEmitter = new SingleEventEmitter<LanguagesContribution>();
  static grammarEmitter = new SingleEventEmitter<GrammarsContribution>();

  private _monacoLoaded = new Deferred<void>();

  private _ModesRegistry: { _languages: any[] } | null = null;

  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  private languageDidRegisterDeferred = new Deferred<void>();
  public get languageDidRegistered() {
    return this.languageDidRegisterDeferred.promise;
  }

  async initialize() {
    await this._monacoLoaded.promise;
    const vsRequire: any = (window as any).amdLoader.require;
    return new Promise<void>((resolve) => {
      vsRequire(['vs/editor/common/modes/modesRegistry'], ({ ModesRegistry }) => {
        this._ModesRegistry = ModesRegistry;
        resolve();
      });
    });
  }

  onMonacoLoaded() {
    this._monacoLoaded.resolve();
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
    // 清除缓存的语言，减少 monaco 内部的遍历
    if (this._ModesRegistry) {
      this._ModesRegistry._languages = [];
    }
  }
}

LanguageGrammarRegistrationService.languageEmitter.event((e) => {
  languageListCache.push(e);
});

LanguageGrammarRegistrationService.grammarEmitter.event((e) => {
  grammarListCache.push(e);
});
