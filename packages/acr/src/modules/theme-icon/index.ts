import { Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ThemeAndIconContribution } from './index.contribution';

@Injectable()
export class ThemeAndIconModule extends BrowserModule {
  providers = [ThemeAndIconContribution];
}
