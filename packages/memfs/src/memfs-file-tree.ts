import { Autowired } from '@ali/common-di';
import { Domain, URI, Uri } from '@ali/ide-core-common';
import {
  CommandContribution,
  KeybindingContribution,
  FILE_COMMANDS,
  CommandRegistry,
  KeybindingRegistry,
  Command,
  ClientAppContribution,
  AppConfig,
} from '@ali/ide-core-browser';
import {
  NextMenuContribution,
  IMenuRegistry,
  MenuId,
  IMenuItem,
} from '@ali/ide-core-browser/lib/menu/next';
import { IMainLayoutService } from '@ali/ide-main-layout/lib/common';
import { WorkbenchEditorService, BrowserEditorContribution } from '@ali/ide-editor/lib/browser';
import { ExplorerOpenedEditorViewId } from '@ali/ide-opened-editor/lib/browser/opened-editor.contribution';
import { RuntimeConfig, FileIndex } from '@alipay/alex-core';
import * as paths from 'path';
import { walkFileIndex } from './util';

@Domain(
  ClientAppContribution,
  NextMenuContribution,
  CommandContribution,
  KeybindingContribution,
  BrowserEditorContribution
)
export class MemFileTreeContribution
  implements
    ClientAppContribution,
    NextMenuContribution,
    CommandContribution,
    KeybindingContribution,
    BrowserEditorContribution {
  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  @Autowired(WorkbenchEditorService)
  workbenchEditorService: WorkbenchEditorService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  registerNextMenus(menuRegistry: IMenuRegistry) {
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
    [
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
    ].forEach((binding) => {
      bindings.unregisterKeybinding(binding);
    });
  }

  onStart() {
    this.mainLayoutService.disposeViewComponent(ExplorerOpenedEditorViewId);
  }

  async onDidRestoreState() {
    const { defaultOpenFile } = this.runtimeConfig?.memfs || {};
    if (defaultOpenFile) {
      const uri = URI.file(paths.join(this.appConfig.workspaceDir, defaultOpenFile));
      this.workbenchEditorService.open(uri, {
        preview: false,
        deletedPolicy: 'skip',
      });
    }
    // TODO: 打开所有文件，看需求
    // if (!openAll) return
    // const uriList: URI[] = []
    // let currentUri: URI | null
    // const { workspaceDir } = this.appConfig
    // walkFileIndex(fileIndex, ({ type, path }) => {
    //   if (type === 'file') {
    //     const uri = new URI(Uri.file(paths.join(workspaceDir, path)))
    //     uriList.push(uri)
    //     if (path === focusFile) {
    //       currentUri = uri
    //     }
    //   }
    // })
    // uriList.forEach(uri => {
    //   this.workbenchEditorService.open(uri, {
    //     backend: true,
    //     preview: false,
    //     disableNavigate: true,
    //     deletedPolicy: 'skip'
    //   })
    // })
    // // @ts-ignore
    // if (!currentUri) {
    //   currentUri = uriList[0]
    // }
    // if (currentUri) {
    //   this.workbenchEditorService.open(currentUri, {
    //     preview: false,
    //     deletedPolicy: 'skip'
    //   })
    // }
  }
}
