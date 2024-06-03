import { Injector } from "@opensumi/di";
import { AppConfig, RuntimeConfig } from "../../common";

export const injectAINativePreferences = (injector: Injector): void => {
  const runtimeConfig: RuntimeConfig = injector.get(RuntimeConfig);
  const appConfig: AppConfig = injector.get(AppConfig);

  if (runtimeConfig.aiNative && runtimeConfig.aiNative.enable) {
    const aiNativeCaps = runtimeConfig.aiNative.capabilities || {};

    appConfig.AINativeConfig = {
      capabilities: {
        ...appConfig.AINativeConfig?.capabilities,
        ...aiNativeCaps,
      }
    }
  }

}
