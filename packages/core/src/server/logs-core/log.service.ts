import { Injectable, Autowired } from '@opensumi/di';
import {
  ILogService,
  ILogServiceOptions,
  BaseLogServiceOptions,
  LogLevel,
  SupportLogNamespace,
  format,
  DebugLog,
  IBaseLogService,
} from '@opensumi/ide-logs/lib/common';
import * as path from 'path';

import { ILogServiceForClient } from './base';
import { ILogServiceManager } from '../core/base';
import { FCService } from '../../connection';
import { HOME_ROOT } from '../../common';

export const DEFAULT_LOG_FOLDER = path.join(HOME_ROOT, `.kaitian/logs/`);

export const LogLevelMessageMap = {
  [LogLevel.Verbose]: 'VERBOSE',
  [LogLevel.Debug]: 'DEBUG',
  [LogLevel.Info]: 'INFO',
  [LogLevel.Warning]: 'WARNING',
  [LogLevel.Error]: 'ERROR',
  [LogLevel.Critical]: 'CRITICAL',
};

// TODO: 临时用 DebugLog 打印
export class BaseLogService implements IBaseLogService {
  protected namespace: string;
  protected debugLog: DebugLog;
  protected logLevel: LogLevel;

  constructor(options: BaseLogServiceOptions) {
    this.init(options);
    this.debugLog = new DebugLog(this.namespace);
  }

  protected init(options: BaseLogServiceOptions) {
    this.namespace = options.namespace || SupportLogNamespace.OTHER;
    this.logLevel = options.logLevel || LogLevel.Info;
  }

  verbose(): void {
    const message = format(arguments);
    this.showDebugLog(LogLevel.Verbose, message);
  }

  debug(): void {
    const message = format(arguments);
    this.showDebugLog(LogLevel.Debug, message);
  }

  log(): void {
    const message = format(arguments);
    this.showDebugLog(LogLevel.Info, message);
  }

  warn(): void {
    const message = format(arguments);
    this.showDebugLog(LogLevel.Warning, message);
  }

  error(): void {
    const arg = arguments[0];
    let message: string;

    if (arg instanceof Error) {
      const array = Array.prototype.slice.call(arguments) as any[];
      array[0] = arg.stack;
      message = format(array);
    } else {
      message = format(arguments);
    }
    this.showDebugLog(LogLevel.Error, message);
  }

  critical(): void {
    const message = format(arguments);
    this.showDebugLog(LogLevel.Critical, message);
  }

  getLevel(): LogLevel {
    return this.logLevel;
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  protected showDebugLog(level: LogLevel, message: string): void {
    switch (level) {
      case LogLevel.Verbose:
        return this.debugLog.log(message);
      case LogLevel.Debug:
        return this.debugLog.debug(message);
      case LogLevel.Info:
        return this.debugLog.info(message);
      case LogLevel.Warning:
        return this.debugLog.warn(message);
      case LogLevel.Error:
        return this.debugLog.error(message);
      case LogLevel.Critical:
        return this.debugLog.error(message);
      default:
        throw new Error('Invalid log level');
    }
  }

  sendLog(level: LogLevel, message: string) {}
  drop() {
    return Promise.resolve();
  }
  flush() {
    return Promise.resolve();
  }
  dispose() {}
}

export class LogService extends BaseLogService implements ILogService {
  protected logServiceManager: ILogServiceManager;

  constructor(options: ILogServiceOptions) {
    super(options);
  }

  protected init(options: ILogServiceOptions) {
    this.logServiceManager = options.logServiceManager;
    this.namespace = options.namespace || SupportLogNamespace.OTHER;
    this.logLevel = options.logLevel || LogLevel.Info;
  }

  setOptions(options: BaseLogServiceOptions) {
    if (options.logLevel) {
      this.logLevel = options.logLevel;
    }
  }

  getLevel(): LogLevel {
    return this.logServiceManager.getGlobalLogLevel();
  }

  setLevel(level: LogLevel): void {
    this.logServiceManager.setGlobalLogLevel(level);
  }

  dispose() {
    super.dispose();
    this.logServiceManager.removeLogger(this.namespace as SupportLogNamespace);
  }
}

@Injectable()
export class LogServiceForClient extends FCService implements ILogServiceForClient {
  @Autowired(ILogServiceManager)
  loggerManager: ILogServiceManager;

  constructor() {
    super();
    this.loggerManager.onDidChangeLogLevel((level) => {
      this.client?.onDidLogLevelChanged(level);
    });
  }

  getLevel(namespace: SupportLogNamespace) {
    return this.getLogger(namespace).getLevel();
  }

  setLevel(namespace: SupportLogNamespace, level: LogLevel) {
    this.getLogger(namespace).setLevel(level);
  }

  verbose(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Verbose, message);
  }

  debug(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Debug, message);
  }

  log(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Info, message);
  }

  warn(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Warning, message);
  }

  error(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Error, message);
  }

  critical(namespace: SupportLogNamespace, message: string, pid?: number) {
    const logger = this.getLogger(namespace, { pid });
    logger.sendLog(LogLevel.Critical, message);
  }

  dispose(namespace: SupportLogNamespace) {
    this.getLogger(namespace).dispose();
  }

  setGlobalLogLevel(level: LogLevel) {
    this.loggerManager.setGlobalLogLevel(level);
  }

  getGlobalLogLevel() {
    this.loggerManager.getGlobalLogLevel();
  }

  disposeAll() {
    this.loggerManager.dispose();
  }

  async getLogFolder() {
    return this.loggerManager.getLogFolder();
  }

  protected getLogger(namespace: SupportLogNamespace, options?: BaseLogServiceOptions) {
    const logger = this.loggerManager.getLogger(namespace, Object.assign({}, options));
    return logger;
  }
}
