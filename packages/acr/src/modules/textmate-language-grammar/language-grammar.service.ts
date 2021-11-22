import { Autowired, Injectable } from '@ali/common-di';
import { Disposable, Deferred, ILogger } from '@ali/ide-core-common';
import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import type { loadLanguageAndGrammar } from '@ali/kaitian-textmate-languages';
import { getLanguageByExtnameAndFilename } from '@ali/kaitian-textmate-languages/es/utils';
import * as paths from '@ali/ide-core-common/lib/path';

import { IAntcodeService } from '../antcode-service/base';
import { ILanguageGrammarRegistrationService } from './base';
import {
  reportRepoMainLang,
  reportChangeFilesMainLang,
  reportCannotRecognizeFile,
} from '../../utils/monitor';

@Injectable()
export class LanguageGrammarRegistrationService
  extends Disposable
  implements ILanguageGrammarRegistrationService
{
  @Autowired(TextmateService)
  private readonly textMateService: TextmateService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(ILogger)
  private readonly logger: ILogger;

  private languageDidRegisterDeferred = new Deferred<void>();
  public get languageDidRegistered() {
    return this.languageDidRegisterDeferred.promise;
  }

  private registeredLanguageSet = new Set<string>();

  async initRegisterLanguageAndGrammar() {
    // antcode 接口只能获取 master 分支上的文件后缀名
    let extnameList: string[] = [];
    try {
      extnameList.push(...(await this.antcodeService.getLanguages()));
    } catch (err: any) {
      this.logger.warn('getLanguages failed:' + err.toString());
    }
    if (!extnameList.length) {
      return;
    }

    // 增加 prefix `.` 因为后端返回的文件后缀名不包含 dot 符
    const fileStatList = extnameList.map((n) => ({ extname: '.' + n }));
    const changeFilesMainLanguageList = await this.registerByExtAndFilenames(fileStatList);

    // 如果 initRegisterLanguageAndGrammar 挂了，在这里补偿，避免 lsif 服务注册不上去
    this.languageDidRegisterDeferred.resolve();

    this.reportRepoLanguage(
      changeFilesMainLanguageList[0]?.id,
      changeFilesMainLanguageList.map((n) => n.id)
    );
  }

  /**
   * 通过文件名来注册语言
   * @param extname string
   */
  async registerByFilenames(filenames: string[]) {
    const fileStatList = filenames.map((filename) => ({
      extname: paths.extname(filename),
      filename,
    }));

    const changeFilesMainLanguageList = await this.registerByExtAndFilenames(fileStatList);

    // 如果 initRegisterLanguageAndGrammar 挂了，在这里补偿，避免 lsif 服务注册不上去
    this.languageDidRegisterDeferred.resolve();
    this.reportPRMainLanguage(changeFilesMainLanguageList);
  }

  /**
   * 通过文件名来注册语言
   * @param extname string
   * 返回结果不去重，是为了做数据统计和上报
   */
  private async registerByExtAndFilenames(
    fileStatList: Array<{
      extname: string;
      filename?: string;
    }>
  ): Promise<ILanguageDesc[]> {
    // 先不去重，为了做数据统计
    const changeFilesMainLanguageList: ILanguageDesc[] = [];
    for (const fileStat of fileStatList) {
      const { extname, filename } = fileStat;
      if (!extname || extname === '.') {
        continue;
      }

      const language = this.getLanguageDescByExtAndFilename(extname, filename);
      if (!language) {
        continue;
      }

      changeFilesMainLanguageList.push(language);
    }

    const uniqueChangeFilesMainLang = new Set(changeFilesMainLanguageList);

    // 去重处理
    for (const languageDesc of uniqueChangeFilesMainLang) {
      if (languageDesc.extensionPackageName) {
        await this.registerLanguageAndGrammar(languageDesc.extensionPackageName);
      }
    }

    return changeFilesMainLanguageList;
  }

  private getLanguageDescByExtAndFilename(
    extname: string,
    filename?: string
  ): ILanguageDesc | undefined {
    const language = getLanguageByExtnameAndFilename(extname, filename);
    if (!language) {
      // 上报到 语言
      this.logger.warn(`No language matched for extname: ${extname}`);
      reportCannotRecognizeFile(extname, filename || '', this.antcodeService.projectMeta);
    }
    return language;
  }

  /**
   * 上报跟 change files 相关的主语言
   * 格式为文件后缀
   */
  private reportPRMainLanguage(languages: ILanguageDesc[]) {
    const extsDesc = languages.reduce((prev, cur) => {
      const language = cur.id;
      prev[language] = (prev[language] || 0) + 1;
      return prev;
    }, {});
    const prLanguages = Object.keys(extsDesc).sort((a, b) => extsDesc[b] - extsDesc[a]);
    reportChangeFilesMainLang(prLanguages[0], prLanguages, this.antcodeService.projectMeta);
  }

  async registerLanguageAndGrammar(languageExtPack: string) {
    if (this.registeredLanguageSet.has(languageExtPack)) {
      this.logger.warn(`This language ext pack: ${languageExtPack} already registered`);
      return;
    }

    this.registeredLanguageSet.add(languageExtPack);

    const mod = require(`@ali/kaitian-textmate-languages/lib/${languageExtPack}`);
    const loadLanguage: loadLanguageAndGrammar = 'default' in mod ? mod.default : mod;
    const registrationPromise = loadLanguage(
      this.textMateService.registerLanguage.bind(this.textMateService),
      this.textMateService.registerGrammar.bind(this.textMateService)
    );
    // FIXME: 后续考虑改成 queue 方式注册
    await Promise.all(registrationPromise);
  }

  /**
   * @param language {string} empty 表示仓库主语言没查询到
   */
  private reportRepoLanguage(language: string, languages: string[]) {
    reportRepoMainLang(language || 'empty', languages || [], this.antcodeService.projectMeta);
  }
}
