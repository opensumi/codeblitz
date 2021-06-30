import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { extendModule, ModuleConstructor } from '@alipay/alex-core';
import { ContentSearchServerPath } from '@ali/ide-search/lib/common';
import { FileSearchServicePath } from '@ali/ide-file-search/lib/common';

import { SearchContribution } from './search/search.contributon';
import { ContentSearchService } from './search/content-search.service';
import { FileSearchService } from './search/file-search.service';
import { CodeContribution } from './code-service.contribution';
import { CodeStaticResourceContribution } from './static-resource.contribution';
import { CodeModelService } from './code-model.service';
import { ICodeServiceConfig } from './types';
import { StatusbarContribution } from './statusbar';
import { DecorationProvider } from './decoration.provider';
import { LineDecorationContribution } from './line-decoration.contribution';
import { CommandsContribution } from './commands.contribution';

export { CodeModelService };

export * from './types';

export type { EntryFileType, EntryParam, EntryInfo, TreeEntry } from './types';

@Injectable()
export class CodeServiceModule extends BrowserModule {
  static Config(config: ICodeServiceConfig): ModuleConstructor {
    return extendModule({
      module: CodeServiceModule,
      providers: [
        {
          token: ICodeServiceConfig,
          useValue: config,
        },
      ],
    });
  }

  providers: Provider[] = [
    CodeContribution,
    CodeModelService,
    CodeStaticResourceContribution,
    StatusbarContribution,
    DecorationProvider,
    SearchContribution,
    LineDecorationContribution,
    CommandsContribution,
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
