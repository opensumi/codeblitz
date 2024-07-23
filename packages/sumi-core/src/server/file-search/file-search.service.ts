import { Autowired, Injectable } from '@opensumi/di';
import { CancellationToken, CancellationTokenSource, parseGlob as parse, URI } from '@opensumi/ide-core-common';
import { IFileSearchService } from '@opensumi/ide-file-search/lib/common';
import { anchorGlob } from '@opensumi/ide-search/lib/common';
import * as paths from 'path';
import { AppConfig, RuntimeConfig } from '../../common';
import { INodeLogger } from '../core/node-logger';

@Injectable()
export class FileSearchService implements IFileSearchService {
  @Autowired(INodeLogger)
  logger: INodeLogger;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  private async asyncSome(arr, predicate) {
    for (let e of arr) {
      if (await predicate(e)) return true;
    }
    return false;
  }

  private asyncExecute(callback) {
    return new Promise((resolve) => (window.requestIdleCallback || window.setTimeout)(() => resolve(callback())));
  }

  async find(
    searchPattern: string,
    options: IFileSearchService.Options,
    clientToken?: CancellationToken,
  ): Promise<string[]> {
    if (!this.runtimeConfig.fileSearch?.provideResults) {
      return [];
    }

    const cancellationSource = new CancellationTokenSource();
    if (clientToken) {
      clientToken.onCancellationRequested(() => cancellationSource.cancel());
    }
    const token = cancellationSource.token;

    const config = this.runtimeConfig.fileSearch.config || {};

    if (token.isCancellationRequested) {
      return [];
    }

    const provideFileSearchResults = this.runtimeConfig.fileSearch!.provideResults;

    try {
      const res = await provideFileSearchResults(
        { pattern: searchPattern },
        {
          maxResults: options.limit,
          includes: options.includePatterns || [],
          excludes: options.excludePatterns || [],
        },
      );

      if (token.isCancellationRequested) {
        return [];
      }

      if (!res) {
        return [];
      }

      const includeMatcherList = (config.include === 'local'
        && options?.includePatterns?.map((str: string) => parse(anchorGlob(str))))
        || [];
      const excludeMatcherList = (config.exclude === 'local'
        && options?.excludePatterns?.map((str: string) => parse(anchorGlob(str))))
        || [];
      let resCount = 0;
      const result = await Promise.all(
        res.map(async (filepath) => {
          if (options.limit && resCount >= options.limit) {
            return;
          }
          const fileUri = URI.file(paths.join(this.appConfig.workspaceDir, filepath)).toString();
          if (
            includeMatcherList.length > 0
            && !(await this.asyncSome(includeMatcherList, (matcher) => this.asyncExecute(() => matcher(fileUri))))
          ) {
            return;
          }

          if (
            excludeMatcherList.length > 0
            && (await this.asyncSome(excludeMatcherList, (matcher) => this.asyncExecute(() => matcher(fileUri))))
          ) {
            return;
          }
          resCount++;
          return fileUri;
        }),
      );
      if (token.isCancellationRequested) {
        return [];
      }
      return result.filter(Boolean) as string[];
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }
}
