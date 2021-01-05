import type {
  ICommonServer as _ICommonServer,
  ILogServiceManager as _ILogServiceManager,
} from '@ali/ide-core-common';

export { CommonServerPath } from '@ali/ide-core-common';

export const ICommonServer = Symbol('ICommonServer');

export interface ICommonServer extends _ICommonServer {}

export const ILogServiceManager = Symbol('ILogServiceManager');

export interface ILogServiceManager extends _ILogServiceManager {}
