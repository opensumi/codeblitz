import React from 'react';
import { Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import {
  CommandContribution,
  KeybindingContribution,
  FILE_COMMANDS,
  CommandRegistry,
  KeybindingRegistry,
  Command,
  AppConfig,
  SlotRendererContribution,
  SlotRendererRegistry,
  ComponentRegistryInfo,
  useInjectable,
} from '@ali/ide-core-browser';
import {
  MenuContribution,
  IMenuRegistry,
  MenuId,
  IMenuItem,
} from '@ali/ide-core-browser/lib/menu/next';
import { WorkbenchEditorService } from '@ali/ide-editor/lib/browser';
import { TabRendererBase } from '@ali/ide-main-layout/lib/browser/tabbar/renderer.view';
import { LeftTabPanelRenderer } from '@ali/ide-main-layout/lib/browser/tabbar/panel.view';
import {
  TabbarServiceFactory,
  TabbarService,
} from '@ali/ide-main-layout/lib/browser/tabbar/tabbar.service';
import { RuntimeConfig } from '../../common/types';

/**
 * 禁用掉文件树的新增、删除、重命名等操作，用于纯编辑场景
 */
@Domain(MenuContribution, CommandContribution, KeybindingContribution, SlotRendererContribution)
export class FileTreeCustomContribution
  implements
    MenuContribution,
    CommandContribution,
    KeybindingContribution,
    SlotRendererContribution {
  @Autowired(WorkbenchEditorService)
  workbenchEditorService: WorkbenchEditorService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  registerMenus(menuRegistry: IMenuRegistry) {
    if (this.runtimeConfig.unregisterActivityBarExtra) {
      menuRegistry.unregisterMenuId(MenuId.ActivityBarExtra);
    }

    if (!this.runtimeConfig.disableModifyFileTree) return;

    const isDisabled = (commads: Command[], command: Command | string) => {
      return commads.some((cmd) => {
        const cmdId = typeof command === 'string' ? command : command.id;
        return cmd.id === cmdId;
      });
    };

    const viewTitleCommand = [
      FILE_COMMANDS.NEW_FILE,
      FILE_COMMANDS.NEW_FOLDER,
      FILE_COMMANDS.RENAME_FILE,
      FILE_COMMANDS.DELETE_FILE,
    ];
    const viewTitle = menuRegistry.getMenuItems(MenuId.ViewTitle);
    viewTitle.forEach((item: IMenuItem) => {
      if (isDisabled(viewTitleCommand, item.command)) {
        item.when = 'false';
      }
    });

    const exploreCommand = [
      ...viewTitleCommand,
      FILE_COMMANDS.CUT_FILE,
      FILE_COMMANDS.COPY_FILE,
      FILE_COMMANDS.PASTE_FILE,
    ];
    const exploreItems = menuRegistry.getMenuItems(MenuId.ExplorerContext);
    exploreItems.forEach((item: IMenuItem) => {
      if (isDisabled(exploreCommand, item.command)) {
        item.when = 'false';
      }
    });
  }

  registerCommands(commands: CommandRegistry) {
    if (!this.runtimeConfig.disableModifyFileTree) return;

    const fileCommand = [
      FILE_COMMANDS.NEW_FILE,
      FILE_COMMANDS.NEW_FOLDER,
      FILE_COMMANDS.RENAME_FILE,
      FILE_COMMANDS.DELETE_FILE,
    ];
    fileCommand.forEach((cmd) => {
      commands.unregisterCommand(cmd.id);
    });
  }

  registerKeybindings(bindings: KeybindingRegistry) {
    if (!this.runtimeConfig.disableModifyFileTree) return;

    const keybinding = [
      {
        command: FILE_COMMANDS.COPY_FILE.id,
        keybinding: 'ctrlcmd+c',
        when: 'filesExplorerFocus && !inputFocus',
      },
      {
        command: FILE_COMMANDS.PASTE_FILE.id,
        keybinding: 'ctrlcmd+v',
        when: 'filesExplorerFocus && !inputFocus',
      },
      {
        command: FILE_COMMANDS.CUT_FILE.id,
        keybinding: 'ctrlcmd+x',
        when: 'filesExplorerFocus && !inputFocus',
      },
      {
        command: FILE_COMMANDS.RENAME_FILE.id,
        keybinding: 'enter',
        when: 'filesExplorerFocus && !inputFocus',
      },
      {
        command: FILE_COMMANDS.DELETE_FILE.id,
        keybinding: 'ctrlcmd+backspace',
        when: 'filesExplorerFocus && !inputFocus',
      },
    ];
    keybinding.forEach((binding) => {
      bindings.unregisterKeybinding(binding);
    });
  }

  registerRenderer(registry: SlotRendererRegistry) {
    if (!this.runtimeConfig.hideLeftTabBar) return;

    const EmptyLeftTabbarRenderer: React.FC = () => {
      const tabbarService: TabbarService = useInjectable(TabbarServiceFactory)('left');
      tabbarService.barSize = 0;
      return React.createElement('div', { style: { width: 0 } });
    };

    const LeftTabRenderer = ({
      className,
      components,
    }: {
      className: string;
      components: ComponentRegistryInfo[];
    }) =>
      React.createElement(TabRendererBase, {
        side: 'left',
        direction: 'left-to-right',
        className: `${className} left-slot`,
        components,
        TabbarView: EmptyLeftTabbarRenderer,
        TabpanelView: LeftTabPanelRenderer,
      });
    registry.registerSlotRenderer('left', LeftTabRenderer);
  }
}
