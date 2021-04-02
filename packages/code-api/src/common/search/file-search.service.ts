import * as paths from 'path';
import { Injectable, Autowired } from '@ali/common-di';
import { CancellationToken, CancellationTokenSource, URI } from '@ali/ide-core-common';
import { INodeLogger } from '@alipay/alex-core';
import { IFileSearchService } from '@ali/ide-file-search/lib/common';
import { AppConfig } from '@alipay/alex-core';
import { ICodeAPIService } from '@alipay/alex-code-service';

@Injectable()
export class FileSearchService implements IFileSearchService {
  @Autowired(INodeLogger)
  logger: INodeLogger;

  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  async find(
    searchPattern: string,
    options: IFileSearchService.Options,
    clientToken?: CancellationToken
  ): Promise<string[]> {
    const cancellationSource = new CancellationTokenSource();
    if (clientToken) {
      clientToken.onCancellationRequested(() => cancellationSource.cancel());
    }
    const token = cancellationSource.token;
    const opts = {
      fuzzyMatch: true,
      limit: Number.MAX_SAFE_INTEGER,
      useGitIgnore: true,
      ...options,
    };

    return new Promise((resolve) => {
      setTimeout(async () => {
        if (!token.isCancellationRequested) {
          const res = await this.codeAPI.searchFile(searchPattern, opts);

          if (token.isCancellationRequested) {
            return resolve([]);
          }

          resolve(
            res
              .map((filepath) =>
                URI.file(paths.join(this.appConfig.workspaceDir, filepath)).toString()
              )
              .slice(0, options.limit || Number.MAX_SAFE_INTEGER)
          );
        } else {
          resolve([]);
        }
      }, 300);
    });
  }
}
