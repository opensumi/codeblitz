import { ILogServiceForClient as _ILogServiceForClient } from '@opensumi/ide-logs/lib/common';

export { LogServiceForClientPath } from '@opensumi/ide-logs/lib/common';

export const ILogServiceForClient = Symbol('LogServiceForClient');

export interface ILogServiceForClient extends _ILogServiceForClient {}
