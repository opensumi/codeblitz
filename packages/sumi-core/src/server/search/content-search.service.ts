import { Autowired, Injectable } from '@opensumi/di';
import { ILogService, parseGlob as parse, SupportLogNamespace, URI } from '@opensumi/ide-core-common';
import { IContentSearchClientService } from '@opensumi/ide-search';
import {
  anchorGlob,
  ContentSearchOptions,
  ContentSearchResult,
  cutShortSearchResult,
  DEFAULT_SEARCH_IN_WORKSPACE_LIMIT,
  IContentSearchServer,
  SEARCH_STATE,
} from '@opensumi/ide-search/lib/common';
import { getMapForWordSeparators } from '@opensumi/monaco-editor-core/esm/vs/editor/common/core/wordCharacterClassifier';
import { isValidMatch } from '@opensumi/monaco-editor-core/esm/vs/editor/common/model/textModelSearch';
import * as paths from 'path';
import { AppConfig, RuntimeConfig } from '../../common';
import { ILogServiceManager } from '../core/base';
import { BatchedCollector } from './search-manager';

interface SearchInfo {
  searchId: number;
  resultLength: number;
  dataBuf: string;
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

  @Autowired(IContentSearchClientService)
  searchService: IContentSearchClientService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

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
    searchId: number,
    what: string,
    rootUris: string[],
    opts?: ContentSearchOptions,
    cb?: (data: any) => {},
  ): Promise<number> {
    const searchInfo: SearchInfo = {
      searchId: searchId,
      resultLength: 0,
      dataBuf: '',
    };
    // 先把 searchId 发送到 client 再请求，否则可能状态不对
    setTimeout(() => {
      this.searchStart(searchInfo.searchId);
      if (!this.runtimeConfig.textSearch?.provideResults) {
        this.searchEnd(searchInfo.searchId);
      } else {
        this.request(what, searchInfo, opts);
      }
    });

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
    error?: string,
  ) {
    if (this.requestMap.has(id)) {
      // @ts-ignore
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
      const collector = new BatchedCollector<ContentSearchResult>(512, (results) => {
        this.sendResultToClient(results, searchInfo.searchId);
      });

      const config = this.runtimeConfig.textSearch?.config ?? {};

      const includeMatcherList = (config.include === 'local'
        && opts?.include?.map((str: string) => parse(anchorGlob(str))))
        || [];
      const excludeMatcherList = (config.exclude === 'local'
        && opts?.exclude?.map((str: string) => parse(anchorGlob(str))))
        || [];
      const wordSeparators = config.wordMatch === 'local' && opts?.matchWholeWord
        ? getMapForWordSeparators('`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/? \n')
        : null;

      const maxResults = opts?.maxResults || DEFAULT_SEARCH_IN_WORKSPACE_LIMIT;

      let limitHit = false;
      await this.runtimeConfig.textSearch!.provideResults(
        {
          pattern: searchString,
          isCaseSensitive: opts?.matchCase,
          isWordMatch: opts?.matchWholeWord,
          isRegExp: opts?.useRegExp,
        },
        {
          maxResults,
          includes: opts?.include || [],
          excludes: opts?.exclude || [],
        },
        {
          report: (data) => {
            if (!data) return;
            if (limitHit) {
              return;
            }
            const {
              lineNumber,
              path,
              preview: { text, matches },
            } = data;
            const fileUri = URI.file(paths.join(this.appConfig.workspaceDir, path)).toString();

            if (
              includeMatcherList.length > 0
              && !includeMatcherList.some((matcher) => matcher(fileUri))
            ) {
              return;
            }

            if (
              excludeMatcherList.length > 0
              && excludeMatcherList.some((matcher) => matcher(fileUri))
            ) {
              return;
            }

            matches.forEach(([start, end]) => {
              const matchString = text.slice(start, end);
              if (
                config.caseSensitive === 'local'
                && opts?.matchCase
                && searchString !== matchString
              ) {
                return;
              }
              if (
                wordSeparators
                && !isValidMatch(wordSeparators, text, text.length, start, end - start)
              ) {
                return;
              }
              if (limitHit) {
                return;
              }
              collector.addItem(
                cutShortSearchResult({
                  fileUri,
                  line: lineNumber,
                  matchStart: start + 1,
                  matchLength: end - start,
                  lineText: text.replace(/[\r\n]+$/, ''),
                }),
                1,
              );
              if (collector.total >= maxResults) {
                limitHit = true;
              }
            });
          },
        },
      );

      collector!.flush();
      this.searchEnd(searchInfo.searchId);
    } catch (err: any) {
      this.logger.error(err);
      this.searchError(searchInfo.searchId, `search error ${err?.message || ''}`);
    }
  }

  dispose(): void {
    this.requestMap.clear();
  }
}
