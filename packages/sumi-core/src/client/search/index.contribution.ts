import { Autowired } from '@opensumi/di';
import { CommandContribution, CommandRegistry, SEARCH_COMMANDS } from '@opensumi/ide-core-browser';
import { IMenuItem, IMenuRegistry, MenuContribution, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { Disposable, Domain } from '@opensumi/ide-core-common';

import { RuntimeConfig } from '../../common/types';

@Domain(MenuContribution, CommandContribution)
export class SearchContribution extends Disposable implements MenuContribution, CommandContribution {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  constructor() {
    super();

    const config = this.runtimeConfig.textSearch?.config;
    if (!config) return;

    const selectors: string[] = [];
    if (config.replace === false) {
      selectors.push('[class^="replace_field"]', '.codicon-replace', '.codicon-replace-all');
    }
    if (config.caseSensitive === false) {
      selectors.push('.kticon-ab');
    }
    if (config.wordMatch === false) {
      selectors.push('.kticon-abl');
    }
    if (config.regexp === false) {
      selectors.push('.kticon-regex');
    }

    const rule = selectors.reduce(
      (css, selector) => css + `[data-viewlet-id="search"] ${selector} { display: none !important; }`,
      '',
    );

    const head = document.head || document.getElementsByTagName('head')[0];
    const tag = document.createElement('style');
    tag.setAttribute('alex-style', '');
    tag.appendChild(document.createTextNode(rule));
    head.appendChild(tag);

    this.addDispose({
      dispose: () => {
        head.removeChild(tag);
      },
    });
  }

  registerMenus(registry: IMenuRegistry) {
    if (this.runtimeConfig.textSearch?.config?.replace !== false) {
      return;
    }
    const searchItems = registry.getMenuItems(MenuId.SearchContext);
    searchItems.forEach((item: IMenuItem) => {
      if (
        item.command === SEARCH_COMMANDS.MENU_REPLACE.id
        || item.command === SEARCH_COMMANDS.MENU_REPLACE_ALL.id
      ) {
        item.when = 'false';
      }
    });
  }

  registerCommands(registry: CommandRegistry) {
    if (this.runtimeConfig.textSearch?.config?.replace !== false) {
      return;
    }
    registry.unregisterCommand(SEARCH_COMMANDS.MENU_REPLACE.id);
    registry.unregisterCommand(SEARCH_COMMANDS.MENU_REPLACE_ALL.id);
  }
}
