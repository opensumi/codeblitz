import { BrowserFS, WORKSPACE_IDB_NAME } from '@alipay/alex-core';
import { IGitAPIService } from '../types';
import { GitModelService } from '../git-model.service';

const stripSlash = (p: string) => {
  if (p[0] === '/') {
    return p.slice(1);
  }
  return p;
};

type Callback<T = any> = (err: Error | null, rv?: T) => void;

const configureFileSystem = async (model: GitModelService, api: IGitAPIService) => {
  const requestByMethod = (name: 'getTreeEntry' | 'getTree' | 'getBlob' | 'getBlobSize') => (
    p: string,
    cb: Callback<any>
  ) => {
    p = stripSlash(p);
    (api[name](p) as Promise<any>).then((res) => cb(null, res)).catch((err) => cb(err));
  };

  const {
    createFileSystem,
    FileSystem: { CodeHost, OverlayFS, FolderAdapter, IndexedDB },
  } = BrowserFS;

  const [gitFileSystem, idbFileSystem] = await Promise.all([
    createFileSystem(CodeHost, {
      requestStat: requestByMethod('getTreeEntry'),
      requestDir: requestByMethod('getTree'),
      requestFile: requestByMethod('getBlob'),
      requestFileSize: requestByMethod('getBlobSize'),
    }),
    createFileSystem(IndexedDB, { storeName: WORKSPACE_IDB_NAME }),
  ]);
  const folderSystem = await createFileSystem(FolderAdapter, {
    wrapped: idbFileSystem,
    folder: `/${model.platform}-${model.projectId}-${model.commit}`,
  });
  await new Promise<void>((resolve, reject) => {
    (folderSystem as InstanceType<typeof FolderAdapter>).initialize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  const overlayFileSystem = await createFileSystem(OverlayFS, {
    readable: gitFileSystem,
    writable: folderSystem,
  });
  return {
    gitFileSystem,
    idbFileSystem,
    folderSystem,
    overlayFileSystem,
  };
};

export default configureFileSystem;
