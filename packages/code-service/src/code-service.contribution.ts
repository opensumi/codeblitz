import { Autowired } from '@ali/common-di';
import { FILE_COMMANDS, ClientAppContribution } from '@ali/ide-core-browser';
import {
  Domain,
  Disposable,
  IReporterService,
  IDisposable,
  Deferred,
  getDebugLogger,
  URI,
  CommandService,
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
import { BrowserEditorContribution, WorkbenchEditorService } from '@ali/ide-editor/lib/browser';
import * as path from 'path';
import configureFileSystem from './filesystem/configure';
import { CodeModelService } from './code-model.service';
import { MainLayoutContribution } from '@ali/ide-main-layout';

@Domain(
  LaunchContribution,
  BrowserEditorContribution,
  ClientAppContribution,
  MainLayoutContribution
)
export class CodeContribution
  extends Disposable
  implements
    LaunchContribution,
    BrowserEditorContribution,
    ClientAppContribution,
    MainLayoutContribution {
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

  private _mountDisposer: IDisposable | null;

  private _mounting = false;

  async launch({ rootFS }: IServerApp) {
    const codeConfig = this.runtimeConfig?.codeService;
    if (!codeConfig) return;

    let initDeferred: Deferred<void> | null = new Deferred();
    this.codeModel.onDidChangeHEAD(() => {
      this.mountFilesystem(rootFS).then(() => {
        if (initDeferred) {
          initDeferred.resolve();
        } else {
          this.commandService.tryExecuteCommand(FILE_COMMANDS.REFRESH_ALL.id);
          this.fileTree.refresh();
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

      this._mountDisposer?.dispose();

      rootFS.mount(workspaceDir, overlayFileSystem);
      // 将只读文件系统挂载到 /code 上
      rootFS.mount(CODE_ROOT, codeFileSystem);
      // 将可写文件系统挂载到 /idb
      rootFS.mount(IDB_ROOT, idbFileSystem);

      this._mountDisposer = this.addDispose({
        dispose: () => {
          rootFS.umount(workspaceDir);
          rootFS.umount(CODE_ROOT);
          rootFS.umount(IDB_ROOT);
        },
      });
    } catch (err) {
      getDebugLogger().error('mount filesystem error', err);
    } finally {
      this._mounting = false;
    }
  }

  onDidRestoreState() {
    const { revealEntry } = this.codeModel;
    if (revealEntry.filepath) {
      const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath));
      if (revealEntry.type === 'blob') {
        this.editorService.open(uri, {
          preview: false,
          deletedPolicy: 'fail',
        });
      } else if (revealEntry.type === 'tree') {
        this.fileTreeModel.whenReady.then(() => {
          const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath));
          this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
        });
      }
    }
  }

  onDidStart() {
    // (window as any).a = () => {
    //   const { revealEntry } = this.codeModel
    //   if (revealEntry.filepath && revealEntry.type === 'tree') {
    //     const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath))
    //     this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
    //   }
    // }
  }

  onDidRender() {
    // const { revealEntry } = this.codeModel
    // if (revealEntry.filepath && revealEntry.type === 'tree') {
    //   const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath))
    //   this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
    // }
  }
}
