import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { IDiskFileProvider } from '@ali/ide-file-service';
import { GitFsProviderClient } from './git-file-client.provider';
import { GitContribution } from './git.contribution';

@Injectable()
export class GitFileSchemeModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IDiskFileProvider,
      useClass: GitFsProviderClient,
      override: true,
    },
    GitContribution,
  ];
}
