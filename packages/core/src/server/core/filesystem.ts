import { Deferred, getDebugLogger } from '@ali/ide-core-common';
import { BrowserFS, FileSystem } from '../node';
import { HOME_ROOT, HOME_IDB_NAME } from '../../common';
import { RootFS } from '../../common/types';

const { createFileSystem, FileSystem, initialize } = BrowserFS;

// 对外暴露 root 文件系统，此时根系统及 home 目录已初始化完毕
// 此处并未保证工作空间文件系统初始化完毕，如需安全操作，在各自实例的 onLoad 里进行
export const filesystemDeferred = new Deferred<void>();
export const isFilesystemReady = () => filesystemDeferred.promise;

let mountfs: RootFS | null = null;

export const initializeRootFileSystem = async (scenario?: string | null) => {
  if (mountfs) return mountfs;

  let homefs: FileSystem | null = null;
  // scenario 为 null 时 或者 browser 隐身模式时无法使用 indexedDB 时，回退到 memory
  // TODO: 寻找更好的解决方案
  if (scenario !== null && FileSystem.IndexedDB.isAvailable()) {
    try {
      // 通过 scenario 隔离 indexedDB
      homefs = await createFileSystem(FileSystem.IndexedDB, {
        storeName: `${HOME_IDB_NAME}${scenario ? `/${scenario}` : ''}`,
      });
    } catch (err) {
      getDebugLogger().error(`初始化 indexedDB 文件系统失败 ${err?.message || ''}`);
      homefs = null;
    }
  }
  mountfs = (await createFileSystem(
    FileSystem.MountableFileSystem,
    homefs ? { [HOME_ROOT]: homefs } : {}
  )) as RootFS;
  initialize(mountfs);
  filesystemDeferred.resolve();
  return mountfs;
};
