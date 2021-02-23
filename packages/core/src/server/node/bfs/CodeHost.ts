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
  FileInode,
  DirInode,
  isFileInode,
  isDirInode,
} from 'browserfs/dist/node/generic/file_index';

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

export namespace CodeHostType {
  export type EntryFileType = 'commit' | 'tree' | 'blob';

  export interface TreeEntry extends Partial<EntryInfo> {
    /**
     * file mode
     */
    mode: string;
    /**
     * file type
     */
    type: EntryFileType;
    /**
     * object id
     */
    id: string;
    /**
     * file name
     */
    name: string;
    /**
     * full path
     */
    path: string;
  }

  /**
   * antcode, aone 用额外的请求获取 size 和 file type
   */
  export interface EntryInfo {
    /**
     * file size
     */
    size: number;
    /**
     * file type
     */
    fileType: 'binary' | 'text' | 'image';
  }

  export type EntryParam = Pick<TreeEntry, 'id' | 'path'>;
}

interface FileNodeExtend<T> extends FileInode<T> {
  _defer: Promise<void>;
  path: string;
  id: string;
  fileType?: string;
}

interface DirNodeExtend<T> extends DirInode<T> {
  path?: string;
  id: string;
}

type Callback<T> = (e: Error | null | undefined, rv?: T) => any;

export interface CodeHostOptions {
  readEntryInfo?(entry: CodeHostType.EntryParam, cb: Callback<CodeHostType.EntryInfo>): void;
  readTree(path: string, cb: Callback<CodeHostType.TreeEntry[]>): void;
  readBlob(entry: CodeHostType.EntryParam, cb: Callback<Buffer>): void;
}

/**
 * 基于代码托管服务接口的只读文件系统
 * 在请求时会自动缓存节点，节点采用动态请求的方式
 */
export class CodeHost extends BaseFileSystem implements FileSystem {
  public static readonly Name = 'CodeHost';

  public static readonly Options: FileSystemOptions = {
    readEntry: {
      type: 'function',
      description: 'API for get entry into, like size, type etc.',
      optional: true,
    },
    readTree: {
      type: 'function',
      description: 'API for get dir',
    },
    readBlob: {
      type: 'function',
      description: 'API for get file',
    },
  };

  /**
   * Construct an CodeHost file system backend with the given options.
   * 可通过接口一次性加载所有文件，但对于工程较大时耗时较长，因此采用按需加载方式，初始只加载根目录
   */
  public static Create(opts: CodeHostOptions, cb: BFSCallback<CodeHost>): void {
    const fs = new CodeHost(opts);
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
  private _readEntryInfo: CodeHostOptions['readEntryInfo'];
  private _readTree: CodeHostOptions['readTree'];
  private _readBlob: CodeHostOptions['readBlob'];

  public constructor(opts: CodeHostOptions) {
    super();
    this._index = new FileIndex();
    this._readEntryInfo = opts.readEntryInfo;
    this._readTree = opts.readTree;
    this._readBlob = opts.readBlob;
  }

  public empty(): void {
    this._index.fileIterator(function (file: Stats) {
      file.fileData = null;
    });
  }

  public getName(): string {
    return CodeHost.Name;
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
   * @param shouldLoadDir 是否需要加载目录，readdir 时需要
   */
  public loadEntry(path: string, shouldLoadDir: boolean, cb: BFSOneArgCallback): void {
    let inode = this._index.getInode(path);
    if (inode) {
      if (shouldLoadDir) {
        return this._loadDir(path, cb);
      }
      return cb();
    }
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
    this._readTree((inode as DirNodeExtend<null>).path || '', (e, entryList) => {
      if (e) {
        return cb(new ApiError(ErrorCode.EINVAL, e.message));
      }
      entryList?.forEach((item) => {
        const size = typeof item.size === 'number' && item.size >= 0 ? item.size : -1;
        let node: FileNodeExtend<Stats> | DirNodeExtend<null>;
        if (item.type === 'blob') {
          node = new FileInode(new Stats(FileType.FILE, size, +item.mode)) as FileNodeExtend<Stats>;
          node.path = item.path;
          node.id = item.id;
          node.fileType = item.fileType;
        } else {
          // TODO: submodule type 为 commit，当做文件夹处理，是否需要更好的展示方式
          node = new DirInode() as DirNodeExtend<null>;
          node.path = item.path;
          node.id = item.id;
        }
        let p = item.path;
        if (p[0] !== '/') {
          p = `/${p}`;
        }
        this._index.addPathFast(p, node);
      });
      cb(null, true);
    });
  }

  public async getFileType(path: string): Promise<string | undefined> {
    if (!this._readEntryInfo) return;
    const inode = this._index.getInode(path);
    if (inode === null || isDirInode<null>(inode)) return;
    const fileNode = inode as FileNodeExtend<Stats>;
    if (!fileNode._defer) {
      fileNode._defer = new Promise((resolve) => {
        this._readEntryInfo!(
          { id: fileNode.id, path: fileNode.path },
          function (e: Error, data: CodeHostType.EntryInfo) {
            if (!e) {
              fileNode.fileType = data.fileType;
              fileNode.getData().size = data.size;
            }
            resolve();
          }
        );
      });
    }
    await fileNode._defer;
    return fileNode.fileType;
  }

  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    const inode = this._index.getInode(path);
    if (inode === null) {
      return cb(ApiError.ENOENT(path));
    }
    let stats: Stats;
    if (isFileInode<Stats>(inode)) {
      stats = inode.getData();
      cb(null, stats.clone());
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
            return cb(null, new NoSyncFile(self, path, flags, stats.clone(), stats.fileData));
          }
          // @todo be lazier about actually requesting the file
          const fileNode = inode as FileNodeExtend<Stats>;
          this._readBlob(
            { id: fileNode.id, path: fileNode.path },
            function (err: ApiError, buffer?: Buffer) {
              if (err) {
                return cb(err);
              }
              // we may don't initially have file sizes
              stats.size = buffer!.length;
              stats.fileData = buffer!;
              return cb(null, new NoSyncFile(self, path, flags, stats.clone(), buffer));
            }
          );
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
      const fdCast = <NoSyncFile<CodeHost>>fd;
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
  const _rawFn = CodeHost.prototype[name];
  CodeHost.prototype[name] = function (this: CodeHost, path: string, ...args: any) {
    const shouldLoadDir = name === 'readdir';
    this.loadEntry(path, shouldLoadDir, () => {
      _rawFn.call(this, path, ...args);
    });
  };
});
