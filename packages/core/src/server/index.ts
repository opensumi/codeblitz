import { ServerCommonModule } from './core/common.module';
import { KaitianExtensionModule } from './kaitian-extension';
import { LogServiceModule } from './logs-core';
import { FileServiceModule } from './file-service';
import { FileSchemeNodeModule } from './file-scheme';
import { FileSearchModule } from './file-search';

export * from './core';
export * from './kaitian-extension';
export * from './logs-core';
export * from './node';

export {
  ServerCommonModule,
  KaitianExtensionModule,
  LogServiceModule,
  FileServiceModule,
  FileSchemeNodeModule,
  FileSearchModule,
};

export const ServerModuleCollection = [
  ServerCommonModule,
  KaitianExtensionModule,
  LogServiceModule,
  FileServiceModule,
  FileSchemeNodeModule,
  FileSearchModule,
];
