import { Injectable, Autowired } from '@ali/common-di';
import { SupportLogNamespace, ILogService, URI } from '@ali/ide-core-common';
import { ILogServiceManager, AppConfig } from '@alipay/alex-core';
import {
  IContentSearchServer,
  ContentSearchOptions,
  ContentSearchResult,
  SEARCH_STATE,
  cutShortSearchResult,
  DEFAULT_SEARCH_IN_WORKSPACE_LIMIT,
} from '@ali/ide-search/lib/common';
import { ContentSearchClientService } from '@ali/ide-search/lib/browser/search.service';
import { ICodeAPIService } from '@alipay/alex-code-service';
import * as paths from 'path';

interface SearchInfo {
  searchId: number;
  resultLength: number;
}

interface RegExpOptions {
  matchCase?: boolean;
  wholeWord?: boolean;
  multiline?: boolean;
  global?: boolean;
  unicode?: boolean;
}

@Injectable()
export class ContentSearchService implements IContentSearchServer {
  private searchId: number = new Date().getTime();
  private requestMap: Map<number, boolean> = new Map();

  @Autowired(ILogServiceManager)
  loggerManager: ILogServiceManager;

  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

  @Autowired(ContentSearchClientService)
  searchService: ContentSearchClientService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  private logger: ILogService;

  constructor() {
    this.logger = this.loggerManager.getLogger(SupportLogNamespace.Node);
  }

  private searchStart(searchId) {
    this.requestMap.set(searchId, true);
    this.sendResultToClient([], searchId, SEARCH_STATE.doing);
  }

  private searchEnd(searchId) {
    this.sendResultToClient([], searchId, SEARCH_STATE.done);
    this.requestMap.delete(searchId);
  }

  private searchError(searchId, error: string) {
    this.sendResultToClient([], searchId, SEARCH_STATE.error, error);
    this.requestMap.delete(searchId);
  }

  async search(
    what: string,
    rootUris: string[],
    opts?: ContentSearchOptions,
    cb?: (data: any) => {}
  ): Promise<number> {
    const searchInfo: SearchInfo = {
      searchId: this.searchId++,
      resultLength: 0,
    };

    this.searchStart(searchInfo.searchId);

    this.request(what, searchInfo, opts);

    return searchInfo.searchId;
  }

  cancel(searchId: number): Promise<void> {
    this.searchEnd(searchId);
    return Promise.resolve();
  }

  private sendResultToClient(
    data: ContentSearchResult[],
    id: number,
    searchState?: SEARCH_STATE,
    error?: string
  ) {
    if (this.requestMap.has(id)) {
      this.searchService.onSearchResult({
        data,
        id,
        searchState,
        error,
      });
    }
  }

  private async request(searchString: string, searchInfo: SearchInfo, opts?: ContentSearchOptions) {
    if (!searchString) {
      return this.searchEnd(searchInfo.searchId);
    }
    try {
      const requestResults = await this.codeAPI.searchContent(searchString, {
        limit: opts?.maxResults || DEFAULT_SEARCH_IN_WORKSPACE_LIMIT,
      });

      if (!requestResults.length) {
        return this.searchEnd(searchInfo.searchId);
      }

      const vsRequire = (window as any).amdLoader.require;
      vsRequire(
        [
          'vs/editor/common/controller/wordCharacterClassifier',
          'vs/editor/common/model/textModelSearch',
        ],
        ({ getMapForWordSeparators }, { isValidMatch }) => {
          const matchCase = !!opts?.matchCase;
          const wordSeparators = opts?.matchWholeWord
            ? getMapForWordSeparators('`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/? \n')
            : null;

          const regex = this.createRegExp(searchString, false, {
            matchCase: matchCase,
            wholeWord: false,
            multiline: false,
            global: true,
            unicode: true,
          });

          let simpleSearch = true;
          if (searchString.toLowerCase() !== searchString.toUpperCase()) {
            // casing might make a difference
            simpleSearch = matchCase;
          }

          const results: ContentSearchResult[] = [];

          requestResults.forEach(({ path, line, content }) => {
            const searchStringLen = searchString.length;
            const textLength = content.length;

            if (simpleSearch) {
              let lastMatchIndex = -searchStringLen;
              while (
                (lastMatchIndex = content.indexOf(
                  searchString,
                  lastMatchIndex + searchStringLen
                )) !== -1
              ) {
                if (
                  !wordSeparators ||
                  isValidMatch(wordSeparators, content, textLength, lastMatchIndex, searchStringLen)
                ) {
                  results.push(
                    cutShortSearchResult({
                      fileUri: URI.file(paths.join(this.appConfig.workspaceDir, path)).toString(),
                      line,
                      matchStart: lastMatchIndex + 1,
                      matchLength: searchStringLen,
                      lineText: content.replace(/[\r\n]+$/, ''),
                    })
                  );
                }
              }
            } else {
              regex.lastIndex = 0;
              let m: RegExpExecArray | null;
              do {
                m = regex.exec(content);
                if (!m) {
                  return;
                }
                const matchStartIndex = m.index;
                const matchLength = m[0].length;
                if (
                  !wordSeparators ||
                  isValidMatch(wordSeparators, content, textLength, matchStartIndex, matchLength)
                ) {
                  results.push(
                    cutShortSearchResult({
                      fileUri: URI.file(paths.join(this.appConfig.workspaceDir, path)).toString(),
                      line,
                      matchStart: matchStartIndex + 1,
                      matchLength: searchStringLen,
                      lineText: content.replace(/[\r\n]+$/, ''),
                    })
                  );
                }
              } while (m);
            }
          });

          this.sendResultToClient(results, searchInfo.searchId);
          this.searchEnd(searchInfo.searchId);
        }
      );
    } catch (err) {
      this.logger.error(err);
      this.searchError(searchInfo.searchId, `search error ${err?.message || ''}`);
    }
  }

  private createRegExp(searchString: string, isRegex: boolean, options: RegExpOptions = {}) {
    if (!searchString) {
      throw new Error('Cannot create regex from empty string');
    }
    if (!isRegex) {
      searchString = searchString.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&');
    }
    if (options.wholeWord) {
      if (!/\B/.test(searchString.charAt(0))) {
        searchString = '\\b' + searchString;
      }
      if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
        searchString = searchString + '\\b';
      }
    }
    let modifiers = '';
    if (options.global) {
      modifiers += 'g';
    }
    if (!options.matchCase) {
      modifiers += 'i';
    }
    if (options.multiline) {
      modifiers += 'm';
    }
    if (options.unicode) {
      modifiers += 'u';
    }

    return new RegExp(searchString, modifiers);
  }
}
