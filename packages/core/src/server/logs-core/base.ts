import { ILogServiceForClient as _ILogServiceForClient } from '@ali/ide-logs/lib/common';

export { LogServiceForClientPath } from '@ali/ide-logs/lib/common';

export const ILogServiceForClient = Symbol('LogServiceForClient');

export interface ILogServiceForClient extends _ILogServiceForClient {}
