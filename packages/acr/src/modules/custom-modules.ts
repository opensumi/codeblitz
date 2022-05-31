import { BrowserModule } from '@opensumi/ide-core-browser';
import { ConstructorOf } from '@opensumi/ide-core-common';

import { MergeRequestModule } from './merge-request';
import { WebLiteModule } from './ide-lite';
import { MiscModule } from './misc-module';

export const CustomBrowserModules: ConstructorOf<BrowserModule>[] = [
  MiscModule,
  WebLiteModule,
  MergeRequestModule,
];
