import './patch';
import fs from 'browserfs/dist/node/core/node_fs';
import { checkOptions } from 'browserfs/dist/node/core/util';
import {
  FileSystem,
  FileSystemConstructor,
  BFSCallback,
  FileSystemOptions,
} from 'browserfs/dist/node/core/file_system';
import * as Errors from 'browserfs/dist/node/core/api_error';

import MountableFileSystem, {
  MountableFileSystemOptions,
} from 'browserfs/dist/node/backend/MountableFileSystem';
import IndexedDB, { IndexedDBFileSystemOptions } from 'browserfs/dist/node/backend/IndexedDB';
import InMemory from 'browserfs/dist/node/backend/InMemory';
import FolderAdapter, { FolderAdapterOptions } from 'browserfs/dist/node/backend/FolderAdapter';
import OverlayFS, { OverlayFSOptions } from 'browserfs/dist/node/backend/OverlayFS';
import { CodeHost, CodeHostOptions } from './CodeHost';
import { FileIndexSystem, FileIndexSystemOptions } from './FileIndex';
import { WORKSPACE_IDB_NAME } from '../../../common';

export type {
  MountableFileSystemOptions,
  IndexedDBFileSystemOptions,
  FolderAdapterOptions,
  OverlayFSOptions,
  CodeHostOptions,
  FileIndexSystemOptions,
};

export type { FileIndex as FileIndexType } from './FileIndex';
export type { CodeHostType } from './CodeHost';

const Backends = {
  MountableFileSystem,
  IndexedDB,
  InMemory,
  FolderAdapter,
  OverlayFS,
  CodeHost,
  FileIndexSystem,
};

// Make sure all backends cast to FileSystemConstructor (for type checking)
const _: { [name: string]: FileSystemConstructor } = Backends;
_;

function patchCreateForCheck(fsType: FileSystemConstructor) {
  const create = fsType.Create;
  fsType.Create = function (opts?: any, cb?: BFSCallback<FileSystem>): void {
    const oneArg = typeof opts === 'function';
    const normalizedCb = oneArg ? opts : cb;
    const normalizedOpts = oneArg ? {} : opts;

    function wrappedCb(e?: Errors.ApiError): void {
      if (e) {
        normalizedCb(e);
      } else {
        if (fsType.Name === OverlayFS.Name) {
          normalizedOpts.storeName ||= WORKSPACE_IDB_NAME;
        }
        create.call(fsType, normalizedOpts, normalizedCb);
      }
    }

    checkOptions(fsType, normalizedOpts, wrappedCb);
  };
}

Object.keys((key) => patchCreateForCheck(Backends[key]));

function initialize(rootfs: FileSystem) {
  return fs.initialize(rootfs);
}

export type FileSystemConfiguration =
  | { fs: 'MountableFileSystem'; options: { [mountPoint: string]: FileSystemConfiguration } }
  | {
      fs: 'OverlayFS';
      options: { writable: FileSystemConfiguration; readable: FileSystemConfiguration };
    }
  | { fs: 'IndexedDB'; options?: IndexedDBFileSystemOptions }
  | { fs: 'InMemory'; options?: FileSystemOptions }
  | { fs: 'FolderAdapter'; options: { folder: string; wrapped: FileSystemConfiguration } }
  | { fs: 'CodeHost'; options: CodeHostOptions }
  | { fs: 'CodeHostOverlay'; options: CodeHostOptions }
  | { fs: 'FileIndexSystem'; options: FileIndexSystemOptions };

async function configure(config: FileSystemConfiguration) {
  const fs = await getFileSystem(config);
  if (fs) {
    initialize(fs);
  }
}

function createFileSystem<T extends FileSystemConstructor>(
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

/**
 * Retrieve a file system with the given configuration.
 * @param config A FileSystemConfiguration object. See FileSystemConfiguration for details.
 */
async function getFileSystem({ fs, options }: FileSystemConfiguration): Promise<FileSystem> {
  if (!fs) {
    throw new Errors.ApiError(
      Errors.ErrorCode.EPERM,
      'Missing "fs" property on configuration object.'
    );
  }

  if (options !== null && typeof options === 'object') {
    const props = Object.keys(options).filter((k) => k !== 'fs');
    // Check recursively if other fields have 'fs' properties.
    try {
      await Promise.all(
        props.map(async (p) => {
          const d = options[p];
          if (d !== null && typeof d === 'object' && d.fs) {
            options[p] = await getFileSystem(d);
          }
        })
      );
    } catch (e) {
      throw e;
    }
  }

  const fsc = Backends[fs];
  if (!fsc) {
    throw new Errors.ApiError(
      Errors.ErrorCode.EPERM,
      `File system ${fs} is not available in BrowserFS.`
    );
  } else {
    return createFileSystem(fsc, options || {});
  }
}

function addFileSystemType(name: string, fsType: FileSystemConstructor) {
  patchCreateForCheck(fsType);
  Backends[name] = fsType;
}

export { fs, FileSystem };

export const BrowserFS = {
  initialize,
  configure,
  addFileSystemType,
  createFileSystem,
  getFileSystem,
  FileSystem: Backends,
};
