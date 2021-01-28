import { Injectable } from '@ali/common-di';
import { Domain } from '@ali/ide-core-browser';
import { MenuContribution, IMenuRegistry, MenuId } from '@ali/ide-core-browser/lib/menu/next';

@Domain(MenuContribution)
export class MenuConfigContribution implements MenuContribution {
  registerMenus(menuRegistry: IMenuRegistry) {
    menuRegistry.removeMenubarItem(MenuId.MenubarHelpMenu);
  }
}
