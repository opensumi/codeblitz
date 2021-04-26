import { Provider, Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { IPluginService } from './types';
import { PluginService } from './plugin.service';
import { PluginContribution } from './plugin.contribution';

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
