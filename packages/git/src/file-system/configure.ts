import { BrowserFS, WORKSPACE_IDB_NAME } from '@alipay/alex-core';
import GitRemote from './GitRemote';
import { IGitAPIService } from '../types';

BrowserFS.addFileSystemType('GitRemote', GitRemote);

const stripSlash = (p: string) => {
  if (p[0] === '/') {
    return p.slice(1);
  }
  return p;
};

type Callback<T = any> = (err: Error | null, rv?: T) => void;

const configureFileSystem = async (apiService: IGitAPIService) => {
  const requestByMethod = (name: 'getTreeEntry' | 'getTree' | 'getBlob' | 'getBlobSize') => (
    p: string,
    cb: Callback<any>
  ) => {
    p = stripSlash(p);
    (apiService[name](p) as Promise<any>).then((res) => cb(null, res)).catch((err) => cb(err));
  };

  const gitFileSystem = await BrowserFS.createFileSystem(GitRemote, {
    requestStat: requestByMethod('getTreeEntry'),
    requestDir: requestByMethod('getTree'),
    requestFile: requestByMethod('getBlob'),
    requestFileSize: requestByMethod('getBlobSize'),
  });
  const overlayFileSystem = await BrowserFS.createFileSystem(BrowserFS.FileSystem.OverlayFS, {
    readable: gitFileSystem,
    writable: await BrowserFS.createFileSystem(BrowserFS.FileSystem.IndexedDB, {
      storeName: WORKSPACE_IDB_NAME,
    }),
  });
  return {
    gitFileSystem,
    overlayFileSystem,
  };
};

export default configureFileSystem;
