import { Injectable, Autowired, ConstructorOf } from '@ali/common-di';
import {
  ILogService,
  LogLevel,
  SupportLogNamespace,
  BaseLogServiceOptions,
  LoggerManagerInitOptions,
} from '@ali/ide-logs/lib/common';
import { ILogServiceManager } from '../core/base';
import { Emitter } from '@ali/ide-core-common';
import { AppConfig } from '../core/app';
import { LogService, DEFAULT_LOG_FOLDER } from './log.service';

@Injectable()
export class LogServiceManager implements ILogServiceManager {
  @Autowired(AppConfig)
  private appConfig: AppConfig;

  protected readonly logLevelChangeEmitter = new Emitter<LogLevel>();
  private globalLogLevel: LogLevel;
  private logMap = new Map<SupportLogNamespace, ILogService>();
  private logRootFolderPath: string;
  private logFolderPath: string;
  private LogServiceClass: ConstructorOf<ILogService>;

  constructor() {
    this.init({
      logDir: this.appConfig.logDir,
      logLevel: this.appConfig.logLevel,
    });
    this.cleanOldLogs();
  }

  private init = (options: LoggerManagerInitOptions) => {
    this.logRootFolderPath = options.logDir || DEFAULT_LOG_FOLDER;
    this.logFolderPath = this._getLogFolder();
    this.globalLogLevel = options.logLevel || LogLevel.Info;
    this.LogServiceClass = this.appConfig.LogServiceClass || LogService;
  };

  getLogger = (
    namespace: SupportLogNamespace,
    loggerOptions?: BaseLogServiceOptions
  ): ILogService => {
    if (this.logMap.get(namespace)) {
      const logger: ILogService = this.logMap.get(namespace)!;
      if (loggerOptions) {
        logger.setOptions(loggerOptions);
      }
      return logger;
    }
    const logger = new this.LogServiceClass(
      Object.assign(
        {
          namespace,
          logLevel: this.globalLogLevel,
          logServiceManager: this,
        },
        loggerOptions
      )
    );
    this.logMap.set(namespace, logger);
    return logger;
  };

  removeLogger = (namespace: SupportLogNamespace) => {
    this.logMap.delete(namespace);
  };

  getGlobalLogLevel = () => {
    return this.globalLogLevel;
  };

  setGlobalLogLevel = (level: LogLevel) => {
    this.globalLogLevel = level;
    this.logLevelChangeEmitter.fire(level);
  };

  get onDidChangeLogLevel() {
    return this.logLevelChangeEmitter.event;
  }

  getLogFolder = (): string => {
    if (!this.logFolderPath) {
      throw new Error(`Please do init first!`);
    }
    return this.logFolderPath;
  };

  getRootLogFolder = (): string => {
    return this.logRootFolderPath;
  };

  cleanOldLogs = async () => {};

  cleanAllLogs = async () => {};

  cleanExpiredLogs = async (day: number) => {};

  getLogZipArchiveByDay(day: number): Promise<any> {
    return Promise.resolve();
  }

  async getLogZipArchiveByFolder(foldPath: string): Promise<any> {
    return Promise.resolve();
  }

  dispose = () => {
    this.logLevelChangeEmitter.dispose();
    this.logMap.forEach((logger) => {
      logger.dispose();
    });
  };

  private _getLogFolder = (): string => {
    const logRootPath = this.getRootLogFolder();
    if (!logRootPath) {
      throw new Error(`Please do initLogManager first!!!`);
    }
    return logRootPath;
  };
}
