import { BrowserFS, WORKSPACE_IDB_NAME } from '@alipay/alex-core';
import { CodeModelService } from '../code-model.service';
import { EntryParam } from '../types';

type Callback<T = any> = (err: Error | null, rv?: T) => void;

const configureFileSystem = async (model: CodeModelService, scenario?: string | null) => {
  const requestByMethod = (name: 'getTree' | 'getBlob' | 'getEntryInfo') => {
    if (model.codeAPI[name]) {
      return (entry: string | EntryParam, cb: Callback<any>) => {
        (model.codeAPI[name]!(entry as any) as Promise<any>)
          .then((res) => cb(null, res))
          .catch((err) => cb(err));
      };
    }
  };

  const {
    createFileSystem,
    FileSystem: { CodeHost, OverlayFS, FolderAdapter, IndexedDB },
  } = BrowserFS;

  const [codeFileSystem, idbFileSystem] = await Promise.all([
    createFileSystem(CodeHost, {
      readTree: requestByMethod('getTree')!,
      readBlob: requestByMethod('getBlob')!,
      readEntryInfo: requestByMethod('getEntryInfo'),
    }),
    createFileSystem(IndexedDB, {
      storeName: `${WORKSPACE_IDB_NAME}${scenario ? `/${scenario}` : ''}`,
    }),
  ]);
  const folderSystem = await createFileSystem(FolderAdapter, {
    wrapped: idbFileSystem,
    folder: `/${model.platform}-${model.projectId}-${model.HEAD}`,
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
    readable: codeFileSystem,
    writable: folderSystem,
  });
  return {
    codeFileSystem,
    idbFileSystem,
    folderSystem,
    overlayFileSystem,
  };
};

export default configureFileSystem;
