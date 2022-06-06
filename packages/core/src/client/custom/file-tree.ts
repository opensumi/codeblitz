import React from 'react';
import { Autowired } from '@opensumi/di';
import { Domain } from '@opensumi/ide-core-common';
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
} from '@opensumi/ide-core-browser';
import { MenuContribution, IMenuRegistry, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { WorkbenchEditorService } from '@opensumi/ide-editor/lib/browser';
import { TabRendererBase } from '@opensumi/ide-main-layout/lib/browser/tabbar/renderer.view';
import { LeftTabPanelRenderer } from '@opensumi/ide-main-layout/lib/browser/tabbar/panel.view';
import {
  TabbarServiceFactory,
  TabbarService,
} from '@opensumi/ide-main-layout/lib/browser/tabbar/tabbar.service';
import { RuntimeConfig } from '../../common/types';

/**
 * TODO SCM 完善文件系统
 * 禁用掉文件树的新增、删除、重命名等操作，用于纯编辑场景
 */
@Domain(MenuContribution, CommandContribution, KeybindingContribution, SlotRendererContribution)
export class FileTreeCustomContribution
  implements
    MenuContribution,
    CommandContribution,
    KeybindingContribution,
    SlotRendererContribution
{
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
  }

  registerCommands(commands: CommandRegistry) {
    const SCMFileCommand = [
      FILE_COMMANDS.RENAME_FILE,
      FILE_COMMANDS.DELETE_FILE,
      FILE_COMMANDS.COPY_FILE,
      FILE_COMMANDS.PASTE_FILE,
      FILE_COMMANDS.CUT_FILE,
    ];

    if (this.runtimeConfig.scmFileTree) {
      SCMFileCommand.forEach((cmd) => {
        commands.unregisterCommand(cmd.id);
        commands.registerCommand({ id: cmd.id });
      });
    }
    if (!this.runtimeConfig.disableModifyFileTree) return;

    const fileCommand = [FILE_COMMANDS.NEW_FILE, FILE_COMMANDS.NEW_FOLDER, ...SCMFileCommand];
    fileCommand.forEach((cmd) => {
      commands.unregisterCommand(cmd.id);
      commands.registerCommand({ id: cmd.id });
    });
  }

  registerKeybindings(bindings: KeybindingRegistry) {
    if (!this.runtimeConfig.disableModifyFileTree || !this.runtimeConfig.scmFileTree) return;

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
