import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { CodeContribution } from './code-service.contribution';
import { CodeStaticResourceContribution } from './static-resource.contribution';
import { CodeModelService } from './code-model.service';
import { ICodeAPIService } from './types';
import { StatusbarContribution } from './statusbar';
import { DecorationProvider } from './decoration.provider';

export { ICodeAPIService, CodeModelService };

export * from './types';

export type { EntryFileType, EntryParam, EntryInfo, TreeEntry } from './types';

@Injectable()
export class CodeServiceModule extends BrowserModule {
  providers: Provider[] = [
    CodeContribution,
    CodeModelService,
    CodeStaticResourceContribution,
    StatusbarContribution,
    DecorationProvider,
  ];
}
