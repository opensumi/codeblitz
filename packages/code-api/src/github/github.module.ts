import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { ContentSearchServerPath } from '@ali/ide-search/lib/common';
import { FileSearchServicePath } from '@ali/ide-file-search/lib/common';

import { GitHubService } from './github.service';
import { GithubContribution } from './github.contribution';
import { SearchContribution } from '../common/search/search.contributon';
import { ContentSearchService } from '../common/search/content-search.service';
import { FileSearchService } from '../common/search/file-search.service';

@Injectable()
export class GitHubModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: GitHubService,
    },
    GithubContribution,
    SearchContribution,
    {
      token: ContentSearchServerPath,
      useClass: ContentSearchService,
      override: true,
    },
    {
      token: FileSearchServicePath,
      useClass: FileSearchService,
      override: true,
    },
  ];
}
