import { Autowired } from '@ali/common-di';
import { Domain, Disposable, IReporterService, IDisposable } from '@ali/ide-core-common';
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
import { IMessageService } from '@ali/ide-overlay';
import configureFileSystem from './filesystem/configure';
import { CodeModelService } from './code-model.service';

@Domain(LaunchContribution)
export class CodeContribution extends Disposable implements LaunchContribution {
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

  private _mountDisposer: IDisposable | null;

  private _mounting = false;

  async launch({ rootFS }: IServerApp) {
    const codeConfig = this.runtimeConfig?.codeService;
    if (!codeConfig) return;

    this.codeModel.initialize(codeConfig);
    const state = await Promise.race([this.codeModel.isInitialized, this.codeModel.isFailed]);
    if (state === 'Initialized') {
      await this.mountFilesystem(rootFS);
      this.codeModel.onDidChangeHEAD(() => {
        this.mountFilesystem(rootFS);
      });
    }
  }

  async mountFilesystem(rootFS: RootFS) {
    if (this._mounting) return;

    try {
      this._mountDisposer?.dispose();

      const workspaceDir = makeWorkspaceDir(`${this.codeModel.platform}/${this.codeModel.project}`);
      this.appConfig.workspaceDir = workspaceDir;

      const { codeFileSystem, idbFileSystem, overlayFileSystem } = await configureFileSystem(
        this.codeModel,
        this.runtimeConfig.scenario
      );
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
    } finally {
      this._mounting = false;
    }
  }
}
