import { Provider, Injectable } from '@ali/common-di';
import { NodeModule } from '../core/app';
import { IExtensionNodeClientService, ExtensionNodeServiceServerPath } from './base';
import { ExtensionServiceClientImpl } from './extension.service.client';

export { ExtensionServiceClientImpl, IExtensionNodeClientService };

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
