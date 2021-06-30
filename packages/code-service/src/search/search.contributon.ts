import { Domain } from '@ali/ide-core-common';
import { SEARCH_COMMANDS, CommandContribution, CommandRegistry } from '@ali/ide-core-browser';
import {
  MenuId,
  MenuContribution,
  IMenuRegistry,
  IMenuItem,
} from '@ali/ide-core-browser/lib/menu/next';
import './style.module.less';

@Domain(MenuContribution, CommandContribution)
export class SearchContribution implements MenuContribution, CommandContribution {
  registerMenus(registry: IMenuRegistry) {
    const searchItems = registry.getMenuItems(MenuId.SearchContext);
    searchItems.forEach((item: IMenuItem) => {
      if (
        item.command === SEARCH_COMMANDS.MENU_REPLACE.id ||
        item.command === SEARCH_COMMANDS.MENU_REPLACE_ALL.id
      ) {
        item.when = 'false';
      }
    });
  }

  registerCommands(registry: CommandRegistry) {
    registry.unregisterCommand(SEARCH_COMMANDS.MENU_REPLACE.id);
    registry.unregisterCommand(SEARCH_COMMANDS.MENU_REPLACE_ALL.id);
  }
}
