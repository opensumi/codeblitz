import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { GitContribution } from './git.contribution';
import { GitAPIService } from './git-api.service';
import { GitStaticResourceContribution } from './static-resource.contribution';
import { IGitAPIService } from './types';

@Injectable()
export class GitFileSchemeModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IGitAPIService,
      useClass: GitAPIService,
    },
    GitContribution,
    GitStaticResourceContribution,
  ];
}
