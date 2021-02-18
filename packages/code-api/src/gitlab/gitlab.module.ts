import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { GitLabService } from './gitlab.service';

@Injectable()
export class GitLabModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: GitLabService,
    },
  ];
}
