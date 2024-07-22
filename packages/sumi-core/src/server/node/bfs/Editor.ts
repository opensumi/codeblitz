import { ApiError, ErrorCode } from '@codeblitzjs/ide-browserfs/lib/core/api_error';
import { File } from '@codeblitzjs/ide-browserfs/lib/core/file';
import { ActionType, FileFlag } from '@codeblitzjs/ide-browserfs/lib/core/file_flag';
import {
  BaseFileSystem,
  BFSCallback,
  FileSystem,
  FileSystemOptions,
} from '@codeblitzjs/ide-browserfs/lib/core/file_system';
import Stats, { FileType } from '@codeblitzjs/ide-browserfs/lib/core/node_fs_stats';
import { copyingSlice } from '@codeblitzjs/ide-browserfs/lib/core/util';
import { FileIndex, FileInode, isDirInode, isFileInode } from '@codeblitzjs/ide-browserfs/lib/generic/file_index';
import { NoSyncFile } from '@codeblitzjs/ide-browserfs/lib/generic/preload_file';

/**
 * Try to convert the given buffer into a string, and pass it to the callback.
 * Optimization that removes the needed try/catch into a helper function, as
 * this is an uncommon case.
 * @hidden
 */
function tryToString(buff: Buffer, encoding: string, cb: BFSCallback<string>) {
  try {
    cb(null, buff.toString(encoding as BufferEncoding));
  } catch (e: any) {
    cb(e);
  }
}

const stripLeadingSlash = (path: string) => (path.charAt(0) === '/' ? path.substr(1) : path);

interface Thenable<T> {
  then<TResult>(
    onfulfilled?: (value: T) => TResult | Thenable<TResult>,
    onrejected?: (reason: any) => TResult | Thenable<TResult>,
  ): Thenable<TResult>;
  then<TResult>(
    onfulfilled?: (value: T) => TResult | Thenable<TResult>,
    onrejected?: (reason: any) => void,
  ): Thenable<TResult>;
}

function thenable<T>(value: any): value is Thenable<T> {
  return value && typeof value.then === 'function';
}

function asPromise<T>(value: T | Thenable<T>): Promise<T> {
  if (value instanceof Promise) {
    return value;
  } else if (thenable(value)) {
    return new Promise((resolve, reject) => {
      value.then(
        (resolved) => resolve(resolved),
        (error) => reject(error),
      );
    });
  } else {
    return Promise.resolve(value);
  }
}

export interface EditorOptions {
  /**
   * Read the entire contents of a file.
   *
   * @param path 相对工作空间路径
   * @return An array of bytes or a thenable that resolves to such.
   */
  readFile(path: string): Uint8Array | Thenable<Uint8Array>;
  disableCache?: boolean;
}

/**
 * 编辑器文件系统，只需提供文件的读取，提供文件夹的接口
 */
export class Editor extends BaseFileSystem implements FileSystem {
  public static readonly Name = 'Editor';

  public static readonly Options: FileSystemOptions = {
    readFile: {
      type: 'function',
      description: 'Read the entire contents of a file.e',
    },
  };

  public static Create(opts: EditorOptions, cb: BFSCallback<Editor>): void {
    const fs = new Editor(opts);
    cb(null, fs);
  }

  public static isAvailable(): boolean {
    return true;
  }

  public readonly prefixUrl: string;
  private _index: FileIndex<{}>;
  private _readFile: EditorOptions['readFile'];
  private _isDisableCache: EditorOptions['disableCache'];

  public constructor(opts: EditorOptions) {
    super();
    this._index = new FileIndex();
    this._readFile = opts.readFile;
    this._isDisableCache = opts.disableCache || false;
  }

  public empty(): void {
    this._index.fileIterator(function(file: Stats) {
      file.fileData = null;
    });
  }

  public getName(): string {
    return Editor.Name;
  }

  public diskSpace(path: string, cb: (total: number, free: number) => void): void {
    // Read-only file system. We could calculate the total space, but that's not
    // important right now.
    cb(0, 0);
  }

  public isReadOnly(): boolean {
    return true;
  }

  public supportsLinks(): boolean {
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    return false;
  }

  /**
   * stat 始终存在，我们只关心 readFile
   */
  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    let inode = this._index.getInode(path);
    if (inode === null) {
      inode = new FileInode(new Stats(FileType.FILE, -1, 0x16d));
      this._index.addPath(path, inode);
    }
    let stats: Stats;
    if (isFileInode<Stats>(inode)) {
      stats = inode.getData();
      cb(null, Stats.clone(stats));
    } else if (isDirInode(inode)) {
      stats = inode.getStats();
      cb(null, stats);
    } else {
      cb(ApiError.FileError(ErrorCode.EINVAL, path));
    }
  }

  public open(path: string, flags: FileFlag, mode: number, cb: BFSCallback<File>): void {
    // INVARIANT: You can't write to files on this file system.
    if (flags.isWriteable()) {
      return cb(new ApiError(ErrorCode.EPERM, path));
    }
    const self = this;
    // Check if the path exists, and is a file.
    let inode = this._index.getInode(path);
    if (inode === null) {
      inode = new FileInode(new Stats(FileType.FILE, -1, 0x16d));
      this._index.addPath(path, inode);
    }
    if (isFileInode<Stats>(inode)) {
      const stats = inode.getData();
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          return cb(ApiError.EEXIST(path));
        case ActionType.NOP:
          if (stats.fileData && !this._isDisableCache) {
            return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), stats.fileData));
          }
          asPromise(this._readFile(stripLeadingSlash(path)))
            .then((content) => {
              const buf = Buffer.from(content);
              stats.size = buf!.length;
              stats.fileData = buf!;
              return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), buf));
            })
            .catch((err) => {
              return cb(new ApiError(ErrorCode.EINVAL, err?.message || ''));
            });
          break;
        default:
          return cb(new ApiError(ErrorCode.EINVAL, 'Invalid FileMode object.'));
      }
    } else {
      return cb(ApiError.EISDIR(path));
    }
  }

  public readdir(path: string, cb: BFSCallback<string[]>): void {
    try {
      const inode = this._index.getInode(path);
      if (inode === null) {
        cb(ApiError.ENOENT(path));
      } else if (isDirInode(inode)) {
        cb(null, inode.getListing());
      } else {
        cb(ApiError.ENOTDIR(path));
      }
    } catch (e: any) {
      cb(e);
    }
  }

  /**
   * We have the entire file as a buffer; optimize readFile.
   */
  public readFile(
    fname: string,
    encoding: string,
    flag: FileFlag,
    cb: BFSCallback<string | Buffer>,
  ): void {
    // Wrap cb in file closing code.
    const oldCb = cb;
    // Get file.
    this.open(fname, flag, 0x1a4, function(err: ApiError, fd?: File) {
      if (err) {
        return cb(err);
      }
      cb = function(err: ApiError, arg?: Buffer) {
        fd!.close(function(err2: any) {
          if (!err) {
            err = err2;
          }
          return oldCb(err, arg);
        });
      };
      const fdCast = <NoSyncFile<Editor>> fd;
      const fdBuff = <Buffer> fdCast.getBuffer();
      if (encoding === null) {
        cb(err, copyingSlice(fdBuff));
      } else {
        tryToString(fdBuff, encoding, cb);
      }
    });
  }
}
