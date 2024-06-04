import { AINativeServerModule, IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { AINativeModule } from '@opensumi/ide-ai-native/lib/browser';

export function interceptAppOpts(opts: IAppOpts, runtimeConfig: RuntimeConfig) {
  const { modules } = opts;

  if (runtimeConfig.aiNative?.enable) {
    if (modules.indexOf(AINativeModule) === -1) {
      modules.push(AINativeModule);
      modules.push(AINativeServerModule);
    }
  }

  return opts;
}
