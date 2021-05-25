import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ExtensionActivateContribution } from './extension/extension.contribution';

@Injectable()
export class AlexModule extends BrowserModule {
  providers: Provider[] = [ExtensionActivateContribution];
}
