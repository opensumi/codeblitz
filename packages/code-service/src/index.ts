import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { extendModule, ModuleConstructor } from '@alipay/alex-core';

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
    LineDecorationContribution,
    CommandsContribution,
  ];
}
