import * as Errors from '@codeblitzjs/ide-browserfs/lib/core/api_error';
import {
  BFSCallback,
  FileSystem,
  FileSystemConstructor,
  FileSystemOptions,
} from '@codeblitzjs/ide-browserfs/lib/core/file_system';
import fs from '@codeblitzjs/ide-browserfs/lib/core/node_fs';
import { FileType } from '@codeblitzjs/ide-browserfs/lib/core/node_fs_stats';
import { checkOptions } from '@codeblitzjs/ide-browserfs/lib/core/util';

import DynamicRequest, { DynamicRequestOptions } from '@codeblitzjs/ide-browserfs/lib/backend/DynamicRequest';
import FolderAdapter, { FolderAdapterOptions } from '@codeblitzjs/ide-browserfs/lib/backend/FolderAdapter';
import IndexedDB, { IndexedDBFileSystemOptions } from '@codeblitzjs/ide-browserfs/lib/backend/IndexedDB';
import InMemory from '@codeblitzjs/ide-browserfs/lib/backend/InMemory';
import MountableFileSystem, {
  MountableFileSystemOptions,
} from '@codeblitzjs/ide-browserfs/lib/backend/MountableFileSystem';
import OverlayFS, { deletionLogPath, OverlayFSOptions } from '@codeblitzjs/ide-browserfs/lib/backend/OverlayFS';
import ZipFS, { ZipFSOptions } from '@codeblitzjs/ide-browserfs/lib/backend/ZipFS';
import { WORKSPACE_IDB_NAME } from '../../../common';
import { Editor, EditorOptions } from './Editor';
import { FileIndexSystem, FileIndexSystemOptions } from './FileIndex';

export type {
  deletionLogPath as browserfsDeletionLogPath,
  DynamicRequestOptions,
  FileIndexSystemOptions,
  FolderAdapterOptions,
  IndexedDBFileSystemOptions,
  MountableFileSystemOptions,
  OverlayFSOptions,
};

export { FileType as BrowserFSFileType };

export type { EditorOptions } from './Editor';
export type { FileIndex as FileIndexType } from './FileIndex';

const Backends = {
  MountableFileSystem,
  IndexedDB,
  InMemory,
  FolderAdapter,
  OverlayFS,
  FileIndexSystem,
  Editor,
  DynamicRequest,
  ZipFS,
};

// Make sure all backends cast to FileSystemConstructor (for type checking)
const _: { [name: string]: FileSystemConstructor } = Backends;
_;

function patchCreateForCheck(fsType: FileSystemConstructor) {
  const create = fsType.Create;
  fsType.Create = function(opts?: any, cb?: BFSCallback<FileSystem>): void {
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
  | { fs: 'FileIndexSystem'; options: FileIndexSystemOptions }
  | { fs: 'Editor'; options: EditorOptions }
  | { fs: 'DynamicRequest'; options: DynamicRequestOptions }
  | { fs: 'ZipFS'; options: ZipFSOptions };

async function configure(config: FileSystemConfiguration) {
  const fs = await getFileSystem(config);
  if (fs) {
    initialize(fs);
  }
}

function createFileSystem<T extends FileSystemConstructor>(
  FileSystemClass: T,
  options: Parameters<T['Create']>[0],
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
      'Missing "fs" property on configuration object.',
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
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  const fsc = Backends[fs];
  if (!fsc) {
    throw new Errors.ApiError(
      Errors.ErrorCode.EPERM,
      `File system ${fs} is not available in BrowserFS.`,
    );
  } else {
    return createFileSystem(fsc, options || {});
  }
}

function addFileSystemType(name: string, fsType: FileSystemConstructor) {
  patchCreateForCheck(fsType);
  Backends[name] = fsType;
}

export { FileSystem, fs };

export const BrowserFS = {
  initialize,
  configure,
  addFileSystemType,
  createFileSystem,
  getFileSystem,
  FileSystem: Backends,
};

export type SupportFileSystem = keyof typeof Backends;

type InstanceType<T> = T extends { Create(options: object, cb: BFSCallback<infer R>): void } ? R
  : any;

export type FileSystemInstance<T extends SupportFileSystem> = InstanceType<(typeof Backends)[T]>;
