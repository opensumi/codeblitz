import { Deferred, getDebugLogger } from '@opensumi/ide-core-common';
import { HOME_IDB_NAME, HOME_ROOT } from '../../common';
import { RootFS } from '../../common/types';
import { BrowserFS, FileSystem } from '../node';

const { createFileSystem, FileSystem, initialize } = BrowserFS;

// 对外暴露 root 文件系统，此时根系统及 home 目录已初始化完毕
// 此处并未保证工作空间文件系统初始化完毕，如需安全操作，在各自实例的 onLoad 里进行
export const filesystemDeferred = new Deferred<void>();
export const isFilesystemReady = () => filesystemDeferred.promise;

let mountfs: RootFS | null = null;

export const initializeRootFileSystem = async () => {
  if (mountfs) return mountfs;

  mountfs = (await createFileSystem(FileSystem.MountableFileSystem, {})) as RootFS;
  initialize(mountfs);
  filesystemDeferred.resolve();
  return mountfs;
};

export const unmountRootFS = () => {
  if (mountfs) {
    // mountfs
    mountfs = null;
  }
};

export const initializeHomeFileSystem = async (rootFS: RootFS, scenario?: string | null) => {
  try {
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
        // @ts-ignore
        getDebugLogger().error(`初始化 indexedDB 文件系统失败 ${err?.message || ''}`);
        homefs = null;
      }
    }
    if (!homefs) {
      homefs = await createFileSystem(FileSystem.InMemory, {});
    }
    rootFS.mount(HOME_ROOT, homefs);
  } catch (err) {
    // @ts-ignore
    getDebugLogger().error(`初始化 home 目录失败 ${err?.message || ''}`);
  }
  return {
    dispose() {
      rootFS.umount(HOME_ROOT);
    },
  };
};
