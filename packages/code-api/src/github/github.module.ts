import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { GitHubService } from './github.service';
import { GithubContribution } from './github.contribution';

@Injectable()
export class GitHubModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: GitHubService,
    },
    GithubContribution,
  ];
}
