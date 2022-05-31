import { Autowired } from '@opensumi/di';
import { Domain, CommandRegistry } from '@opensumi/ide-core-common';
import { WorkbenchEditorService, IResource } from '@opensumi/ide-editor/lib/browser';
import {
  KeybindingContribution,
  KeybindingRegistry,
  CommandContribution,
  IEventBus,
} from '@opensumi/ide-core-browser';
import { IAntcodeService } from '../../antcode-service/base';
import { OpenChangeFilesService } from '../../open-change-files';
import { GOTO_PREVIOUS_CHANGE, GOTO_NEXT_CHANGE } from '../../merge-request/common';
import { ACR_IS_FULLSCREEN } from '../../../constant';

@Domain(CommandContribution, KeybindingContribution)
export class ChangesTreeLocationContribution
  implements CommandContribution, KeybindingContribution
{
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(OpenChangeFilesService)
  private readonly openChangeFilesService: OpenChangeFilesService;

  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      {
        id: GOTO_PREVIOUS_CHANGE,
      },
      {
        execute: (channel: 'editor-bottom-side' | 'keybinding' = 'keybinding') => {
          this.goToDiffEditor('previous', channel);
        },
      }
    );

    commands.registerCommand(
      {
        id: GOTO_NEXT_CHANGE,
      },
      {
        execute: (channel: 'editor-bottom-side' | 'keybinding' = 'keybinding') => {
          this.goToDiffEditor('next', channel);
        },
      }
    );
  }

  registerKeybindings(keybindings: KeybindingRegistry): void {
    keybindings.registerKeybinding({
      command: GOTO_PREVIOUS_CHANGE,
      keybinding: 'alt+up',
    });

    keybindings.registerKeybinding({
      command: GOTO_NEXT_CHANGE,
      keybinding: 'alt+down',
    });

    // 全屏模式下直接用 上下键 快速切换文件
    // 为了避免影响编辑器内部的 上下键移动鼠标，因此设置为非 editorFocus 下可上下键快速切换
    keybindings.registerKeybinding({
      command: GOTO_PREVIOUS_CHANGE,
      keybinding: 'up',
      when: `${ACR_IS_FULLSCREEN.raw} && !editorFocus`,
    });

    keybindings.registerKeybinding({
      command: GOTO_NEXT_CHANGE,
      keybinding: 'down',
      when: `${ACR_IS_FULLSCREEN.raw} && !editorFocus`,
    });
  }

  private getNewPathByResource(resource: IResource) {
    return resource.uri.getParsedQuery().newPath;
  }

  private goToDiffEditor(type: 'next' | 'previous', channel: 'editor-bottom-side' | 'keybinding') {
    const pullRequestChangeList = this.antcodeService.pullRequestChangeList;
    const resource = this.workbenchEditorService.currentResource;
    if (!resource) {
      return;
    }
    const newPath = this.getNewPathByResource(resource);
    if (!newPath) {
      return;
    }
    const currentIndex = pullRequestChangeList.findIndex((change) => change.newPath === newPath);
    let index = 0;
    if (type === 'previous') {
      index = currentIndex - 1 < 0 ? pullRequestChangeList.length - 1 : currentIndex - 1;
    } else {
      index = currentIndex >= pullRequestChangeList.length - 1 ? 0 : currentIndex + 1;
    }
    const change = pullRequestChangeList[index];
    this.openChangeFilesService.openFile(change, channel);
  }
}
