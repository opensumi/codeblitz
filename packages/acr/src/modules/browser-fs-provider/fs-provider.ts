import {
  IDiskFileProvider,
  FileChangeEvent,
  FileStat,
  FileType,
  FileSystemError,
  isErrnoException,
  notEmpty,
} from '@ali/ide-file-service';
import {
  Emitter,
  IDisposable,
  Event,
  URI,
  FileUri,
  Uri,
  combinedDisposable,
} from '@ali/ide-core-common';
import * as paths from '@ali/ide-core-common/lib/path';
import { ParsedPattern, parse } from '@ali/ide-core-common/lib/utils/glob';
import { BinaryBuffer } from '@ali/ide-core-common/lib/utils/buffer';

import bfs, { FSStat, BROWSER_FS_HOME_DIR } from '../../common/file-system';
import { FsWatcher } from './fs-watcher';

interface BrowserFsProviderOptions {
  isReadonly?: boolean;
}

// 利用storage来记录文件已加载的信息，dispose时记得清楚
export class BrowserFsProvider implements IDiskFileProvider {
  static binaryExtList = [
    'aac',
    'avi',
    'bmp',
    'flv',
    'm1v',
    'm2a',
    'm2v',
    'm3a',
    'mid',
    'midi',
    'mk3d',
    'mks',
    'mkv',
    'mov',
    'movie',
    'mp2',
    'mp2a',
    'mp3',
    'mp4',
    'mp4a',
    'mp4v',
    'mpe',
    'mpeg',
    'mpg',
    'mpg4',
    'mpga',
    'oga',
    'ogg',
    'ogv',
    'psd',
    'qt',
    'spx',
    'tga',
    'tif',
    'tiff',
    'wav',
    'webm',
    'webp',
    'wma',
    'wmv',
    'woff',
  ];

  private _onDidChangeFile: Emitter<FileChangeEvent> = new Emitter();
  public get onDidChangeFile(): Event<FileChangeEvent> {
    return this._onDidChangeFile.event;
  }

  private readonly watcherDisposerMap = new Map<number, IDisposable>();
  protected watchFileExcludes: string[] = [];
  protected watchFileExcludesMatcherList: ParsedPattern[] = [];
  private fileWatcher: FsWatcher;

  constructor(private options: BrowserFsProviderOptions) {
    if (!this.fileWatcher) {
      this.fileWatcher = new FsWatcher();
    }
  }

  public dispose() {
    this.watcherDisposerMap.forEach((value) => {
      value.dispose();
    });
    this.watcherDisposerMap.clear();
  }

  /* --- watch 实现的部分实现参考了很多 node 的 fs-watcher --- */
  watch(uri: Uri, options: { recursive: boolean; excludes: string[] }): number {
    let watcherId;
    const _uri = Uri.revive(uri);
    const watchPromise = this.fileWatcher
      .watchFileChanges(_uri.toString(), {
        excludes: options && options.excludes ? options.excludes : [],
      })
      .then((id) => (watcherId = id));

    const filesChangedDisposable = this.fileWatcher.onDidFilesChanged((events) => {
      const filteredChanges = events.changes.filter((file) => {
        const uri = new URI(file.uri);
        const uriString = uri.withoutScheme().toString();
        return !this.watchFileExcludesMatcherList.some((match) => match(uriString));
      });

      if (filteredChanges.length) {
        this._onDidChangeFile.fire(filteredChanges);
      }
    });

    const disposable = {
      dispose: () => {
        if (!watcherId) {
          return watchPromise.then((id) => {
            this.fileWatcher.unwatchFileChanges(id);
          });
        }
        this.fileWatcher.unwatchFileChanges(watcherId);
      },
    };
    this.watcherDisposerMap.set(
      watcherId,
      combinedDisposable([filesChangedDisposable, disposable])
    );
    return watcherId;
  }

  unwatch(watcherId: number) {
    const disposable = this.watcherDisposerMap.get(watcherId);
    if (!disposable || !disposable.dispose) {
      return;
    }
    disposable.dispose();
  }

  // 出于通信成本的考虑，排除文件的逻辑必须放在node层（fs provider层，不同的fs实现的exclude应该不一样）
  setWatchFileExcludes(excludes: string[]) {
    this.watchFileExcludes = excludes;
    this.watchFileExcludesMatcherList = excludes.map((pattern) => parse(pattern));
  }

  getWatchFileExcludes() {
    return this.watchFileExcludes;
  }
  /* --- 未实现的部分 --- */

  async stat(uri: Uri): Promise<FileStat> {
    const _uri = new URI(uri);
    // @ts-ignore
    return this.doGetStat(_uri, 1).catch((err) => {
      // console.error(err, 'fs-provider.stat');
      return undefined;
    });
  }

  async readDirectory(uri: Uri): Promise<[string, FileType][]> {
    const result: [string, FileType][] = [];
    try {
      const dirList = await bfs.readdir(uri.fsPath);

      for (const name of dirList as string[]) {
        const filePath = paths.join(uri.fsPath, name);
        result.push([name, this.getFileStatType(await bfs.stat(filePath))]);
      }
      return result;
    } catch (e) {
      return result;
    }
  }

  async createDirectory(uri: Uri): Promise<FileStat> {
    const _uri = new URI(uri);
    const stat = await this.doGetStat(_uri, 0);
    if (stat) {
      if (stat.isDirectory) {
        return stat;
      }
      throw FileSystemError.FileExists(
        uri.path,
        'Error occurred while creating the directory: path is a file.'
      );
    }
    await bfs.ensureDir(FileUri.fsPath(_uri));
    return (await this.doGetStat(_uri, 0)) as FileStat;
  }

  async readFile(uri: Uri): Promise<Uint8Array> {
    const _uri = new URI(uri);
    // fs provider 里面只暴露操作文件的方法，不负责处理远端文件
    // 远端文件应由业务逻辑层去处理
    // @ts-ignore
    const content = (await bfs.readFile(FileUri.fsPath(_uri), { encoding: 'utf8' })) as string;
    return BinaryBuffer.fromString(content!).buffer;
  }

  async writeFile(
    uri: Uri,
    buffer: Uint8Array,
    options: { create: boolean; overwrite: boolean }
  ): Promise<void | FileStat> {
    const content = BinaryBuffer.wrap(buffer).toString();
    this.checkCapability();

    const _uri = new URI(uri);
    const exists = await this.access(uri);

    if (exists && !options.overwrite) {
      throw FileSystemError.FileExists(_uri.toString());
    } else if (!exists && !options.create) {
      throw FileSystemError.FileNotFound(_uri.toString());
    }

    if (options.create) {
      return await this.createFile(uri, { content });
    }
    await bfs.writeFile(FileUri.fsPath(_uri), content);
  }

  // FIXME: 删除文件怎么通知远端的？因为目前我们是做差量的，因此不太存在这种情况
  async delete(
    uri: Uri,
    options: { recursive: boolean; moveToTrash?: boolean | undefined }
  ): Promise<void> {
    this.checkCapability();
    return await bfs.unlink(uri.fsPath);
  }

  // FIXME: 看不懂
  async rename(
    oldUri: Uri,
    newUri: Uri,
    options: { overwrite: boolean }
  ): Promise<void | FileStat> {
    this.checkCapability();
    // const content = await this.readFile(oldUri);
    return await bfs.rename(oldUri.fsPath, newUri.fsPath);
  }

  async access(uri: Uri): Promise<boolean> {
    const _uri = new URI(uri);
    return bfs.exists(FileUri.fsPath(_uri));
  }

  async copy(
    source: Uri,
    destination: Uri,
    options: { overwrite: boolean }
  ): Promise<void | FileStat> {
    this.checkCapability();
    const content = await this.readFile(source);
    await bfs.writeFile(destination.fsPath, content);
  }

  private homeStat: FileStat | undefined;
  async getCurrentUserHome(): Promise<FileStat | undefined> {
    if (!this.homeStat) {
      this.homeStat = await this.stat(BROWSER_FS_HOME_DIR.codeUri);
    }
    return this.homeStat;
  }

  async getFileType(uri: string): Promise<string | undefined> {
    if (!uri.startsWith('file:/')) {
      return this._getFileType('');
    }

    try {
      const stat = await bfs.stat(FileUri.fsPath(uri));

      if (!stat.isDirectory()) {
        let ext = new URI(uri).path.ext;
        if (ext.startsWith('.')) {
          ext = ext.slice(1);
        }
        return this._getFileType(ext);
      } else {
        return 'directory';
      }
    } catch (error) {
      if (isErrnoException(error)) {
        if (
          error.code === 'ENOENT' ||
          error.code === 'EACCES' ||
          error.code === 'EBUSY' ||
          error.code === 'EPERM'
        ) {
          return undefined;
        }
      }
    }
  }

  protected checkCapability() {
    if (this.options && this.options.isReadonly) {
      throw new Error('FileSystem is readonly!');
    }
  }

  protected async createFile(uri: Uri, options: { content: string }): Promise<FileStat> {
    const _uri = new URI(uri);
    const parentUri = _uri.parent;
    const parentStat = await this.doGetStat(parentUri, 0);
    if (!parentStat) {
      await bfs.ensureDir(FileUri.fsPath(parentUri));
    }
    await bfs.writeFile(FileUri.fsPath(_uri), options.content);
    // TODO: 感觉没必要再取一次
    const newStat = await this.doGetStat(_uri, 1);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(uri.path, 'Error occurred while creating the file.');
  }

  protected getFileStatType(stat: FSStat) {
    if (stat.isDirectory()) {
      return FileType.Directory;
    }
    if (stat.isFile()) {
      return FileType.File;
    }
    if (stat.isSymbolicLink()) {
      return FileType.SymbolicLink;
    }
    return FileType.Unknown;
  }

  protected async doGetStat(uri: URI, depth: number): Promise<FileStat | undefined> {
    try {
      const filePath = FileUri.fsPath(uri);
      const lstat = await bfs.lstat(filePath);
      if (lstat.isDirectory()) {
        return await this.doCreateDirectoryStat(uri, lstat, depth);
      }
      const fileStat = await this.doCreateFileStat(uri, lstat);

      return fileStat;
    } catch (error: any) {
      if (
        error.code === 'ENOENT' ||
        error.code === 'EACCES' ||
        error.code === 'EBUSY' ||
        error.code === 'EPERM'
      ) {
        return undefined;
      }
      throw error;
    }
  }

  protected async doCreateFileStat(uri: URI, stat: FSStat): Promise<FileStat> {
    // Then stat the target and return that
    // const isLink = !!(stat && stat.isSymbolicLink());
    // if (isLink) {
    //   stat = await fs.stat(FileUri.fsPath(uri));
    // }

    return {
      uri: uri.toString(),
      lastModification: stat.mtimeMs,
      createTime: stat.ctimeMs,
      isSymbolicLink: stat.isSymbolicLink(),
      isDirectory: stat.isDirectory(),
      size: stat.size,
      type: this.getFileStatType(stat),
    };
  }

  protected async doCreateDirectoryStat(uri: URI, stat: FSStat, depth: number): Promise<FileStat> {
    const children = depth > 0 ? await this.doGetChildren(uri, depth) : [];
    return {
      uri: uri.toString(),
      lastModification: stat.mtimeMs,
      createTime: stat.ctimeMs,
      isDirectory: true,
      isSymbolicLink: stat.isSymbolicLink(),
      children,
    };
  }

  protected async doGetChildren(uri: URI, depth: number): Promise<FileStat[]> {
    const files = await bfs.readdir(FileUri.fsPath(uri));
    const children = await Promise.all(
      files.map((fileName) => this.doGetStat(uri.resolve(fileName), depth - 1))
    );
    return children.filter(notEmpty) as FileStat[];
  }

  private _getFileType(ext: string) {
    let type = 'text';

    if (['png', 'gif', 'jpg', 'jpeg', 'svg'].indexOf(ext) > -1) {
      type = 'image';
    } else if (BrowserFsProvider.binaryExtList.indexOf(ext) > -1) {
      type = 'binary';
    }

    return type;
  }
}
