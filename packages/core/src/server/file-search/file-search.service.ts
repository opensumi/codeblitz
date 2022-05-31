import * as paths from 'path';
import { Injectable, Autowired } from '@opensumi/di';
import { CancellationToken, CancellationTokenSource, URI } from '@opensumi/ide-core-common';
import { parse } from '@opensumi/ide-core-common/lib/utils/glob';
import { IFileSearchService } from '@opensumi/ide-file-search/lib/common';
import { anchorGlob } from '@opensumi/ide-search/lib/common';
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

  async find(
    searchPattern: string,
    options: IFileSearchService.Options,
    clientToken?: CancellationToken
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

    return new Promise((resolve) => {
      setTimeout(async () => {
        if (token.isCancellationRequested) {
          return resolve([]);
        }

        const provideFileSearchResults = this.runtimeConfig.fileSearch!.provideResults;

        try {
          const res = await provideFileSearchResults(
            { pattern: searchPattern },
            {
              maxResults: options.limit,
              includes: options.includePatterns || [],
              excludes: options.excludePatterns || [],
            }
          );

          if (token.isCancellationRequested) {
            return resolve([]);
          }

          if (!res) {
            return resolve([]);
          }

          const includeMatcherList =
            (config.include === 'local' &&
              options?.includePatterns?.map((str: string) => parse(anchorGlob(str)))) ||
            [];
          const excludeMatcherList =
            (config.exclude === 'local' &&
              options?.excludePatterns?.map((str: string) => parse(anchorGlob(str)))) ||
            [];

          const filterRes: string[] = [];

          res.forEach((filepath) => {
            if (options.limit && filterRes.length >= options.limit) {
              return;
            }
            const fileUri = URI.file(paths.join(this.appConfig.workspaceDir, filepath)).toString();
            if (
              includeMatcherList.length > 0 &&
              !includeMatcherList.some((matcher) => matcher(fileUri))
            )
              return;

            if (
              excludeMatcherList.length > 0 &&
              excludeMatcherList.some((matcher) => matcher(fileUri))
            )
              return;

            filterRes.push(fileUri);
          });

          resolve(filterRes);
        } catch (err) {
          this.logger.error(err);
          resolve([]);
        }
      }, 300);
    });
  }
}
