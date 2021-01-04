import { Autowired, Injector, INJECTOR_TOKEN } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import { AppConfig as ClientAppConfig } from '@ali/ide-core-browser';
import {
  ServerAppContribution,
  ServerAppConfig,
  makeWorkspaceDir,
  GIT_ROOT,
  IServerApp,
} from '@alipay/spacex-core';
import { RuntimeConfig } from '@alipay/spacex-shared';
import type { IRuntimeConfig } from '@alipay/spacex-shared';
import configureFileSystem from './file-system/configure';
import { IGitAPIService } from './types';

@Domain(ServerAppContribution)
export class GitContribution implements ServerAppContribution {
  @Autowired(IGitAPIService)
  gitApiService: IGitAPIService;

  @Autowired(RuntimeConfig)
  runtimeConfig: IRuntimeConfig;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  async launch({ rootFS }: IServerApp) {
    const { injector } = this;
    // TODO: 判断权限抛出规范化的错误码，用于全局处理
    const { git, scene } = this.runtimeConfig || {};
    if (!git) {
      throw new Error('git scene must config git in runtimeConfig firstly');
    }
    await this.gitApiService.initProject(git);
    const clientAppConfig: ClientAppConfig = injector.get(ClientAppConfig);
    const serverAppConfig: ServerAppConfig = injector.get(ServerAppConfig);
    const workspaceDir = makeWorkspaceDir(
      scene || 'git',
      `${this.gitApiService.projectId}/${this.gitApiService.commit}/${this.gitApiService.project}`
    );
    clientAppConfig.workspaceDir = workspaceDir;
    serverAppConfig.workspaceDir = workspaceDir;

    const { gitFileSystem, overlayFileSystem } = await configureFileSystem(this.gitApiService);
    rootFS.mount(workspaceDir, overlayFileSystem);
    // git 以 /git 作为目录读取只读文件系统数据
    rootFS.mount(`/${GIT_ROOT}`, gitFileSystem);
  }
}

// Declaration Merging
declare module '@alipay/spacex-shared' {
  export interface IRuntimeConfig {
    git?: {
      project: string;
      commit?: string;
      branch?: string;
    };
  }
}
