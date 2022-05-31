import { Autowired } from '@opensumi/di';
import { Domain, CommandRegistry, URI } from '@opensumi/ide-core-common';
import {
  CommandContribution,
  KeybindingContribution,
  KeybindingRegistry,
} from '@opensumi/ide-core-browser';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { IAntcodeService } from './antcode-service/base';

const TOGGLE_CHANGE_VIEWED = 'commands.markAsRead';

@Domain(CommandContribution, KeybindingContribution)
export class ChangeFileViewedContribution implements CommandContribution, KeybindingContribution {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

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
            await this.antcodeService.toggleFileViewed(uri);
          }
        },
      }
    );
  }

  registerKeybindings(keybindings: KeybindingRegistry): void {
    keybindings.registerKeybinding({
      command: TOGGLE_CHANGE_VIEWED,
      keybinding: 'alt+c',
    });
  }
}
