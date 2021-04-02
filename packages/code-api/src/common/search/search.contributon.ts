import { Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import {
  ComponentContribution,
  ComponentRegistry,
  SEARCH_COMMANDS,
  CommandContribution,
  CommandRegistry,
} from '@ali/ide-core-browser';
import {
  MenuId,
  MenuContribution,
  IMenuRegistry,
  IMenuItem,
} from '@ali/ide-core-browser/lib/menu/next';

import { Search } from './search.view';

@Domain(ComponentContribution, MenuContribution, CommandContribution)
export class SearchContribution
  implements ComponentContribution, MenuContribution, CommandContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.getComponentRegistryInfo('@ali/ide-search')?.views.some((view) => {
      if (view.id === 'ide-search') {
        view.component = Search;
        return true;
      }
    });
  }

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
