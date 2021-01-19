import type {
  ICommonServer as _ICommonServer,
  ILogServiceManager as _ILogServiceManager,
} from '@ali/ide-core-common';
import { RootFS } from '../../common/types';

export { CommonServerPath } from '@ali/ide-core-common';

export const ICommonServer = Symbol('ICommonServer');

export interface ICommonServer extends _ICommonServer {}

export const ILogServiceManager = Symbol('ILogServiceManager');

export interface ILogServiceManager extends _ILogServiceManager {}

export const FileSystemContribution = Symbol('FileSystemContribution');

export interface FileSystemContribution {
  // 挂载文件系统，此时使用默认的 MountableFileSystem，可自定义挂载路径
  mountFileSystem(rootFS: RootFS): Promise<void>;
}
