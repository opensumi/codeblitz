import { RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule, Domain, KeybindingContribution, KeybindingRegistry } from '@opensumi/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser';
import { TabbarRightExtraContentId } from '@opensumi/ide-editor';
import { ITheme, ThemeContributionProvider } from '@opensumi/ide-theme';
import { CodeBlitzCommandContribution } from '../commands';
import { ExtensionActivateContribution } from '../extension/extension.contribution';

@Domain(KeybindingContribution, ThemeContributionProvider, ComponentContribution)
class CodeBlitzContribution implements KeybindingContribution, ThemeContributionProvider, ComponentContribution {
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

  registerComponent(registry: ComponentRegistry) {
    if (this.runtimeConfig.tabBarRightExtraContent) {
      registry.register(TabbarRightExtraContentId, {
        id: TabbarRightExtraContentId,
        component: this.runtimeConfig.tabBarRightExtraContent.component,
        initialProps: this.runtimeConfig.tabBarRightExtraContent.initialProps,
      });
    }
  }

  onWillApplyTheme(theme: ITheme): Record<string, string | undefined> {
    return this.runtimeConfig?.onWillApplyTheme?.(theme) || {};
  }
}

@Injectable()
export class CodeBlitzModule extends BrowserModule {
  providers: Provider[] = [
    ExtensionActivateContribution,
    CodeBlitzCommandContribution,
    CodeBlitzContribution,
  ];
}
