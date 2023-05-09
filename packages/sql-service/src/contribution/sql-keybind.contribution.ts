import { Autowired } from '@opensumi/di';
import { Domain, CommandRegistry, URI } from '@opensumi/ide-core-common';
import {
  CommandContribution,
  KeybindingContribution,
  KeybindingRegistry,
} from '@opensumi/ide-core-browser';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { RuntimeConfig } from '@alipay/alex-core';

const TOGGLE_CHANGE_VIEWED = 'commands.markAsRead';
// const keybinding = [
//   {
//     command: FILE_COMMANDS.COPY_FILE.id,
//     // keybinding: 'ctrlcmd+c',
//     // when: `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
//   },
//   {
//     command: FILE_COMMANDS.PASTE_FILE.id,
//     keybinding: 'ctrlcmd+v',
//     when: `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
//   },
//   {
//     command: FILE_COMMANDS.CUT_FILE.id,
//     keybinding: 'ctrlcmd+x',
//     when: `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
//   },
//   {
//     command: FILE_COMMANDS.RENAME_FILE.id,
//     keybinding: 'enter',
//     when: `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
//   },
//   {
//     command: FILE_COMMANDS.DELETE_FILE.id,
//     keybinding: 'ctrlcmd+backspace',
//     when: `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
//   },
// ];

@Domain(CommandContribution, KeybindingContribution)
export class SQLKeybindContribution implements CommandContribution, KeybindingContribution {

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      {
        id: TOGGLE_CHANGE_VIEWED,
        label: '%commands.markAsRead%',
      },
      {
        execute: async (_uri?: URI) => {
          // @ts-ignore
          const uri = _uri || this.workbenchEditorService.currentResource.uri;
          if (uri) {
          }
        },
      }
    );
  }

  // registerKeybindings(keybindings: KeybindingRegistry): void {
  //   keybindings.registerKeybinding({
  //     command: TOGGLE_CHANGE_VIEWED,
  //     keybinding: 'alt+c',
  //   });
  // }

  registerKeybindings(keybindings: KeybindingRegistry) {
    const keybindingList = [
      'ctrlcmd+,',
      'ctrlcmd+shift+p',
      'ctrlcmd+p',
      'F1',
      'alt+n',
      'alt+shift+t',
      'alt+shift+w',
      'ctrlcmd+\\',
    ];
    for (let i = 1; i < 10; i++) {
      keybindingList.push(`ctrlcmd+${i}`);
    }
    // 自定义注销的快捷键
    if (this.runtimeConfig.unregisterKeybindings) {
      keybindingList.push(...this.runtimeConfig.unregisterKeybindings);
    }

    keybindingList.forEach((binding) => {
      keybindings.unregisterKeybinding(binding);
    });




  }
}
