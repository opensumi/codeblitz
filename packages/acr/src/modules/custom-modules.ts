import { BrowserModule } from '@ali/ide-core-browser';
import { ConstructorOf } from '@ali/ide-core-common';

import { MergeRequestModule } from './merge-request';
import { ThemeAndIconModule } from './theme-icon';
import { WebLiteModule } from './ide-lite';
import { MiscModule } from './misc-module';

export const CustomBrowserModules: ConstructorOf<BrowserModule>[] = [
  MiscModule,
  WebLiteModule,
  ThemeAndIconModule,
  MergeRequestModule,
];
