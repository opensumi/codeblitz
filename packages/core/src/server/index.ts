import { ConstructorOf } from '@ali/ide-core-common';
import { NodeModule } from './core';
import { ServerCommonModule } from './core/common.module';
import { KaitianExtensionModule } from './kaitian-extension';
import { LogServiceModule } from './logs-core';
import { FileServiceModule } from './file-service';
import { FileSchemeNodeModule } from './file-scheme';

export * from './core';
export * from './kaitian-extension';
export * from './logs-core';

export const ServerModuleCollection: ConstructorOf<NodeModule>[] = [
  ServerCommonModule,
  KaitianExtensionModule,
  LogServiceModule,
  FileServiceModule,
  FileSchemeNodeModule,
];
