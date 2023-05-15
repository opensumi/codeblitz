import { Autowired } from '@opensumi/di';
import { Domain, ContributionProvider, localize, Disposable } from '@opensumi/ide-core-common';
import { IMessageService } from '@opensumi/ide-overlay';
import { IServerApp, RuntimeConfig, RootFS, AppConfig } from '../../common/types';
import { LaunchContribution } from './app';
import { FileSystemContribution } from './base';
import { BrowserFS } from '../node';
import { setSingleInjector, singleInjector } from '@alipay/alex/lib/core/hooks';

@Domain(LaunchContribution)
export class FileSystemLaunchContribution implements LaunchContribution {
  @Autowired(IServerApp)
  serverApp: IServerApp;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(FileSystemContribution)
  private readonly contributions: ContributionProvider<FileSystemContribution>;

  async launch() {
    for (const contribution of this.contributions.getContributions()) {
      await contribution.mountFileSystem(this.serverApp.rootFS);
    }
  }
}

@Domain(FileSystemContribution)
export class FileSystemConfigContribution extends Disposable implements FileSystemContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

  async mountFileSystem(rootFS: RootFS) {
    const fsConfig = this.runtimeConfig.workspace?.filesystem;
    if (!fsConfig) return;
    const { workspaceDir } = this.appConfig;
    // @ts-ignore
    if (rootFS && rootFS.mountList.includes(workspaceDir)) {
      return;
    }
    try {
      const workspaceFS = await BrowserFS.getFileSystem(fsConfig);
      rootFS.mount(workspaceDir, workspaceFS);
    } catch (err) {
      console.error('[Alex ERROR]: ', err);
      this.messageService.error(localize('workspace.initialize.failed'));
      // 使用内存作为回退文件系统
      rootFS.mount(
        workspaceDir,
        await BrowserFS.createFileSystem(BrowserFS.FileSystem.InMemory, {})
      );
    }
    this.addDispose({
      dispose: () => {
        rootFS.umount(workspaceDir);
      },
    });
  }
}
