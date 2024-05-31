import { Injectable, Provider } from '@opensumi/di';
import { AIBackSerivcePath, AIBackSerivceToken } from '@opensumi/ide-core-common';
import { NodeModule } from '../core/app';
import { ChatProxyServiceToken } from '@opensumi/ide-ai-native/lib/common';
import { BaseAIBackService } from './ai-back-service';


@Injectable()
export class AINativeModule extends NodeModule {
  providers: Provider[] = [
    {
      token: AIBackSerivceToken,
      useClass: BaseAIBackService,
    },
  ];

  backServices = [
    {
      servicePath: AIBackSerivcePath,
      token: AIBackSerivceToken,
      clientToken: ChatProxyServiceToken,
    },
  ];
}
