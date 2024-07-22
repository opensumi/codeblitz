import { RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule, Domain, KeybindingContribution, KeybindingRegistry } from '@opensumi/ide-core-browser';
import { AlexCommandContribution } from './commands';
import { ExtensionActivateContribution } from './extension/extension.contribution';

@Domain(KeybindingContribution)
class AlexContribution implements KeybindingContribution {
  @Autowired(RuntimeConfig)
  private readonly runtimeConfig: RuntimeConfig;

  registerKeybindings(keybindings: KeybindingRegistry) {
    // 自定义注销的快捷键
    if (this.runtimeConfig.unregisterKeybindings) {
      this.runtimeConfig.unregisterKeybindings.forEach((binding) => {
        keybindings.unregisterKeybinding(binding);
      });
    }

    if (this.runtimeConfig.registerKeybindings?.length) {
      keybindings.registerKeybindings(this.runtimeConfig.registerKeybindings);
    }
  }
}

@Injectable()
export class AlexModule extends BrowserModule {
  providers: Provider[] = [
    ExtensionActivateContribution,
    AlexCommandContribution,
    AlexContribution,
  ];
}
