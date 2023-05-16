import { Autowired } from '@opensumi/di';
import { Domain, CommandRegistry, URI, Command } from '@opensumi/ide-core-common';
import {
  CommandContribution,
  KeybindingContribution,
  KeybindingRegistry,
  ClientAppContribution,
  QUICK_OPEN_COMMANDS,
  EDITOR_COMMANDS
} from '@opensumi/ide-core-browser';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { AppConfig, RuntimeConfig, WORKSPACE_ROOT } from '@alipay/alex-core';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser';
import { EditorDocumentModelServiceImpl } from '@opensumi/ide-editor/lib/browser/doc-model/editor-document-model-service';
import { MenuId, MenuContribution, IMenuRegistry } from '@opensumi/ide-core-browser/lib/menu/next';

import * as path from 'path';

const TOGGLE_CHANGE_VIEWED = 'commands.markAsRead';

export namespace SQL_COMMANDS {
  export const GET_CURRENT_EDITOR: Command = {
    id: 'alex.sql.editor',
  };
  export const OPEN_FILE: Command = {
    id: 'alex.sql.open',
  };
  export const ENCODING: Command = {
    id: 'alex.sql.encoding',
  };
}
@Domain(CommandContribution, KeybindingContribution, MenuContribution)
export class SQLKeybindContribution implements CommandContribution, KeybindingContribution, MenuContribution {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  @Autowired(IEditorDocumentModelService)
  modelService: EditorDocumentModelServiceImpl;

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SQL_COMMANDS.GET_CURRENT_EDITOR, {
      execute: () => {
        return this.workbenchEditorService.currentEditor;
      },
    });

    commands.registerCommand(SQL_COMMANDS.OPEN_FILE, {
      execute: (filepath: string, defaultContent?: string) => {
        const { workspaceDir } = this.appConfig;
        const uri = URI.file(path.join(workspaceDir, filepath));
        this.fileService.access(uri.toString()).then((res) => {
          if (!res) {
            this.fileService
              .createFile(uri.toString(), {
                content: defaultContent,
              })
              .then(() => {
                this.workbenchEditorService.open(uri);
              });
          } else {
            this.workbenchEditorService.open(uri);
          }
        });
      },
    });
  }

  registerKeybindings(keybindings: KeybindingRegistry) {
    const keybindingList = [
      'ctrlcmd+,',
      'ctrlcmd+shift+p',
      'ctrlcmd+p',
      'F1',
      'alt+n',
      'alt+shift+t',
      'alt+shift+w',
      'ctrlcmd+\\',
      'ctrlcmd+o',
    ];
    for (let i = 1; i < 10; i++) {
      keybindingList.push(`ctrlcmd+${i}`);
    }

    keybindingList.forEach((binding) => {
      keybindings.unregisterKeybinding(binding);
    });
  }
  registerMenus(menus: IMenuRegistry): void {
    // menus.unregisterMenuItem(MenuId.EditorContext, QUICK_OPEN_COMMANDS.OPEN.id);
    // menus.unregisterMenuItem(MenuId.EditorContext, EDITOR_COMMANDS.FORMAT_DOCUMENT_WITH.id);
    // menus.unregisterMenuItem(MenuId.EditorContext, 'editor.action.revealDefinition');
    // menus.unregisterMenuItem(MenuId.EditorContext, 'EditorContextPeek');
    // menus.unregisterMenuItem(MenuId.EditorContext, 'editor.action.changeAll');
    menus.unregisterMenuId(MenuId.EditorContext)
  }
}
