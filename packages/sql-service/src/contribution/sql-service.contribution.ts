import { Provider, Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  BrowserModule,
  CommandContribution,
  CommandRegistry,
  getLanguageId,
  Disposable,
  CommandService,
  ClientAppContribution,
  IClientApp,
  MaybePromise,

} from '@opensumi/ide-core-browser';
import { CodeModelService } from '@alipay/alex-code-service';
import {} from '@alipay/alex-code-service';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { ISQLServiceConfig } from './sql-service.configuration';
import { CompletionProviderOptions } from '../types';
// import { WorkerAccessor } from './types';


@Injectable()
@Domain(ClientAppContribution)
export class SqlServiceContribution implements ClientAppContribution {

  @Autowired(ISQLServiceConfig)
  sqlConfig: CompletionProviderOptions;


  onDidStart(app: IClientApp): MaybePromise<void> {
    
  }


  // register



}


