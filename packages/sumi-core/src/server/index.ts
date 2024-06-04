import { ServerCommonModule } from './core/common.module';
import { ExtensionManagerModule } from './extension-manager';
import { FileSchemeNodeModule } from './file-scheme';
import { FileSearchModule } from './file-search';
import { FileServiceModule } from './file-service';
import { LogServiceModule } from './logs-core';
import { OpenSumiExtensionModule } from './opensumi-extension';
import { SearchModule } from './search';

export * from './ai-native';
export * from './core';
export * from './logs-core';
export * from './node';
export * from './opensumi-extension';

export {
  ExtensionManagerModule,
  FileSchemeNodeModule,
  FileSearchModule,
  FileServiceModule,
  LogServiceModule,
  OpenSumiExtensionModule,
  SearchModule,
  ServerCommonModule,
};

export const ServerModuleCollection = [
  ServerCommonModule,
  OpenSumiExtensionModule,
  LogServiceModule,
  FileServiceModule,
  FileSchemeNodeModule,
  FileSearchModule,
  SearchModule,
  ExtensionManagerModule,
];
