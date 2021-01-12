import { Injector, ConstructorOf } from '@ali/common-di';
import {
  MaybePromise,
  ContributionProvider,
  createContributionProvider,
  BasicModule,
  LogLevel,
  ILogService,
  SupportLogNamespace,
  IReporter,
  DefaultReporter,
  IReporterService,
  ReporterService,
  ReporterMetadata,
  REPORT_HOST,
  StoragePaths,
} from '@ali/ide-core-common';
import { IExtensionBasicMetadata } from '@alipay/alex-shared';
import path from 'path';
import os from 'os';

import { ILogServiceManager } from './base';
import { INodeLogger, NodeLogger } from './node-logger';
import { FCServiceCenter, initFCService, ServerPort } from '../../connection';
import { IServerApp } from '../../common';
import { initializeRootFileSystem } from './util';
import { BrowserFS, fse } from '../node';
import { WORKSPACE_ROOT } from '../../common/constant';
import { RootFS } from '../../common/types';
import { isBackServicesInServer } from '../../common/util';

export abstract class NodeModule extends BasicModule {}

type ModuleConstructor = ConstructorOf<NodeModule>;
export type ContributionConstructor = ConstructorOf<ServerAppContribution>;

export const AppConfig = Symbol('AppConfig');
interface Config {
  injector: Injector;
  workspaceDir: string;
  extensionDir?: string;
  modules?: ModuleConstructor[];
  /**
   * 设置落盘日志级别，默认为 Info 级别的log落盘
   */
  logLevel?: LogLevel;
  /**
   * 设置日志的目录，默认：~/.kaitian/logs
   */
  logDir?: string;
  /**
   * 外部设置的 ILogService，替换默认的 logService
   */
  LogServiceClass?: ConstructorOf<ILogService>;
  /**
   * fileService禁止访问的路径，使用glob匹配
   */
  blockPatterns?: string[];
  /**
   * 扩展元数据, CLI 自动生成
   */
  extensionMetadata?: IExtensionBasicMetadata[];
}

export interface AppConfig extends Partial<Config> {
  marketplace: {
    extensionDir: string;
  };
}

export { AppConfig as ServerAppConfig };

export interface IServerAppOpts extends Partial<Config> {}

export const ServerAppContribution = Symbol('ServerAppContribution');

export interface ServerAppContribution {
  initialize?(app: IServerApp): MaybePromise<void>;
  onStart?(app: IServerApp): MaybePromise<void>;
  onStop?(app: IServerApp): MaybePromise<void>;
  // 应用启动在所有初始话之前，此时会检查应用可访问性，并动态更改配置数据，如 workspaceDir，同时可自定义挂载文件系统
  launch?(app: IServerApp): MaybePromise<void>;
}

export class ServerApp implements IServerApp {
  private injector: Injector;

  private config: AppConfig;

  private logger: ILogService;

  private modules: ModuleConstructor[];

  protected contributionsProvider: ContributionProvider<ServerAppContribution>;

  public rootFS: RootFS;

  constructor(opts: IServerAppOpts) {
    this.injector = opts.injector || new Injector();
    this.modules = opts.modules || [];
    this.config = {
      injector: this.injector,
      workspaceDir: opts.workspaceDir,
      extensionDir: opts.extensionDir,
      marketplace: {
        extensionDir: path.join(
          os.homedir(),
          StoragePaths.DEFAULT_STORAGE_DIR_NAME,
          StoragePaths.MARKETPLACE_DIR
        ),
      },
      logDir: opts.logDir,
      logLevel: opts.logLevel,
      LogServiceClass: opts.LogServiceClass,
      extensionMetadata: opts.extensionMetadata,
    };
    this.registerEventListeners();
    this.initBaseProvider(opts);
    this.logger = this.injector.get(ILogServiceManager).getLogger(SupportLogNamespace.App);
    this.contributionsProvider = this.injector.get(ServerAppContribution);
  }

  private get contributions(): ServerAppContribution[] {
    return this.contributionsProvider.getContributions();
  }

  private registerEventListeners() {
    window.addEventListener('unload', () => {
      this.stopContribution();
    });
  }

  private initBaseProvider(opts: IServerAppOpts) {
    const { injector } = this;
    createContributionProvider(this.injector, ServerAppContribution);
    injector.addProviders({
      token: AppConfig,
      useValue: this.config,
    });
    injector.addProviders(
      {
        token: INodeLogger,
        useClass: NodeLogger,
      }
      // TODO: 和 browser 共用一套就行
      // {
      //   token: IReporter,
      //   useClass: DefaultReporter,
      // },
      // {
      //   token: IReporterService,
      //   useClass: ReporterService,
      // },
      // {
      //   token: ReporterMetadata,
      //   useValue: {
      //     host: REPORT_HOST.NODE,
      //   },
      // }
    );
  }

  private async runContributionsPhase(phaseName: keyof ServerAppContribution, ...args: any[]) {
    for (const contribution of this.contributions) {
      if (contribution[phaseName]) {
        try {
          await contribution[phaseName as any](...args);
        } catch (error) {
          this.logger.error(`Could not ${phaseName} contribution`, error);
        }
      }
    }
  }

  private async launch() {
    this.rootFS = await initializeRootFileSystem();
    // 启动发生的错误抛到全局处理，不启动应用
    for (const contribution of this.contributions) {
      if (contribution.launch) {
        await contribution.launch(this);
      }
    }
    // 初始化文件目录
    await Promise.all([
      await fse.ensureDir(this.config.workspaceDir || WORKSPACE_ROOT),
      await fse.ensureDir(this.config.marketplace.extensionDir),
    ]);
  }

  private async initializeContribution() {
    return this.runContributionsPhase('initialize', this);
  }

  private async startContribution() {
    return this.runContributionsPhase('onStart', this);
  }

  private async stopContribution() {
    return this.runContributionsPhase('onStop', this);
  }

  async start() {
    await this.launch();
    await this.initializeContribution();
    bindModuleBackService(this.injector, this.modules);
    await this.startContribution();
  }
}

export function bindModuleBackService(injector: Injector, modules: ModuleConstructor[]) {
  const logger = injector.get(INodeLogger);
  const serviceCenter = new FCServiceCenter(ServerPort);
  const { createFCService } = initFCService(serviceCenter);

  for (const module of modules) {
    const moduleInstance = injector.get(module) as BasicModule;
    if (!moduleInstance.backServices) {
      continue;
    }
    for (const service of moduleInstance.backServices) {
      if (!isBackServicesInServer(service)) {
        continue;
      }
      const { token: serviceToken, servicePath } = service;
      if (!serviceToken) {
        continue;
      }
      logger.log('back service', serviceToken);
      const serviceInstance = injector.get(serviceToken);
      const proxyService = createFCService(servicePath, serviceInstance);
      if (!serviceInstance.client) {
        serviceInstance.client = proxyService;
      }
    }
  }
}
