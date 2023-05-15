import { Injectable, Provider, Autowired } from '@opensumi/di';
import {
  BrowserModule,
  KeybindingContribution,
  Domain,
  KeybindingRegistry,
} from '@opensumi/ide-core-browser';
import { RuntimeConfig } from '@alipay/alex-core';
import { ExtensionActivateContribution } from './extension/extension.contribution';
import { AlexCommandContribution } from './commands';

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

    if(this.runtimeConfig.registerKeybindings?.length){
      keybindings.registerKeybindings(this.runtimeConfig.registerKeybindings)
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
