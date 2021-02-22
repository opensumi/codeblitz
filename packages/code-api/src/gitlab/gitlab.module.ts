import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { GitLabService } from './gitlab.service';
import { GithubContribution } from './gitlab.cotribution';

@Injectable()
export class GitLabModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: GitLabService,
    },
    GithubContribution,
  ];
}
