import { extendModule, ModuleConstructor } from '@codeblitzjs/ide-sumi-core';
import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { CodeModelService } from './code-model.service';
import { CodeContribution } from './code-service.contribution';
import { CommandsContribution } from './commands.contribution';
import { DecorationProvider } from './decoration.provider';
import { LineDecorationContribution } from './line-decoration.contribution';
import { CodeStaticResourceContribution } from './static-resource.contribution';
import { StatusbarContribution } from './statusbar';
import { ICodeServiceConfig } from './types';

export { CodeModelService };

export * from './commands';
export * from './types';

export type { EntryFileType, EntryInfo, EntryParam, TreeEntry } from './types';

@Injectable()
export class CodeServiceModule extends BrowserModule {
  static Config(config: ICodeServiceConfig): ModuleConstructor {
    return extendModule({
      module: CodeServiceModule,
      providers: [
        {
          token: ICodeServiceConfig,
          useValue: config,
          override: true,
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
