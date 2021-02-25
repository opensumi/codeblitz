import { Autowired } from '@ali/common-di';
import { FILE_COMMANDS, CommandContribution, CommandRegistry } from '@ali/ide-core-browser';
import {
  Domain,
  IReporterService,
  Deferred,
  getDebugLogger,
  URI,
  CommandService,
  localize,
  formatLocalize,
  FileChangeType,
  WithEventBus,
  OnEvent,
} from '@ali/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  makeWorkspaceDir,
  CODE_ROOT,
  IDB_ROOT,
  IServerApp,
  RuntimeConfig,
  RootFS,
} from '@alipay/alex-core';
import { IFileTreeService } from '@ali/ide-file-tree-next';
import { FileTreeService } from '@ali/ide-file-tree-next/lib/browser/file-tree.service';
import { FileTreeModelService } from '@ali/ide-file-tree-next/lib/browser/services/file-tree-model.service';
import { IMessageService } from '@ali/ide-overlay';
import {
  BrowserEditorContribution,
  WorkbenchEditorService,
  EditorGroupChangeEvent,
} from '@ali/ide-editor/lib/browser';
import * as path from 'path';
import { QuickPickService } from '@ali/ide-quick-open';
import { IDiskFileProvider, FileAccess } from '@ali/ide-file-service';
import { DiskFsProviderClient } from '@ali/ide-file-service/lib/browser/file-service-provider-client';
import configureFileSystem from './filesystem/configure';
import { CodeModelService } from './code-model.service';
import { RefType } from './types';

@Domain(LaunchContribution, BrowserEditorContribution, CommandContribution)
export class CodeContribution
  extends WithEventBus
  implements LaunchContribution, BrowserEditorContribution, CommandContribution {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IFileTreeService)
  fileTree: FileTreeService;

  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  @Autowired(CommandService)
  commandService: CommandService;

  @Autowired(FileTreeModelService)
  fileTreeModel: FileTreeModelService;

  @Autowired(QuickPickService)
  protected quickPickService: QuickPickService;

  @Autowired(IDiskFileProvider)
  diskFile: DiskFsProviderClient;

  private _unmount: () => void | undefined;

  private _mounting = false;

  async launch({ rootFS }: IServerApp) {
    const codeConfig = this.runtimeConfig?.codeService;
    if (!codeConfig) return;

    this.codeModel.onDidChangeRefPath((path) => {
      console.log('>>>>>>>path', path);
    });

    let initDeferred: Deferred<void> | null = new Deferred();
    this.codeModel.onDidChangeHEAD(() => {
      this.mountFilesystem(rootFS).then(() => {
        if (initDeferred) {
          initDeferred.resolve();
        } else {
          this.commandService.tryExecuteCommand(FILE_COMMANDS.REFRESH_ALL.id);
          this.fileTree.refresh();
          Promise.all(
            this.editorService.getAllOpenedUris().map(async (uri) => {
              const change = {
                uri: uri.toString(),
                type: (await this.diskFile.access(uri.codeUri, FileAccess.Constants.F_OK))
                  ? FileChangeType.UPDATED
                  : FileChangeType.DELETED,
              };
              return change;
            })
          ).then((changes) => {
            this.diskFile.onDidFilesChanged({ changes });
          });
        }
      });
    });

    this.codeModel.initialize(codeConfig);
    // 首次初始化成功等待文件系统挂载，可恢复工作空间最近打开的文件
    await this.codeModel.initialized;
    if (this.codeModel.headState.isResolved) {
      await initDeferred.promise;
    }
    initDeferred = null;
  }

  async mountFilesystem(rootFS: RootFS) {
    if (this._mounting) return;
    this._mounting = true;

    try {
      const workspaceDir = makeWorkspaceDir(`${this.codeModel.platform}/${this.codeModel.project}`);
      this.appConfig.workspaceDir = workspaceDir;

      const { codeFileSystem, idbFileSystem, overlayFileSystem } = await configureFileSystem(
        this.codeModel,
        this.runtimeConfig.scenario
      );

      this._unmount?.();

      rootFS.mount(workspaceDir, overlayFileSystem);
      // 将只读文件系统挂载到 /code 上
      rootFS.mount(CODE_ROOT, codeFileSystem);
      // 将可写文件系统挂载到 /idb
      rootFS.mount(IDB_ROOT, idbFileSystem);

      this._unmount = () => {
        rootFS.umount(workspaceDir);
        rootFS.umount(CODE_ROOT);
        rootFS.umount(IDB_ROOT);
      };
    } catch (err) {
      getDebugLogger().error(`[mount filesystem error]: ${err?.message || ''}`, err);
    } finally {
      this._mounting = false;
    }
  }

  onDidRestoreState() {
    const { revealEntry } = this.codeModel;
    if (!revealEntry?.filepath) return;
    const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath));
    if (revealEntry.type === 'blob') {
      this.editorService.open(uri, {
        preview: false,
        deletedPolicy: 'fail',
      });
    } else if (revealEntry.type === 'tree') {
      this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
    }
  }

  registerCommands(commandRegistry: CommandRegistry) {
    commandRegistry.registerCommand(
      {
        category: 'Code Service',
        label: localize('code-service.command.checkout'),
        id: 'code-service.checkout',
      },
      {
        execute: async () => {
          await this.codeModel.refsInitialized;
          const getShortCommit = (commit: string) => (commit || '').substr(0, 8);
          const refs = [...this.codeModel.refs.branches, ...this.codeModel.refs.tags];
          const value = await this.quickPickService.show(
            refs.map((ref, index) => ({
              value: index,
              label: ref.name,
              description: `${ref.type === RefType.Tag ? 'Tag at ' : ''}${getShortCommit(
                ref.commit
              )}`,
            })),
            {
              placeholder: localize('code-service.select-ref-to-checkout'),
            }
          );
          if (typeof value === 'number') {
            const target = refs[value];
            if (target.commit === this.codeModel.HEAD) {
              this.messageService.warning(localize('code-service.checkout-to-same'));
              return;
            }
            this.messageService.info(formatLocalize('code-service.checkout-to', target.name));
            this.codeModel.refName = target.name;
            this.codeModel.HEAD = target.commit;
          }
        },
      }
    );
  }

  @OnEvent(EditorGroupChangeEvent)
  onEditorGroupChangeEvent({ payload: { newOpenType, newResource } }: EditorGroupChangeEvent) {
    if (newOpenType?.type === 'code' && newResource && !newResource.deleted) {
      const fsPath = newResource.uri.codeUri.path;
      if (fsPath.startsWith(this.appConfig.workspaceDir)) {
        this.codeModel.revealEntry = {
          type: 'blob',
          filepath: path.relative(this.appConfig.workspaceDir, fsPath),
        };
        return;
      }
    }
    this.codeModel.revealEntry = { type: 'tree', filepath: '' };
  }

  dispose() {
    this._unmount?.();
  }
}
