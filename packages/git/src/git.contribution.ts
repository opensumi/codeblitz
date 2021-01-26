import { Autowired } from '@ali/common-di';
import {
  Domain,
  localize,
  formatLocalize,
  Disposable,
  IReporterService,
} from '@ali/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  makeWorkspaceDir,
  GIT_ROOT,
  IServerApp,
  RuntimeConfig,
  BrowserFS,
} from '@alipay/alex-core';
import { IMessageService } from '@ali/ide-overlay';
import { ResponseError } from 'umi-request';
import configureFileSystem from './filesystem/configure';
import { IGitAPIService } from './types';
import { request } from './request';

@Domain(LaunchContribution)
export class GitContribution extends Disposable implements LaunchContribution {
  @Autowired(IGitAPIService)
  gitApiService: IGitAPIService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  async launch({ rootFS }: IServerApp) {
    // TODO: 判断权限抛出规范化的错误码，用于全局处理
    const { git } = this.runtimeConfig || {};
    if (!git) return;
    if (git.baseURL) {
      request.extendOptions({ prefix: git.baseURL });
    }

    try {
      await this.gitApiService.initProject(git);
      const workspaceDir = makeWorkspaceDir(
        `git/${this.gitApiService.projectId}/${this.gitApiService.commit}/${this.gitApiService.project}`
      );
      const { gitFileSystem, overlayFileSystem } = await configureFileSystem(this.gitApiService);
      rootFS.mount(workspaceDir, overlayFileSystem);
      // git 以 /git 作为目录读取只读文件系统数据
      rootFS.mount(GIT_ROOT, gitFileSystem);
      this.appConfig.workspaceDir = workspaceDir;
      this.addDispose({
        dispose: () => {
          rootFS.umount(workspaceDir);
          rootFS.umount(GIT_ROOT);
        },
      });
    } catch (err: any) {
      // 使用内存作为回退文件系统
      rootFS.mount(
        this.appConfig.workspaceDir,
        await BrowserFS.createFileSystem(BrowserFS.FileSystem.InMemory, {})
      );
      this.addDispose({
        dispose: () => {
          rootFS.umount(this.appConfig.workspaceDir);
        },
      });
      if (isResponseError(err)) {
        if (err.name === 'RequestError') {
          this.messageService.error(localize('api.request.error'));
          return;
        }
        if (err.name === 'ResponseError') {
          const status = err.response?.status;
          if (status === 401) {
            this.reporter.point('gitProject', 'responseError', { status });
            const goto = localize('api.login.goto');
            this.messageService
              .error(localize('api.response.no-login-antcode'), [goto])
              .then((value) => {
                if (value === goto) {
                  window.open(git.baseURL);
                }
              });
            return;
          }
          let message = '';
          if (status === 403) {
            this.reporter.point('gitProject', 'responseError', { status });
            message = localize('api.response.project-no-access');
          } else if (status === 404) {
            this.reporter.point('gitProject', 'responseError', { status });
            message = formatLocalize('api.response.project-not-found', this.gitApiService.project);
          }
          this.messageService.error(message || localize('api.response.unknown-error'));
          return;
        }
      }
      this.messageService.error(localize('workspace.initialize.failed'));
    }
  }
}

function isResponseError(err: any): err is ResponseError {
  return err && (err.name === 'RequestError' || err.name === 'ResponseError');
}
