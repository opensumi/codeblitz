import { Autowired } from '@opensumi/di';
import {
  Command,
  CommandContribution,
  CommandRegistry,
  Domain,
  PreferenceProvider,
  PreferenceScope,
} from '@opensumi/ide-core-browser';

/**
 * 内置一些 commands 来调用内部的 service
 */

namespace CODEBLITZ_COMMANDS {
  const CATEGORY = 'alex';

  // 提供更改和获取默认偏好设置的能力，这个无法通过 extension 实现
  export const GET_DEFAULT_PREFERENCE: Command = {
    id: 'alex.getDefaultPreference',
    category: CATEGORY,
  };

  export const SET_DEFAULT_PREFERENCE: Command = {
    id: 'alex.setDefaultPreference',
    category: CATEGORY,
  };
}

@Domain(CommandContribution)
export class CodeBlitzCommandContribution implements CommandContribution {
  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  private readonly defaultPreference: PreferenceProvider;

  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(CODEBLITZ_COMMANDS.GET_DEFAULT_PREFERENCE, {
      execute: (preferenceName: string, resourceUri?: string, language?: string) => {
        return this.defaultPreference.get(preferenceName, resourceUri, language);
      },
    });

    registry.registerCommand(CODEBLITZ_COMMANDS.SET_DEFAULT_PREFERENCE, {
      execute: (preferenceName: string, value: any, resourceUri?: string, language?: string) => {
        return this.defaultPreference.setPreference(preferenceName, value, resourceUri, language);
      },
    });

    // TODO OpenSumi 内加入命令
    ['workbench.action.closePanel', 'workbench.action.closeSidebar', 'vscode.setEditorLayout'].map(
      (id) => registry.registerCommand({ id }, { execute: () => {} }),
    );
  }
}
