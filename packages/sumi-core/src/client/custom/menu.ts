import { Injectable } from '@opensumi/di';
import { Domain } from '@opensumi/ide-core-browser';
import { IMenuRegistry, MenuContribution, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';

@Domain(MenuContribution)
export class MenuConfigContribution implements MenuContribution {
  registerMenus(menuRegistry: IMenuRegistry) {
    menuRegistry.removeMenubarItem(MenuId.MenubarHelpMenu);
    menuRegistry.removeMenubarItem(MenuId.MenubarTerminalMenu);
  }
}
