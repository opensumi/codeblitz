import { BrowserFS } from '../node';
import { HOME_ROOT, TMP_ROOT, HOME_IDB_NAME } from '../../common';
import { RootFS } from '../../common/types';

const { createFileSystem, FileSystem, initialize } = BrowserFS;

export const initializeRootFileSystem = async () => {
  // TODO: /home 采用 localStorage 作为文件系统是不是更好点，理论数据量不大的话没必要用 IndexedDB
  const [memfs, idbfs] = await Promise.all([
    createFileSystem(FileSystem.InMemory, {}),
    createFileSystem(FileSystem.IndexedDB, {
      storeName: HOME_IDB_NAME,
    }),
  ]);
  const mountfs = await createFileSystem(FileSystem.MountableFileSystem, {
    [TMP_ROOT]: memfs,
    [HOME_ROOT]: idbfs,
  });
  initialize(mountfs);
  return mountfs as RootFS;
};
