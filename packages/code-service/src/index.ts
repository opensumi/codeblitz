import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { CodeContribution } from './code-service.contribution';
import { CodeAPIService } from './code-api.service';
import { CodeStaticResourceContribution } from './static-resource.contribution';
import { CodeModelService } from './code-model.service';
import { ICodeAPIService } from './types';

@Injectable()
export class GitFileSchemeModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: CodeAPIService,
    },
    CodeContribution,
    CodeModelService,
    CodeStaticResourceContribution,
  ];
}
