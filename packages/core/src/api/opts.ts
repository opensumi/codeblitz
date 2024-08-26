import { AINativeServerModule, IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { AINativeModule } from '@opensumi/ide-ai-native/lib/browser';
import { ModuleConstructor } from '@opensumi/ide-core-browser';
import { DesignModule } from '@opensumi/ide-design/lib/browser';
import { OpenedEditorModule } from '@opensumi/ide-opened-editor/lib/browser';
import { OutlineModule } from '@opensumi/ide-outline/lib/browser';

function removeModule(modules: ModuleConstructor[], module: ModuleConstructor) {
  const index = modules.indexOf(module);
  if (index > -1) {
    modules.splice(index, 1);
  }
}

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
    removeModule(newModules, DesignModule);
  }

  if (opts.useSimplifyExplorerPanel) {
    // remove outline module
    removeModule(newModules, OutlineModule);
    // remove opened editor module
    removeModule(newModules, OpenedEditorModule);
  }

  opts.modules = newModules;

  return opts;
}
