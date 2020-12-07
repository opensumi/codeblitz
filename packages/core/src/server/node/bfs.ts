import fs from 'browserfs/dist/node/core/node_fs';
import { checkOptions } from 'browserfs/dist/node/core/util';
import type {
  FileSystem,
  FileSystemConstructor,
  BFSCallback,
} from 'browserfs/dist/node/core/file_system';
import type { ApiError } from 'browserfs/dist/node/core/api_error';

import MountableFileSystem from 'browserfs/dist/node/backend/MountableFileSystem';
import IndexedDB from 'browserfs/dist/node/backend/IndexedDB';
import InMemory from 'browserfs/dist/node/backend/InMemory';

[MountableFileSystem, IndexedDB, InMemory].forEach((fsType: FileSystemConstructor) => {
  const create = fsType.Create;
  fsType.Create = function (opts?: any, cb?: BFSCallback<FileSystem>): void {
    const oneArg = typeof opts === 'function';
    const normalizedCb = oneArg ? opts : cb;
    const normalizedOpts = oneArg ? {} : opts;

    function wrappedCb(e?: ApiError): void {
      if (e) {
        normalizedCb(e);
      } else {
        create.call(fsType, normalizedOpts, normalizedCb);
      }
    }

    checkOptions(fsType, normalizedOpts, wrappedCb);
  };
});

export function initialize(rootfs: FileSystem) {
  return fs.initialize(rootfs);
}

export { MountableFileSystem, IndexedDB, InMemory, fs, FileSystem };
