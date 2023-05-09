import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { extendModule, ModuleConstructor } from '@alipay/alex-core';
import { CompletionProviderOptions, supportLanguage } from './types';
import { ISQLServiceConfig } from './contribution/sql-service.configuration';
import { SqlServiceContribution } from './contribution/sql-service.contribution';

export * from './types';

const defaultConfig: CompletionProviderOptions = {
  options: { language: supportLanguage.ODPSSQL },
};

@Injectable()
export class SqlServiceModule extends BrowserModule {
  static Config(config: CompletionProviderOptions): ModuleConstructor {
    return extendModule({
      module: SqlServiceModule,
      providers: [
        {
          token: ISQLServiceConfig,
          useValue: config || defaultConfig,
        },
      ],
    });
  }

  providers: Provider[] = [SqlServiceContribution];
}
export function generateCorsUrl(url) {
  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${url}');`)}`;
}

export function setMonacoEnvironment() {
  self['MonacoEnvironment'] = {
    getWorkerUrl: function () {
      return generateCorsUrl('http://127.0.0.1:8080/dist/odps-worker.c12f03e6.js');
    },
  };
}
