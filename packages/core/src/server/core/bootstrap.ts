import os from 'os';
import { fse } from '../node';
import { initialize, MountableFileSystem, InMemory, IndexedDB, FileSystem } from '../node/bfs';
import { AppConfig } from './app';
import { WORKSPACE_DIR } from '../../common';
import { IndexedDBName } from '../../common/constant';

export const bootstrap = async (appConfig: AppConfig) => {
  const [idbfs, inMemory] = await Promise.all([
    promisify(IndexedDB, { storeName: IndexedDBName }),
    promisify(InMemory, {}),
  ]);

  const mfs = await promisify(MountableFileSystem, {
    [os.homedir()]: idbfs,
    [os.tmpdir()]: inMemory,
  });

  initialize(mfs);

  // 初始化文件目录
  await Promise.all([
    await fse.ensureDir(appConfig.workspaceDir || WORKSPACE_DIR),
    await fse.ensureDir(appConfig.marketplace.extensionDir),
  ]);
};

function promisify<T extends { Create: (...args: any) => any }>(
  FileSystemClass: T,
  options: Parameters<T['Create']>[0]
): Promise<FileSystem> {
  return new Promise((resolve, reject) => {
    FileSystemClass.Create(options, (err: any, fs: FileSystem) => {
      if (err) {
        reject(err);
      } else {
        resolve(fs);
      }
    });
  });
}
