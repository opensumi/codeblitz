import { Autowired } from '@ali/common-di';
import { Domain, ContributionProvider } from '@ali/ide-core-common';
import { IServerApp, RuntimeConfig, RootFS, AppConfig } from '../../common/types';
import { LaunchContribution } from './app';
import { FileSystemContribution } from './base';
import { BrowserFS } from '../node';

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
export class FileSystemConfigContribution implements FileSystemContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  async mountFileSystem(rootFS: RootFS) {
    const { workspaceDir } = this.appConfig;
    const fsConfig = this.runtimeConfig.workspace?.fileSystemConfig;
    if (!fsConfig) return;
    const workspaceFS = await BrowserFS.getFileSystem(fsConfig);
    rootFS.mount(workspaceDir, workspaceFS);
  }
}
