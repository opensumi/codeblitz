import { Autowired, Injector } from '@opensumi/di';
import {
  AINativeCoreContribution,
  IAIMiddleware,
  IInlineChatFeatureRegistry,
} from '@opensumi/ide-ai-native/lib/browser/types';
import { Disposable, Domain, IEventBus } from '@opensumi/ide-core-common';
import { RuntimeConfig } from '../../common';

@Domain(AINativeCoreContribution)
export class CodeBlitzAINativeContribution extends Disposable implements AINativeCoreContribution {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  middleware?: IAIMiddleware | undefined;

  constructor() {
    super();
    if (this.runtimeConfig.aiNative?.middleware) {
      this.middleware = this.runtimeConfig.aiNative.middleware;
    }
  }

  registerInlineChatFeature(registry: IInlineChatFeatureRegistry): void {
    const providerInlineChat = this.runtimeConfig.aiNative?.providerEditorInlineChat;

    if (providerInlineChat) {
      const providerValues = providerInlineChat();

      providerValues.forEach(({ operational, handler }) => {
        registry.registerEditorInlineChat(operational, handler);
      });
    }
  }
}
