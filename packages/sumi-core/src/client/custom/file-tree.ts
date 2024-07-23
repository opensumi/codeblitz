import { Autowired } from '@opensumi/di';
import {
  AppConfig,
  Command,
  CommandContribution,
  CommandRegistry,
  ComponentRegistryInfo,
  FILE_COMMANDS,
  KeybindingContribution,
  KeybindingRegistry,
  SlotRendererContribution,
  SlotRendererRegistry,
  useInjectable,
} from '@opensumi/ide-core-browser';
import {
  FilesExplorerFocusedContext,
  FilesExplorerInputFocusedContext,
} from '@opensumi/ide-core-browser/lib/contextkey/explorer';
import { FilesExplorerFilteredContext } from '@opensumi/ide-core-browser/lib/contextkey/explorer';
import {
  ExplorerContextCallback,
  IMenuRegistry,
  MenuContribution,
  MenuId,
} from '@opensumi/ide-core-browser/lib/menu/next';
import { Domain, IClipboardService, localize, Throttler, URI } from '@opensumi/ide-core-common';
import { WorkbenchEditorService } from '@opensumi/ide-editor/lib/browser';
import { IFileTreeService, PasteTypes } from '@opensumi/ide-file-tree-next';
import { FileTreeService } from '@opensumi/ide-file-tree-next/lib/browser/file-tree.service';
import { FileTreeModelService } from '@opensumi/ide-file-tree-next/lib/browser/services/file-tree-model.service';
import { Directory } from '@opensumi/ide-file-tree-next/lib/common/file-tree-node.define';
import { LeftTabPanelRenderer } from '@opensumi/ide-main-layout/lib/browser/tabbar/panel.view';
import { TabRendererBase } from '@opensumi/ide-main-layout/lib/browser/tabbar/renderer.view';
import { TabbarService, TabbarServiceFactory } from '@opensumi/ide-main-layout/lib/browser/tabbar/tabbar.service';
import React from 'react';
import { RuntimeConfig } from '../../common/types';

/**
 * TODO SCM 完善文件系统
 * 禁用掉文件树的新增、删除、重命名等操作，用于纯编辑场景
 */
@Domain(MenuContribution, CommandContribution, KeybindingContribution, SlotRendererContribution)
export class FileTreeCustomContribution
  implements MenuContribution, CommandContribution, KeybindingContribution, SlotRendererContribution
{
  @Autowired(WorkbenchEditorService)
  workbenchEditorService: WorkbenchEditorService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(FileTreeModelService)
  private readonly fileTreeModelService: FileTreeModelService;

  @Autowired(IFileTreeService)
  private readonly fileTreeService: FileTreeService;

  @Autowired(IClipboardService)
  private readonly clipboardService: IClipboardService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  private willDeleteUris: URI[] = [];
  private deleteThrottler: Throttler = new Throttler();

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

    const isContextMenuFile = () => {
      return (
        !!this.fileTreeModelService.contextMenuFile
        && !this.fileTreeModelService.contextMenuFile.uri.isEqual(
          (this.fileTreeModelService.treeModel.root as Directory).uri,
        )
        && !Directory.is(this.fileTreeModelService.contextMenuFile)
      );
    };

    const isFocusedFile = () => {
      return (
        !!this.fileTreeModelService.focusedFile
        && !this.fileTreeModelService.focusedFile.uri.isEqual(
          (this.fileTreeModelService.treeModel.root as Directory).uri,
        )
        && !Directory.is(this.fileTreeModelService.focusedFile)
      );
    };

    // SCM 禁用文件夹层级的删除重命名复制粘贴等功能
    if (this.runtimeConfig.scmFileTree) {
      SCMFileCommand.forEach((cmd) => {
        commands.unregisterCommand(cmd.id);
      });
      const exitFilterMode = () => {
        if (this.fileTreeService.filterMode) {
          this.fileTreeService.toggleFilterMode();
        }
      };
      commands.registerCommand<ExplorerContextCallback>(FILE_COMMANDS.RENAME_FILE, {
        execute: (uri) => {
          exitFilterMode();
          if (!uri) {
            if (this.fileTreeModelService.contextMenuFile) {
              uri = this.fileTreeModelService.contextMenuFile.uri;
            } else if (this.fileTreeModelService.focusedFile) {
              uri = this.fileTreeModelService.focusedFile.uri;
            } else {
              return;
            }
          }
          this.fileTreeModelService.renamePrompt(uri);
        },
        isEnabled: () => !Directory.is(this.fileTreeModelService.contextMenuFile),
        isVisible: () => isContextMenuFile(),
      });

      commands.registerCommand<ExplorerContextCallback>(FILE_COMMANDS.DELETE_FILE, {
        execute: (_, uris) => {
          exitFilterMode();
          if (!uris) {
            if (this.fileTreeModelService.focusedFile) {
              this.willDeleteUris.push(this.fileTreeModelService.focusedFile.uri);
            } else if (
              this.fileTreeModelService.selectedFiles
              && this.fileTreeModelService.selectedFiles.length > 0
            ) {
              this.willDeleteUris = this.willDeleteUris.concat(
                this.fileTreeModelService.selectedFiles.map((file) => file.uri),
              );
            } else {
              return;
            }
          } else {
            this.willDeleteUris = this.willDeleteUris.concat(uris);
          }
          return this.deleteThrottler.queue<void>(this.doDelete.bind(this));
        },
        isEnabled: () => !Directory.is(this.fileTreeModelService.contextMenuFile),
        isVisible: () => isContextMenuFile(),
      });

      commands.registerCommand<ExplorerContextCallback>(FILE_COMMANDS.COPY_FILE, {
        execute: (_, uris) => {
          if (uris && uris.length) {
            this.fileTreeModelService.copyFile(uris);
          } else {
            const selectedUris = this.fileTreeModelService.selectedFiles.map((file) => file.uri);
            if (selectedUris && selectedUris.length) {
              this.fileTreeModelService.copyFile(selectedUris);
            }
          }
        },
        isEnabled: () => !Directory.is(this.fileTreeModelService.contextMenuFile),
        isVisible: () => isContextMenuFile() || isFocusedFile(),
      });

      commands.registerCommand<ExplorerContextCallback>(FILE_COMMANDS.CUT_FILE, {
        execute: (_, uris) => {
          if (uris && uris.length) {
            this.fileTreeModelService.cutFile(uris);
          } else {
            const selectedUris = this.fileTreeModelService.selectedFiles.map((file) => file.uri);
            if (selectedUris && selectedUris.length) {
              this.fileTreeModelService.cutFile(selectedUris);
            }
          }
        },
        isEnabled: () => !Directory.is(this.fileTreeModelService.contextMenuFile),
        isVisible: () => isContextMenuFile() || isFocusedFile(),
      });

      commands.registerCommand<ExplorerContextCallback>(FILE_COMMANDS.PASTE_FILE, {
        execute: (uri) => {
          exitFilterMode();
          if (uri) {
            this.fileTreeModelService.pasteFile(uri);
          } else if (this.fileTreeModelService.focusedFile) {
            let uri;
            if (this.fileTreeModelService.activeUri) {
              uri = this.fileTreeModelService.activeUri;
            } else {
              uri = this.fileTreeModelService.focusedFile.uri;
            }
            this.fileTreeModelService.pasteFile(uri);
          }
        },
        isVisible: () => !Directory.is(this.fileTreeModelService.contextMenuFile),
        isEnabled: () =>
          (this.fileTreeModelService.pasteStore
            && this.fileTreeModelService.pasteStore.type !== PasteTypes.NONE)
          || !!this.clipboardService.hasResources(),
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
    if (!this.runtimeConfig.disableModifyFileTree && !this.runtimeConfig.scmFileTree) return;

    const keybinding = [
      {
        command: FILE_COMMANDS.COPY_FILE.id,
        keybinding: 'ctrlcmd+c',
        when:
          `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
      },
      {
        command: FILE_COMMANDS.PASTE_FILE.id,
        keybinding: 'ctrlcmd+v',
        when:
          `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
      },
      {
        command: FILE_COMMANDS.CUT_FILE.id,
        keybinding: 'ctrlcmd+x',
        when:
          `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
      },
      {
        command: FILE_COMMANDS.RENAME_FILE.id,
        keybinding: 'enter',
        when:
          `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
      },
      {
        command: FILE_COMMANDS.DELETE_FILE.id,
        keybinding: 'ctrlcmd+backspace',
        when:
          `${FilesExplorerFocusedContext.raw} && !${FilesExplorerInputFocusedContext.raw} && !${FilesExplorerFilteredContext.raw}`,
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
      tabbarService.updateBarSize(0);
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

  private doDelete() {
    const uris = this.willDeleteUris.slice();
    this.willDeleteUris = [];
    return this.fileTreeModelService.deleteFileByUris(uris);
  }
}
