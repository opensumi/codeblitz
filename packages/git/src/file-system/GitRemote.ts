import {
  BaseFileSystem,
  FileSystem,
  BFSCallback,
  FileSystemOptions,
  BFSOneArgCallback,
} from 'browserfs/dist/node/core/file_system';
import { ApiError, ErrorCode } from 'browserfs/dist/node/core/api_error';
import { FileFlag, ActionType } from 'browserfs/dist/node/core/file_flag';
import { copyingSlice } from 'browserfs/dist/node/core/util';
import { File } from 'browserfs/dist/node/core/file';
import Stats, { FileType } from 'browserfs/dist/node/core/node_fs_stats';
import { NoSyncFile } from 'browserfs/dist/node/generic/preload_file';
import {
  FileIndex,
  isFileInode,
  isDirInode,
  FileInode,
  DirInode,
} from 'browserfs/dist/node/generic/file_index';
import { dirname } from 'path';

/**
 * Try to convert the given buffer into a string, and pass it to the callback.
 * Optimization that removes the needed try/catch into a helper function, as
 * this is an uncommon case.
 * @hidden
 */
function tryToString(buff: Buffer, encoding: string, cb: BFSCallback<string>) {
  try {
    cb(null, buff.toString(encoding as BufferEncoding));
  } catch (e) {
    cb(e);
  }
}

/**
 * Configuration options for a HTTPRequest file system.
 */
export interface GitRemoteOptions {
  requestStat: AsyncRequestMethod<FileEntry>;
  requestDir: AsyncRequestMethod<FileEntry[]>;
  requestFile: AsyncRequestMethod<Buffer>;
  requestFileSize: AsyncRequestMethod<number>;
}

interface FileEntry {
  id: string;
  name: string;
  path: string;
  type: 'commit' | 'tree' | 'blob';
  mode: string;
}

type Callback<T> = (e: Error | null | undefined, rv?: T) => any;

interface AsyncRequestMethod<T = any> {
  (p: string, cb: Callback<T>): void;
}

function cloneStats(s: Stats): Stats {
  return new Stats(s.mode & 0xf000, s.size, s.mode & 0xfff, s.atime, s.mtime, s.ctime);
}

/**
 * 基于 Git 远程仓库接口的只读文件系统
 * 在请求时会自动缓存节点，节点采用动态请求的方式
 */
export default class GitRemote extends BaseFileSystem implements FileSystem {
  public static readonly Name = 'GitRemote';

  public static readonly Options: FileSystemOptions = {
    requestStat: {
      type: 'function',
      description: 'API for get file stat',
    },
    requestDir: {
      type: 'function',
      description: 'API for get dir',
    },
    requestFile: {
      type: 'function',
      description: 'API for get file content',
    },
    requestFileSize: {
      type: 'function',
      description: 'API for get file content size',
    },
  };

  /**
   * Construct an GitRemote file system backend with the given options.
   * 可通过接口一次性加载所有文件，但对于工程较大时耗时较长，因此采用按需加载方式，初始只加载根目录
   */
  public static Create(opts: GitRemoteOptions, cb: BFSCallback<GitRemote>): void {
    const fs = new GitRemote(opts);
    fs._loadDir('/', (e) => {
      if (e) {
        cb(e);
      } else {
        cb(null, fs);
      }
    });
  }

  public static isAvailable(): boolean {
    return true;
  }

  public readonly prefixUrl: string;
  private _index: FileIndex<{}>;
  private _requestStat: AsyncRequestMethod<FileEntry>;
  private _requestDir: AsyncRequestMethod<FileEntry[]>;
  private _requestFile: AsyncRequestMethod<Buffer>;
  private _requestFileSize: AsyncRequestMethod<number>;

  private constructor(opts: GitRemoteOptions) {
    super();
    this._index = new FileIndex();
    this._requestStat = opts.requestStat;
    this._requestDir = opts.requestDir;
    this._requestFile = opts.requestFile;
    this._requestFileSize = opts.requestFileSize;
  }

  public empty(): void {
    this._index.fileIterator(function (file: Stats) {
      file.fileData = null;
    });
  }

  public getName(): string {
    return GitRemote.Name;
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
    // 可以通过 XHR 来支持同步请求，通常业务并不需要，目前不支持同步，后续视实际情况决定
    return false;
  }

  /**
   * Special HTTPFS function: Preload the given file into the index.
   * @param [String] path
   * @param [BrowserFS.Buffer] buffer
   */
  public preloadFile(path: string, buffer: Buffer): void {
    const inode = this._index.getInode(path);
    if (isFileInode<Stats>(inode)) {
      if (inode === null) {
        throw ApiError.ENOENT(path);
      }
      const stats = inode.getData();
      stats.size = buffer.length;
      stats.fileData = buffer;
    } else {
      throw ApiError.EISDIR(path);
    }
  }

  /**
   * 加载文件节点，会递归加载所有未加载的父节点
   * @param path 文件路径
   */
  private _loadEntry(path: string, shouldLoadDir: boolean, cb: BFSOneArgCallback): void {
    let inode = this._index.getInode(path);
    if (inode) {
      if (shouldLoadDir) {
        return this._loadDir(path, cb);
      }
      return cb();
    }
    const statBeforeLoad = () => {
      // 一级目录是预先加载的，所以如果一级目录不存在，那么 git 中标明无此文件
      // 可以防止 .kaitian/ 等文件请求导致 404
      const i = path.indexOf('/', 1);
      if (i === -1) {
        return cb();
      }
      const rootDir = path.slice(0, i);
      inode = this._index.getInode(rootDir);
      if (!inode) {
        return cb();
      }
      // 请求远程是否有这个文件，有则递归加载父目录
      this._requestStat(path, (e, entry) => {
        if (e || !entry) {
          return cb();
        }
        if (entry.type === 'tree') {
          this._loadIndex(path, cb);
        } else if (entry.type === 'blob') {
          const dirpath = dirname(path);
          this._loadIndex(dirpath, cb);
        } else {
          // type=commit 只存在根目录，当做文件处理
          cb();
        }
      });
    };
    // TODO: 递归加载索引节点前是否需要先判断
    // 对于正常情况，无需判断，因为文件存在还是需递归加载
    // 对于文件不存在的情况，在路径较深的情况下，需递归加载父节点，因此此时 stat 会比较慢
    // 先不预先 stat，实际观察如果长路径不存在情况较多，再加上判断
    return this._loadIndex(path, cb);
  }

  /**
   * 加载索引节点，递归加载父目录
   * @param path
   * @param cb
   */
  private _loadIndex(path: string, cb: BFSOneArgCallback): void {
    const pathList = path.split('/');
    const next = (i: number) => {
      if (i >= pathList.length) {
        return cb();
      }
      const p = pathList.slice(0, i + 1).join('/');
      const inode = this._index.getInode(p);
      if (!inode) {
        return cb();
      }
      if (isFileInode(inode)) {
        return cb();
      }
      this._loadDir(p, () => next(i + 1));
    };
    next(1);
  }

  /**
   * 加载目录子文件
   * @param path
   * @param cb
   */
  private _loadDir(path: string, cb: BFSCallback<boolean>) {
    const inode = this._index.getInode(path);
    if (!isDirInode(inode)) {
      return cb(null, false);
    }
    if (inode.getListing().length) {
      return cb(null, true);
    }
    this._requestDir(path, (e, entryList) => {
      if (e) {
        cb(new ApiError(ErrorCode.EINVAL, e.message));
      }
      entryList?.forEach((item) => {
        const node =
          item.type === 'tree'
            ? new DirInode()
            : new FileInode(new Stats(FileType.FILE, -1, +item.mode));
        let p = item.path;
        if (p[0] !== '/') {
          p = `/${p}`;
        }
        this._index.addPathFast(p, node);
      });
      cb(null, true);
    });
  }

  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    const inode = this._index.getInode(path);
    if (inode === null) {
      return cb(ApiError.ENOENT(path));
    }
    let stats: Stats;
    if (isFileInode<Stats>(inode)) {
      stats = inode.getData();
      // At this point, a non-opened file will still have default stats from the listing.
      if (stats.size < 0) {
        // TODO: stat 时 size 重要吗，是否需要 HEAD Content-Length，必须的话再去掉注释
        cb(null, cloneStats(stats));
        // this._requestFileSize(path, function(e: Error, size?: number) {
        //   if (e) {
        //     return cb(new ApiError(ErrorCode.EINVAL, e.message));
        //   }
        //   stats.size = size!;
        //   cb(null, cloneStats(stats));
        // });
      } else {
        cb(null, cloneStats(stats));
      }
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
    const inode = this._index.getInode(path);
    if (inode === null) {
      return cb(ApiError.ENOENT(path));
    }
    if (isFileInode<Stats>(inode)) {
      const stats = inode.getData();
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          return cb(ApiError.EEXIST(path));
        case ActionType.NOP:
          // Use existing file contents.
          // XXX: Uh, this maintains the previously-used flag.
          if (stats.fileData) {
            return cb(null, new NoSyncFile(self, path, flags, cloneStats(stats), stats.fileData));
          }
          // @todo be lazier about actually requesting the file
          this._requestFile(path, function (err: ApiError, buffer?: Buffer) {
            if (err) {
              return cb(err);
            }
            // we don't initially have file sizes
            stats.size = buffer!.length;
            stats.fileData = buffer!;
            return cb(null, new NoSyncFile(self, path, flags, cloneStats(stats), buffer));
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
    } catch (e) {
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
    cb: BFSCallback<string | Buffer>
  ): void {
    // Wrap cb in file closing code.
    const oldCb = cb;
    // Get file.
    this.open(fname, flag, 0x1a4, function (err: ApiError, fd?: File) {
      if (err) {
        return cb(err);
      }
      cb = function (err: ApiError, arg?: Buffer) {
        fd!.close(function (err2: any) {
          if (!err) {
            err = err2;
          }
          return oldCb(err, arg);
        });
      };
      const fdCast = <NoSyncFile<GitRemote>>fd;
      const fdBuff = <Buffer>fdCast.getBuffer();
      if (encoding === null) {
        cb(err, copyingSlice(fdBuff));
      } else {
        tryToString(fdBuff, encoding, cb);
      }
    });
  }
}

['stat', 'open', 'readdir'].forEach((name: string) => {
  const _rawFn = GitRemote.prototype[name];
  GitRemote.prototype[name] = function (this: any, path: string, ...args: any) {
    const shouldLoadDir = name === 'readdir';
    this._loadEntry(path, shouldLoadDir, () => {
      _rawFn.call(this, path, ...args);
    });
  };
});
