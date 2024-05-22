import { Injector, ConstructorOf, InstanceCreator } from '@opensumi/di';
import {
  MaybePromise,
  ContributionProvider,
  createContributionProvider,
  LogLevel,
  ILogService,
  SupportLogNamespace,
  StoragePaths,
  DisposableCollection,
} from '@opensumi/ide-core-common';
import { AppConfig, BrowserModule } from '@opensumi/ide-core-browser';
import { IExtensionBasicMetadata } from '@codeblitzjs/ide-common';
import * as path from 'path';
import {
  BaseCommonChannelHandler,
  commonChannelPathHandler,
  RPCServiceChannelPath,
} from '@opensumi/ide-connection/lib/common/server-handler';
import { RPCServiceCenter, WSChannel, initRPCService } from '@opensumi/ide-connection';
import { ILogServiceManager } from './base';
import { INodeLogger, NodeLogger } from './node-logger';
import { CodeBlitzConnection, ServerPort } from '../../connection';
import { IServerApp, HOME_ROOT } from '../../common';
import { initializeRootFileSystem, initializeHomeFileSystem } from './filesystem';
import { fsExtra as fse } from '../node';
import { WORKSPACE_ROOT, STORAGE_DIR } from '../../common/constant';
import { RootFS, RuntimeConfig } from '../../common/types';
import { isBackServicesInServer } from '../../common/util';

export abstract class NodeModule extends BrowserModule {}

type ModuleConstructor = ConstructorOf<NodeModule>;
export type ContributionConstructor = ConstructorOf<ServerAppContribution>;

export const ServerConfig = Symbol('ServerConfig');
interface Config {
  /**
   * 设置落盘日志级别，默认为 Info 级别的log落盘
   */
  logLevel?: LogLevel;

  /**
   * TODO: remove
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

  /**
   * 在 welcome 以及 空白页展示的对外信息
   */
  app?: {
    logo: string;
    brandName: string;
    productName: string;
    icon: string;
  };
}

export interface ServerConfig extends Partial<Config> {
  marketplace: {
    extensionDir: string;
  };
}

export interface IServerAppOpts extends Partial<Config> {}

export const ServerAppContribution = Symbol('ServerAppContribution');

export interface ServerAppContribution {
  initialize?(app: IServerApp): MaybePromise<void>;
  onStart?(app: IServerApp): MaybePromise<void>;
  onStop?(app: IServerApp): MaybePromise<void>;
}

export const LaunchContribution = Symbol('LaunchContribution');

export interface LaunchContribution {
  // 应用启动在所有初始话之前，此时会检查应用可访问性，并动态更改配置数据，如 workspaceDir，同时可自定义挂载文件系统
  launch(app: IServerApp): MaybePromise<void>;
}

export class ServerApp implements IServerApp {
  private injector: Injector;

  private appConfig: AppConfig;

  private serverConfig: ServerConfig;

  private logger: ILogService;

  private modules: ModuleConstructor[];

  protected contributionsProvider: ContributionProvider<ServerAppContribution>;

  protected launchContributionsProvider: ContributionProvider<LaunchContribution>;

  public rootFS: RootFS;

  private disposeCollection = new DisposableCollection();

  constructor(
    opts: IServerAppOpts & {
      injector: Injector;
      modules: ModuleConstructor[];
      appConfig: AppConfig;
    }
  ) {
    this.injector = opts.injector;
    this.modules = opts.modules || [];
    this.appConfig = opts.appConfig;
    this.serverConfig = {
      marketplace: {
        extensionDir: path.join(HOME_ROOT, STORAGE_DIR, StoragePaths.MARKETPLACE_DIR),
      },
      logDir: opts.logDir,
      logLevel: opts.logLevel,
      LogServiceClass: opts.LogServiceClass,
      extensionMetadata: opts.extensionMetadata,
    };
    this.registerEventListeners();
    this.initBaseProvider();
    this.logger = this.injector.get(ILogServiceManager).getLogger(SupportLogNamespace.App);
    this.contributionsProvider = this.injector.get(ServerAppContribution);
    this.launchContributionsProvider = this.injector.get(LaunchContribution);
  }

  private get contributions(): ServerAppContribution[] {
    return this.contributionsProvider.getContributions();
  }

  private registerEventListeners() {
    const handleUnload = () => {
      this.stopContribution();
    };
    window.addEventListener('unload', handleUnload);

    this.disposeCollection.push({
      dispose: () => {
        window.removeEventListener('unload', handleUnload);
      },
    });
  }

  private initBaseProvider() {
    const { injector } = this;
    createContributionProvider(this.injector, LaunchContribution);
    createContributionProvider(this.injector, ServerAppContribution);
    injector.addProviders({
      token: ServerConfig,
      useValue: this.serverConfig,
    });
    injector.addProviders({
      token: INodeLogger,
      useClass: NodeLogger,
    });
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
    // 确保工作空间始终启动
    try {
      const runtimeConfig: RuntimeConfig = this.injector.get(RuntimeConfig);
      this.rootFS = await initializeRootFileSystem();
      this.disposeCollection.push(
        await initializeHomeFileSystem(this.rootFS, runtimeConfig.scenario)
      );

      for (const contribution of this.launchContributionsProvider.getContributions()) {
        if (contribution.launch) {
          await contribution.launch(this);
        }
      }

      // 初始化文件目录
      await fse.ensureDir(this.appConfig.workspaceDir || WORKSPACE_ROOT);
    } catch (err) {
      this.logger.error('Launch Failed', err);
    }
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
    const handler = new CodeblitzCommonChannelHandler('codeblitz-server');
    handler.receiveConnection(new CodeBlitzConnection(ServerPort));

    commonChannelPathHandler.register(RPCServiceChannelPath, {
      handler: (channel: WSChannel, clientId: string) => {
        handleClientChannel(this.injector, this.modules, channel, clientId, this.logger);
      },
      dispose: () => {},
    });

    await this.startContribution();
  }

  dispose() {
    this.disposeCollection.dispose();
  }
}

export function bindModuleBackService(
  injector: Injector,
  modules: ModuleConstructor[],
  serviceCenter: RPCServiceCenter
) {
  const childInjector = injector.createChild();

  const logger = childInjector.get(INodeLogger);
  const { createRPCService } = initRPCService(serviceCenter);

  for (const m of modules) {
    const moduleInstance = childInjector.get(m) as BrowserModule;
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
      if (service.protocol) {
        serviceCenter.loadProtocol(service.protocol);
      }

      logger.log('back service', serviceToken);
      const serviceInstance = childInjector.get(serviceToken);
      const proxyService = createRPCService(servicePath, serviceInstance);
      if (!serviceInstance.client) {
        serviceInstance.client = proxyService;
      }
    }
  }

  return childInjector;
}

export class CodeblitzCommonChannelHandler extends BaseCommonChannelHandler {
  doHeartbeat(connection: any): void {}
}

function handleClientChannel(
  injector: Injector,
  modulesInstances: ModuleConstructor[],
  channel: WSChannel,
  clientId: string,
  logger: INodeLogger
) {
  logger.log(`New RPC connection ${clientId}`);

  const serviceCenter = new RPCServiceCenter(undefined, logger);
  const serviceChildInjector = bindModuleBackService(injector, modulesInstances, serviceCenter);

  const remove = serviceCenter.setSumiConnection(channel.createSumiConnection());

  channel.onceClose(() => {
    remove.dispose();
    serviceChildInjector.disposeAll();

    logger.log(`Remove RPC connection ${clientId}`);
  });
}
