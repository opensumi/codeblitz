import { Autowired } from '@opensumi/di';
import {
  Domain,
  CommandRegistry,
  CommandContribution,
  KeybindingContribution,
  KeybindingRegistry,
  PrefixQuickOpenService,
} from '@opensumi/ide-core-browser';
import {
  QuickOpenContribution,
  QuickOpenHandlerRegistry,
} from '@opensumi/ide-quick-open/lib/browser/prefix-quick-open.service';

import { QuickChangeFileHandler } from './change-file.quick-open';
import { RootElementId } from '../constant';

const QUICK_OPEN_OPEN_DIFF_FILES = 'commands.quick-open.change-files';

@Domain(CommandContribution, KeybindingContribution, QuickOpenContribution)
export class QuickChangeFileContribution
  implements CommandContribution, KeybindingContribution, QuickOpenContribution
{
  @Autowired()
  private readonly quickChangeFileHandler: QuickChangeFileHandler;

  @Autowired(PrefixQuickOpenService)
  private readonly prefixQuickOpenService: PrefixQuickOpenService;

  registerQuickOpenHandlers(handlers: QuickOpenHandlerRegistry): void {
    handlers.registerHandler(this.quickChangeFileHandler);
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      {
        id: QUICK_OPEN_OPEN_DIFF_FILES,
        label: '%commands.quick-open.change-files%',
      },
      {
        execute: () => this.openChangeFile(),
      }
    );
  }

  private async openChangeFile() {
    // 页面不在视图则不展示
    const ideContainer = document.getElementById(RootElementId);
    if (!ideContainer) {
      return;
    }

    // 因为执行 editor context 编辑器会默认获取焦点导致打开的 quickopen 又被隐藏，所以加一个 requestAnimationFrame 下次绘制时执行
    window.requestAnimationFrame(() => this.prefixQuickOpenService.open(''));
  }

  registerKeybindings(keybindings: KeybindingRegistry): void {
    keybindings.registerKeybinding({
      command: QUICK_OPEN_OPEN_DIFF_FILES,
      keybinding: 'ctrl+alt+p',
    });
  }
}
