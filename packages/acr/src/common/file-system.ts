import FS from '@isomorphic-git/lightning-fs';
import PATH from '@isomorphic-git/lightning-fs/src/path';
import { debounce, URI, Emitter, Event } from '@ali/ide-core-common';
import { ensureDir as fsEnsureDir } from '@ali/ide-core-common/lib/browser-fs/ensure-dir';

// FS.Stats 从 browser-fs 实现导出, 因为 light-fs 实现跟真正的 node fs 实现不太一样
export type FSStat = FS.Stats;

// 唯一的 browser fs 实例
const fs = new FS('@alipay/acr-ide');

// https://github.com/isomorphic-git/isomorphic-git/blob/2e6198df39279b3804ef6be7e3801b8a230557db/src/models/FileSystem.js#L60-L77
async function pathExists(filepath: string) {
  try {
    await fs.promises.stat(filepath);
    return true;
  } catch (err: any) {
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
      return false;
    } else {
      console.log('Unhandled error in "pathExists()" function', err);
      throw err;
    }
  }
}

const ensureDir = (path: string) =>
  fsEnsureDir(path, {
    access: (path: string) => pathExists(path),
    mkdir: (path: string) => fs.promises.mkdir(path),
  });

async function realpath(path: string): Promise<string> {
  const stat = await fs.promises.lstat(path);
  if (stat.isSymbolicLink()) {
    return await fs.promises.readlink(path);
  }
  return path;
}

export const BROWSER_FS_HOME_DIR = URI.file('/browser_os_home');

type IBsfwEventPayload = IBsfwBasicEventPayload | IBsfwRenamedEventPayload;

export enum IBsfwAction {
  CREATED,
  DELETED,
  MODIFIED,
  RENAMED,
}

export interface IBsfwBasicEventPayload {
  action: IBsfwAction.CREATED | IBsfwAction.MODIFIED | IBsfwAction.DELETED;
  directory: string;
  file: string;
}

export interface IBsfwRenamedEventPayload {
  action: IBsfwAction.RENAMED;
  directory: string;
  oldFile: string;
  newDirectory: string;
  newFile: string;
}

// 目前来说没有办法区分开 created 和 modified，先统一按照 modified 来处理
// 因为目前主要是 preferenceService/user-storage 模块依赖了这里
class FileSystem {
  public readFile = fs.promises.readFile.bind(fs.promises);
  public writeFile = this._bfswHoc(fs.promises.writeFile, fs.promises, IBsfwAction.MODIFIED);
  public unlink = this._bfswHoc(fs.promises.unlink, fs.promises, IBsfwAction.DELETED);
  public rename = this._bfswHoc(fs.promises.rename, fs.promises, IBsfwAction.RENAMED);

  public mkdir = fs.promises.mkdir.bind(fs.promises);
  public rmdir = fs.promises.rmdir.bind(fs.promises);
  public stat = fs.promises.stat.bind(fs.promises);
  public lstat = fs.promises.lstat.bind(fs.promises);
  public readdir = fs.promises.readdir.bind(fs.promises);
  public readlink = fs.promises.readlink.bind(fs.promises);
  public symlink = fs.promises.symlink.bind(fs.promises);

  // 拓展的方法
  public exists = pathExists;
  public ensureDir = ensureDir;
  public realpath = realpath;

  private _eventQ: IBsfwEventPayload[] = [];
  private _onDidChangeEmitter: Emitter<IBsfwEventPayload[]> = new Emitter();
  // 分发事件
  public get onDidChange(): Event<IBsfwEventPayload[]> {
    return this._onDidChangeEmitter.event;
  }

  // decorator to intercept operations
  private _bfswHoc<T extends (...args: any[]) => any>(
    fn: T,
    that: any,
    action?: IBsfwAction
  ): (...args: Parameters<T>) => ReturnType<T> {
    // 不需要监听的直接调用 bind this 即可
    if (!action) {
      return fn.bind(that);
    }

    return (...args: Parameters<T>): ReturnType<T> => {
      return fn.apply(that, args).then((ret) => {
        this._dispatchEvent(action, args);
        return ret;
      });
    };
  }

  private _dispatchEvent(action: IBsfwAction, args: any[]) {
    switch (action) {
      case IBsfwAction.CREATED:
      case IBsfwAction.MODIFIED:
      case IBsfwAction.DELETED:
        const fsPath0 = args[0] as string;
        this._eventQ.push({
          action,
          directory: PATH.dirname(fsPath0),
          file: PATH.basename(fsPath0),
        } as IBsfwBasicEventPayload);
        this._fireFileChanges();
        break;
      case IBsfwAction.RENAMED:
        const oldFsPath = args[0] as string;
        const newFsPath = args[1] as string;
        this._eventQ.push({
          action: IBsfwAction.RENAMED,
          directory: PATH.dirname(oldFsPath),
          oldFile: PATH.basename(oldFsPath),
          newDirectory: PATH.dirname(newFsPath),
          newFile: PATH.basename(newFsPath),
        } as IBsfwRenamedEventPayload);
        this._fireFileChanges();
        break;
      default:
        break;
    }
  }

  @debounce(100)
  private _fireFileChanges() {
    if (this._eventQ.length) {
      const events = this._eventQ;
      this._eventQ = [] as IBsfwEventPayload[];
      this._onDidChangeEmitter.fire(events);
    }
  }
}

export default new FileSystem();
