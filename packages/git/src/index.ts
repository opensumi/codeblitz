import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';

export class GitFileSchemeModule extends BrowserModule {
  providers: Provider[] = [];
}
