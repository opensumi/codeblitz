import { Injectable, Provider } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { ExtensionNodeServiceServerPath, IExtensionNodeClientService } from './base';
import { ExtensionServiceClientImpl } from './extension.service.client';

export { ExtensionServiceClientImpl, IExtensionNodeClientService };

@Injectable()
export class OpenSumiExtensionModule extends NodeModule {
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
