import {
  BaseFileSystem,
  FileSystem,
  BFSCallback,
  FileSystemOptions,
} from 'browserfs/dist/node/core/file_system';
import { ApiError, ErrorCode } from 'browserfs/dist/node/core/api_error';

export interface LazyFSOptions {
  // The file system to wrap.
  wrapped: () => Promise<FileSystem>;
}

/**
 * 懒初始化文件系统
 * 在首次调用 API 时才初始化，可不阻塞应用启动
 */
export class LazyFS extends BaseFileSystem implements FileSystem {
  public static readonly Name = 'LazyFS';

  public static readonly Options: FileSystemOptions = {
    wrapped: {
      type: 'function',
      description: 'The file system to wrap',
    },
  };

  public static Create(opts: LazyFSOptions, cb: BFSCallback<LazyFS>): void {
    cb(null, new LazyFS(opts.wrapped));
  }
  public static isAvailable(): boolean {
    return true;
  }

  public _wrapped: () => Promise<FileSystem>;

  _fsPromise: Promise<FileSystem> | null = null;

  private _fs: FileSystem;

  public get fsPromise() {
    if (!this._fsPromise) {
      this._fsPromise = this._wrapped();
      this._fsPromise.then((fs) => {
        this._fs = fs;
      });
    }
    return this._fsPromise;
  }

  public resetFS() {
    this._fsPromise = null;
  }

  /**
   * @param wrapped The file system to wrap.
   */
  constructor(wrapped: () => Promise<FileSystem>) {
    super();
    this._wrapped = wrapped;
  }

  public getName(): string {
    if (!this._fs) {
      throw new Error('[LazyFS]: fs is not ready');
    }
    return this._fs.getName();
  }
  public isReadOnly(): boolean {
    if (!this._fs) {
      throw new Error('[LazyFS]: fs is not ready');
    }
    return this._fs.isReadOnly();
  }
  public supportsProps(): boolean {
    if (!this._fs) {
      throw new Error('[LazyFS]: fs is not ready');
    }
    return this._fs.supportsProps();
  }
  public supportsSynch(): boolean {
    return false;
  }
  public supportsLinks(): boolean {
    return false;
  }
}

/**
 * @hidden
 */
function wrapFunction(name: string): Function {
  return function (this: LazyFS, ...args: any[]) {
    const cb = args[args.length - 1];
    if (typeof cb !== 'function') {
      throw new Error(`[LazyFS]: ${name} is not async method`);
    }
    this.fsPromise
      .then((fs) => {
        fs[name](...args);
      })
      .catch((err) => {
        cb(
          new ApiError(
            ErrorCode.EINVAL,
            `failed initialize filesystem\n${String(err && err.message)}`
          )
        );
      });
  };
}

[
  'diskSpace',
  'stat',
  'open',
  'unlink',
  'rmdir',
  'mkdir',
  'readdir',
  'exists',
  'realpath',
  'truncate',
  'readFile',
  'writeFile',
  'appendFile',
  'chmod',
  'chown',
  'utimes',
  'readlink',
  'rename',
  'link',
  'symlink',
].forEach((name: string) => {
  (<any>LazyFS.prototype)[name] = wrapFunction(name);
});
