import { Autowired } from '@ali/common-di';
import {
  Domain,
  localize,
  formatLocalize,
  Disposable,
  IReporterService,
  getDebugLogger,
} from '@ali/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  makeWorkspaceDir,
  CODE_ROOT,
  IDB_ROOT,
  IServerApp,
  RuntimeConfig,
  BrowserFS,
  REPORT_NAME,
} from '@alipay/alex-core';
import { IMessageService } from '@ali/ide-overlay';
import { ResponseError } from 'umi-request';
import configureFileSystem from './filesystem/configure';
import { ICodeAPIService } from './types';
import { request } from './request';
import { CodeModelService } from './code-model.service';

@Domain(LaunchContribution)
export class CodeContribution extends Disposable implements LaunchContribution {
  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

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

  async launch({ rootFS }: IServerApp) {
    const codeConfig = this.runtimeConfig?.codeService;
    if (!codeConfig) return;
    request.extendOptions({ prefix: codeConfig.baseURL });

    try {
      await this.codeModel.initProject(codeConfig);
      const workspaceDir = makeWorkspaceDir(`${this.codeModel.platform}/${this.codeModel.project}`);
      this.appConfig.workspaceDir = workspaceDir;

      const { codeFileSystem, idbFileSystem, overlayFileSystem } = await configureFileSystem(
        this.codeModel,
        this.codeAPI,
        this.runtimeConfig.scenario
      );
      rootFS.mount(workspaceDir, overlayFileSystem);
      // 将只读文件系统挂载到 /code 上
      rootFS.mount(CODE_ROOT, codeFileSystem);
      // 将可写文件系统挂载到 /idb
      rootFS.mount(IDB_ROOT, idbFileSystem);
      this.addDispose({
        dispose: () => {
          rootFS.umount(workspaceDir);
          rootFS.umount(CODE_ROOT);
          rootFS.umount(IDB_ROOT);
        },
      });
    } catch (err: any) {
      getDebugLogger().error(err);

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

      if (!isResponseError(err)) {
        this.messageService.error(localize('workspace.initialize.failed'));
        return;
      }
      if (err.name === 'RequestError') {
        this.messageService.error(localize('api.request.error'));
        return;
      }
      const status = err.response?.status;
      this.reporter.point(REPORT_NAME.CODE_SERVICE_INIT_PROJECT_ERROR, String(status || 'Unknown'));
      if (status === 401) {
        const goto = localize('api.login.goto');
        this.messageService
          .error(localize('api.response.no-login-antcode'), [goto])
          .then((value) => {
            if (value === goto) {
              window.open(codeConfig.baseURL);
            }
          });
        return;
      }
      let message = '';
      if (status === 403) {
        message = localize('api.response.project-no-access');
      } else if (status === 404) {
        message = formatLocalize('api.response.project-not-found', this.codeModel.project);
      }
      this.messageService.error(message || localize('api.response.unknown-error'));
    }
  }
}

function isResponseError(err: any): err is ResponseError {
  return err && (err.name === 'RequestError' || err.name === 'ResponseError');
}
