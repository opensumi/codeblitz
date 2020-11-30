import { Provider, Injectable } from '@ali/common-di';
import { NodeModule } from '../core/app';
import { ExtensionServiceClientImpl } from './extension.service.client';
import { IExtensionNodeClientService, ExtensionNodeServiceServerPath } from './common';

@Injectable()
export class KaitianExtensionModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IExtensionNodeClientService,
      useClass: ExtensionServiceClientImpl,
    },
  ];
  backServices = [
    {
      servicePath: ExtensionNodeServiceServerPath,
      token: IExtensionNodeClientService,
    },
  ];
}
