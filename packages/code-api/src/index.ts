import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIProvider } from './common/types';
import { CodeAPIProvider } from './code-api.provider';
import { CodeAPIContribution } from './code-api.contribution';

export * from './common';

@Injectable()
export class CodeAPIModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIProvider,
      useClass: CodeAPIProvider,
    },
    CodeAPIContribution,
  ];
}
