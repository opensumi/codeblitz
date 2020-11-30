import { Injector, ConstructorOf } from '@ali/common-di';
import {
  MaybePromise,
  ContributionProvider,
  createContributionProvider,
  BasicModule,
} from '@ali/ide-core-common';
import {
  LogLevel,
  ILogServiceManager,
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
import { IExtensionBasicMetadata } from '@alipay/spacex-shared';

import { INodeLogger, NodeLogger } from './node-logger';
import { FCServiceCenter, initFCService, ServerPort } from '../../connection';
import { IServerApp } from '../../common';
import { bootstrap } from './bootstrap';
import { path, os } from '../node';

export abstract class NodeModule extends BasicModule {}

type ModuleConstructor = ConstructorOf<NodeModule>;
export type ContributionConstructor = ConstructorOf<ServerAppContribution>;

export const AppConfig = Symbol('AppConfig');

interface Config {
  injector: Injector;
  workspaceDir: string;
  extensionDir?: string;
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

export interface IServerAppOpts extends Partial<Config> {
  modules?: ModuleConstructor[];
  contributions?: ContributionConstructor[];
  modulesInstances?: NodeModule[];
}

export const ServerAppContribution = Symbol('ServerAppContribution');

export interface ServerAppContribution {
  initialize?(app: IServerApp): MaybePromise<void>;
  onStart?(app: IServerApp): MaybePromise<void>;
  onStop?(app: IServerApp): MaybePromise<void>;
}

export class ServerApp implements IServerApp {
  private injector: Injector;

  private config: AppConfig;

  private logger: ILogService;

  private modulesInstances: NodeModule[];

  protected contributionsProvider: ContributionProvider<ServerAppContribution>;

  constructor(opts: IServerAppOpts) {
    this.injector = opts.injector || new Injector();
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
    this.initBaseProvider(opts);
    this.createNodeModules(opts.modules, opts.modulesInstances);
    this.logger = this.injector.get(ILogServiceManager).getLogger(SupportLogNamespace.App);
    this.contributionsProvider = this.injector.get(ServerAppContribution);
  }

  private get contributions(): ServerAppContribution[] {
    return this.contributionsProvider.getContributions();
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
      },
      {
        token: IReporter,
        useClass: DefaultReporter,
      },
      {
        token: IReporterService,
        useClass: ReporterService,
      },
      {
        token: ReporterMetadata,
        useValue: {
          host: REPORT_HOST.NODE,
        },
      }
    );
  }

  private async initializeContribution() {
    for (const contribution of this.contributions) {
      if (contribution.initialize) {
        try {
          await contribution.initialize(this);
        } catch (error) {
          this.logger.error('Could not initialize contribution', error);
        }
      }
    }
  }

  private async startContribution() {
    for (const contrib of this.contributions) {
      if (contrib.onStart) {
        try {
          await contrib.onStart(this);
        } catch (error) {
          this.logger.error('Could not start contribution', error);
        }
      }
    }
  }

  async start() {
    await bootstrap(this.config);
    await this.initializeContribution();
    bindModuleBackService(this.injector, this.modulesInstances);
    await this.startContribution();
  }

  private async onStop() {
    for (const contrib of this.contributions) {
      if (contrib.onStop) {
        try {
          await contrib.onStop(this);
        } catch (error) {
          this.logger.error('Could not stop contribution', error);
        }
      }
    }
  }

  private createNodeModules(Constructors: ModuleConstructor[] = [], modules: NodeModule[] = []) {
    const allModules = [...modules];
    for (const Constructor of Constructors) {
      allModules.push(this.injector.get(Constructor));
    }
    for (const instance of allModules) {
      if (instance.providers) {
        this.injector.addProviders(...instance.providers);
      }

      if (instance.contributionProvider) {
        if (Array.isArray(instance.contributionProvider)) {
          for (const contributionProvider of instance.contributionProvider) {
            createContributionProvider(this.injector, contributionProvider);
          }
        } else {
          createContributionProvider(this.injector, instance.contributionProvider);
        }
      }
    }
    this.modulesInstances = allModules;
  }

  dispose() {
    this.injector.disposeAll();
  }
}

export function bindModuleBackService(injector: Injector, modules: NodeModule[]) {
  const logger = injector.get(INodeLogger);
  const serviceCenter = new FCServiceCenter(ServerPort);
  const { createFCService } = initFCService(serviceCenter);

  for (const module of modules) {
    if (!module.backServices) {
      continue;
    }
    for (const service of module.backServices) {
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
