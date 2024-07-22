import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { PluginContribution } from './plugin.contribution';
import { PluginService } from './plugin.service';
import { IPluginService } from './types';

export * from './types';

@Injectable()
export class PluginModule extends BrowserModule {
  providers: Provider[] = [
    PluginContribution,
    {
      token: IPluginService,
      useClass: PluginService,
    },
  ];
}
