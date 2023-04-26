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
// import { WorkerAccessor } from './types';

export const ISQLServiceConfig = Symbol('ISQLServiceConfig');

// @Injectable()
// export class SqlServiceConfig {




// }


