import { Autowired, Injectable } from '@opensumi/di';
import { ILogService, LogLevel, SupportLogNamespace } from '@opensumi/ide-core-common';
import { ILogServiceManager } from './base';

// tslint:disable-next-line:no-empty-interface
export interface INodeLogger extends ILogService {}
export const INodeLogger = Symbol('INodeLogger');

@Injectable()
export class NodeLogger implements INodeLogger {
  @Autowired(ILogServiceManager)
  loggerManger: ILogServiceManager;

  logger: ILogService;

  constructor() {
    this.logger = this.loggerManger.getLogger(SupportLogNamespace.Node);
  }

  error(...args: any[]) {
    return this.logger.error(...args);
  }

  warn(...args: any[]) {
    return this.logger.warn(...args);
  }

  log(...args: any[]) {
    return this.logger.log(...args);
  }
  debug(...args: any[]) {
    return this.logger.debug(...args);
  }

  verbose(...args: any[]) {
    return this.logger.verbose(...args);
  }

  critical(...args: any[]) {
    return this.logger.critical(...args);
  }

  dispose() {
    return this.logger.dispose();
  }

  setOptions(options: any) {
    return this.logger.setOptions(options);
  }

  sendLog(level: LogLevel, message: string) {
    return this.logger.sendLog(level, message);
  }

  drop() {
    return this.logger.drop();
  }

  flush() {
    return this.logger.flush();
  }

  getLevel() {
    return this.logger.getLevel();
  }

  setLevel(level: LogLevel) {
    return this.logger.setLevel(level);
  }
}
