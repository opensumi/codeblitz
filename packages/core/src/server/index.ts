import { ConstructorOf } from '@ali/ide-core-common';
import { BrowserModule } from '@ali/ide-core-browser';
import { ServerCommonModule } from './core/common.module';
import { KaitianExtensionModule } from './kaitian-extension';
import { LogServiceModule } from './logs-core';
import { FileServiceModule } from './file-service';
import { FileSchemeNodeModule } from './file-scheme';

export * from './core';
export * from './kaitian-extension';
export * from './logs-core';
export * from './node';

export const ServerModuleCollection = [
  ServerCommonModule,
  KaitianExtensionModule,
  LogServiceModule,
  FileServiceModule,
  FileSchemeNodeModule,
] as ConstructorOf<BrowserModule>[]; // make types fun
