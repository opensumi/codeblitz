import { Autowired, Injector, INJECTOR_TOKEN } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  makeWorkspaceDir,
  GIT_ROOT,
  IServerApp,
  RuntimeConfig,
} from '@alipay/alex-core';
import configureFileSystem from './file-system/configure';
import { IGitAPIService } from './types';

@Domain(LaunchContribution)
export class GitContribution implements LaunchContribution {
  @Autowired(IGitAPIService)
  gitApiService: IGitAPIService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  async launch({ rootFS }: IServerApp) {
    // TODO: 判断权限抛出规范化的错误码，用于全局处理
    const { git, scene } = this.runtimeConfig || {};
    if (!git) {
      throw new Error('git scene must config git in runtimeConfig firstly');
    }
    await this.gitApiService.initProject(git);

    const workspaceDir = makeWorkspaceDir(
      `${scene || 'git'}/${this.gitApiService.projectId}/${this.gitApiService.commit}/${
        this.gitApiService.project
      }`
    );
    this.appConfig.workspaceDir = workspaceDir;

    const { gitFileSystem, overlayFileSystem } = await configureFileSystem(this.gitApiService);
    rootFS.mount(workspaceDir, overlayFileSystem);
    // git 以 /git 作为目录读取只读文件系统数据
    rootFS.mount(GIT_ROOT, gitFileSystem);
  }
}
