import { AINativeServerModule, IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { AINativeModule } from '@opensumi/ide-ai-native/lib/browser';
import { DesignModule } from '@opensumi/ide-design/lib/browser';

export function interceptAppOpts(opts: IAppOpts, runtimeConfig: RuntimeConfig) {
  const { modules } = opts;

  const newModules = [...modules];

  if (runtimeConfig.aiNative?.enable) {
    if (modules.indexOf(AINativeModule) === -1) {
      newModules.push(AINativeModule);
      newModules.push(AINativeServerModule);
    }
  }

  if (opts.useLegacyDesign) {
    // remove design module
    const index = newModules.indexOf(DesignModule);
    if (index > -1) {
      newModules.splice(index, 1);
    }
  }

  opts.modules = newModules;

  return opts;
}
