import { Autowired, Injectable } from '@ali/common-di';
import { Disposable, Deferred, ILogger } from '@ali/ide-core-common';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import type { LanguageDesc, loadLanguageAndGrammar } from '@ali/kaitian-textmate-languages';
import {
  getLanguageByExtnameAndFilename,
  getLanguageById,
} from '@ali/kaitian-textmate-languages/es/utils';
import * as paths from '@ali/ide-core-common/lib/path';

import { ILanguageGrammarRegistrationService } from './base';

// TODO: 先用默认语言
const defaultLanguages = [
  'html',
  'css',
  'javascript',
  'less',
  'markdown',
  'typescript',
  'scss',
  'pug',
  'json',
  'python',
];

@Injectable()
export class LanguageGrammarRegistrationService
  extends Disposable
  implements ILanguageGrammarRegistrationService {
  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  @Autowired(ILogger)
  private readonly logger: ILogger;

  private languageDidRegisterDeferred = new Deferred<void>();
  public get languageDidRegistered() {
    return this.languageDidRegisterDeferred.promise;
  }

  private registeredLanguageSet = new Set<string>();

  async initRegisterLanguageAndGrammar() {
    // antcode 接口只能获取 master 分支上的语言
    const languageIdList = defaultLanguages;
    const validLanguageList = this.getValidLanguages(languageIdList);

    // FIXME: 需要打点记录语言支持情况
    // languages/grammars registration
    for (const language of validLanguageList) {
      if (language.extensionPackageName) {
        await this.registerLanguageAndGrammar(language.extensionPackageName);
      }
    }
    this.languageDidRegisterDeferred.resolve();
  }

  /**
   * 通过文件后缀名来注册
   * @param extname string
   */
  async registerByFilename(filename: string) {
    const extname = paths.extname(filename);
    if (extname === '.') {
      return;
    }

    const language = getLanguageByExtnameAndFilename(extname, filename);
    if (!language) {
      this.logger.warn(`No language matched for extname: ${extname}`);
      return;
    }

    if (language.extensionPackageName) {
      await this.registerLanguageAndGrammar(language.extensionPackageName);
    }
  }

  async registerLanguageAndGrammar(languageId: string) {
    if (this.registeredLanguageSet.has(languageId)) {
      this.logger.warn(`This language: ${languageId} already registered`);
      return;
    }

    this.registeredLanguageSet.add(languageId);

    const mod = require(`@ali/kaitian-textmate-languages/lib/${languageId}`);
    const loadLanguage: loadLanguageAndGrammar = 'default' in mod ? mod.default : mod;
    const registrationPromise = loadLanguage(
      this.textMateService.registerLanguage.bind(this.textMateService),
      this.textMateService.registerGrammar.bind(this.textMateService)
    );
    // FIXME: 后续考虑改成 queue 方式注册
    await Promise.all(registrationPromise);
  }

  private getValidLanguages(languages: string[]): LanguageDesc[] {
    const validLanguageList: LanguageDesc[] = [];
    languages.forEach((language) => {
      const targetLanguage = getLanguageById(language);
      if (!targetLanguage) {
        this.logger.warn(`No language matched for extname: ${language}`);
        return;
      }
      validLanguageList.push(targetLanguage);
    });
    return validLanguageList;
  }
}
