import { Autowired, Injectable } from '@opensumi/di';
import {
  DebugLog,
  DidFilesChangedParams,
  DisposableCollection,
  Emitter,
  Event,
  IDisposable,
  isUndefined,
  ParsedPattern,
  parseGlob as parse,
  URI,
  Uri,
  UriComponents,
} from '@opensumi/ide-core-common';
import {
  FileAccess,
  FileChangeEvent,
  FileMoveOptions,
  FileStat,
  FileSystemError,
  FileSystemProviderCapabilities,
  FileType,
  isErrnoException,
  notEmpty,
} from '@opensumi/ide-file-service/lib/common';
import * as path from 'path';
import { RuntimeConfig } from '../../common';
import { HOME_ROOT } from '../../common';
import { RPCService } from '../../connection';
import { fsExtra as fse, writeFileAtomic } from '../node';
import { IDiskFileProvider } from './base';
import { FWFileSystemWatcherServer } from './file-service-watcher';

const debugLog = new DebugLog();

// FIXME: 暂时只用单例
@Injectable()
export class DiskFileSystemProvider extends RPCService implements IDiskFileProvider {
  readonly capabilities: FileSystemProviderCapabilities;
  onDidChangeCapabilities = Event.None;
  private fileChangeEmitter = new Emitter<FileChangeEvent>();
  readonly onDidChangeFile: Event<FileChangeEvent> = this.fileChangeEmitter.event;
  protected toDispose = new DisposableCollection();

  private watcherServer: FWFileSystemWatcherServer;
  protected readonly watcherDisposerMap = new Map<number, IDisposable>();
  protected watchFileExcludes: string[] = [];
  protected watchFileExcludesMatcherList: ParsedPattern[] = [];

  @Autowired(RuntimeConfig)
  private runtimeConfig: RuntimeConfig;

  static H5VideoExtList = ['mp4', 'ogg', 'webm'];

  static BinaryExtList = [
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

  constructor() {
    super();
    this.initWatcher();
  }

  dispose(): void {
    this.toDispose.dispose();
  }

  /**
   * @param {Uri} uri
   * @param {{ excludes: string[] }} [options]  // 还不支持 recursive 参数
   * @returns {number}
   * @memberof DiskFileSystemProvider
   */
  async watch(uri: UriComponents, options?: { excludes?: string[] }): Promise<number> {
    const _uri = Uri.revive(uri);
    const watcherId = await this.watcherServer.watchFileChanges(_uri.toString(), {
      excludes: options && options.excludes ? options.excludes : [],
    });
    const disposable = {
      dispose: () => {
        this.watcherServer.unwatchFileChanges(watcherId);
      },
    };
    this.watcherDisposerMap.set(watcherId, disposable);
    return watcherId;
  }

  unwatch(watcherId: number) {
    const disposable = this.watcherDisposerMap.get(watcherId);
    if (!disposable || !disposable.dispose) {
      return;
    }
    disposable.dispose();
  }

  stat(uri: UriComponents): Promise<FileStat | undefined> {
    const _uri = Uri.revive(uri);
    return new Promise(async (resolve) => {
      this.doGetStat(_uri, 1)
        .then((stat) => {
          resolve(stat!);
        })
        .catch((e) => resolve(undefined as any));
    });
  }

  async readDirectory(uri: UriComponents): Promise<[string, FileType][]> {
    const result: [string, FileType][] = [];
    try {
      const dirList = await fse.readdir(uri.path);
      dirList.forEach(async (name) => {
        const filePath = path.join(uri.path, name);
        result.push([name, this.getFileStatType(await fse.stat(filePath))]);
      });
      return result;
    } catch (e) {
      return result;
    }
  }

  async createDirectory(uri: UriComponents): Promise<FileStat> {
    const _uri = Uri.revive(uri);
    const stat = await this.doGetStat(_uri, 0);
    if (stat) {
      if (stat.isDirectory) {
        return stat;
      }
      throw FileSystemError.FileExists(
        uri.path,
        'Error occurred while creating the directory: path is a file.',
      );
    }
    await fse.ensureDir(uri.path);
    const newStat = await this.doGetStat(_uri, 1);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(uri.path, 'Error occurred while creating the directory.');
  }

  async readFile(uri: UriComponents, encoding = 'utf8'): Promise<Uint8Array> {
    try {
      const buffer = await fse.readFile(uri.path);
      return buffer;
    } catch (error) {
      if (isErrnoException(error)) {
        if (error.code === 'ENOENT') {
          throw FileSystemError.FileNotFound(uri.path, 'Error occurred while reading file');
        }

        if (error.code === 'EISDIR') {
          throw FileSystemError.FileIsADirectory(
            uri.path,
            'Error occurred while reading file: path is a directory.',
          );
        }

        if (error.code === 'EPERM') {
          throw FileSystemError.FileIsNoPermissions(
            uri.path,
            'Error occurred while reading file: path is a directory.',
          );
        }
      }

      throw error;
    }
  }

  async writeFile(
    uri: UriComponents,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean; encoding?: string },
  ): Promise<void | FileStat> {
    const _uri = Uri.revive(uri);
    const exists = await this.access(uri);

    if (exists && !options.overwrite) {
      throw FileSystemError.FileExists(_uri.toString());
    } else if (!exists && !options.create) {
      throw FileSystemError.FileNotFound(_uri.toString());
    }
    const buffer = Buffer.from(content);

    if (options.create) {
      return await this.createFile(uri, { content: buffer });
    }

    await writeFileAtomic(uri.path, buffer);
  }

  access(uri: UriComponents, mode: number = FileAccess.Constants.F_OK): Promise<boolean> {
    return fse.pathExists(Uri.from(uri).path);
  }

  async delete(
    uri: UriComponents,
    options: { recursive?: boolean; moveToTrash?: boolean },
  ): Promise<void> {
    const _uri = Uri.revive(uri);
    const stat = await this.doGetStat(_uri, 0);
    if (!stat) {
      throw FileSystemError.FileNotFound(uri.path);
    }
    if (!isUndefined(options.recursive)) {
      debugLog.warn(`DiskFileSystemProvider not support options.recursive!`);
    }

    const filePath = uri.path;
    try {
      return fse.remove(filePath);
    } catch (err) {}
  }

  async rename(
    sourceUri: UriComponents,
    targetUri: UriComponents,
    options: { overwrite: boolean },
  ): Promise<FileStat> {
    return this.doMove(sourceUri, targetUri, options);
  }

  async copy(
    sourceUri: UriComponents,
    targetUri: UriComponents,
    options: { overwrite: boolean; recursive?: boolean },
  ): Promise<FileStat> {
    const _sourceUri = Uri.revive(sourceUri);
    const _targetUri = Uri.revive(targetUri);
    const [sourceStat, targetStat] = await Promise.all([
      this.doGetStat(_sourceUri, 0),
      this.doGetStat(_targetUri, 0),
    ]);
    const { overwrite, recursive } = options;

    if (!sourceStat) {
      throw FileSystemError.FileNotFound(sourceUri.path);
    }
    if (targetStat && !overwrite) {
      throw FileSystemError.FileExists(targetUri.path, 'Did you set the \'overwrite\' flag to true?');
    }
    if (targetStat && targetStat.uri === sourceStat.uri) {
      throw FileSystemError.FileExists(
        targetUri.path,
        'Cannot perform copy, source and destination are the same.',
      );
    }
    await fse.copy(_sourceUri.path, _targetUri.path, {
      overwrite,
      recursive,
    });
    const newStat = await this.doGetStat(_targetUri, 1);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(
      targetUri.path,
      `Error occurred while copying ${sourceUri} to ${targetUri}.`,
    );
  }

  async getCurrentUserHome(): Promise<FileStat | undefined> {
    return this.stat(Uri.file(HOME_ROOT));
  }

  setWatchFileExcludes(excludes: string[]) {
    debugLog.info('set watch file exclude:', excludes);
    this.watchFileExcludes = excludes;
    this.watchFileExcludesMatcherList = excludes.map((pattern) => parse(pattern));
  }

  getWatchFileExcludes() {
    return this.watchFileExcludes;
  }

  protected initWatcher() {
    this.watcherServer = new FWFileSystemWatcherServer({
      verbose: true,
    });
    this.watcherServer.setClient({
      onDidFilesChanged: (events: DidFilesChangedParams) => {
        const filteredChange = events.changes.filter((file) => {
          const uri = new URI(file.uri);
          const uriString = uri.path.toString();
          return !this.watchFileExcludesMatcherList.some((match) => match(uriString));
        });
        this.fileChangeEmitter.fire(filteredChange);
        if (this.client) {
          this.client.onDidFilesChanged({
            changes: filteredChange,
          });
        }
      },
    });
    this.toDispose.push({
      dispose: () => {
        this.watcherServer.dispose();
      },
    });
  }

  // Protected or private

  protected async createFile(uri: UriComponents, options: { content: Buffer }): Promise<FileStat> {
    await fse.outputFile(uri.path, options.content);
    const newStat = await this.doGetStat(Uri.revive(uri), 1);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(uri.path, 'Error occurred while creating the file.');
  }

  /**
   * Return `true` if it's possible for this URI to have children.
   * It might not be possible to be certain because of permission problems or other filesystem errors.
   */
  protected async mayHaveChildren(uri: Uri): Promise<boolean> {
    /* If there's a problem reading the root directory. Assume it's not empty to avoid overwriting anything.  */
    try {
      const rootStat = await this.doGetStat(uri, 0);
      if (rootStat === undefined) {
        return true;
      }
      /* Not a directory.  */
      if (rootStat !== undefined && rootStat.isDirectory === false) {
        return false;
      }
    } catch (error) {
      return true;
    }

    /* If there's a problem with it's children then the directory must not be empty.  */
    try {
      const stat = await this.doGetStat(uri, 1);
      if (stat !== undefined && stat.children !== undefined) {
        return stat.children.length > 0;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  protected async doMove(
    sourceUri: UriComponents,
    targetUri: UriComponents,
    options: FileMoveOptions,
  ): Promise<FileStat> {
    const _sourceUri = Uri.revive(sourceUri);
    const _targetUri = Uri.revive(targetUri);
    const [sourceStat, targetStat] = await Promise.all([
      this.doGetStat(_sourceUri, 1),
      this.doGetStat(_targetUri, 1),
    ]);
    const { overwrite } = options;
    if (!sourceStat) {
      throw FileSystemError.FileNotFound(sourceUri.path);
    }
    if (targetStat && !overwrite) {
      throw FileSystemError.FileExists(targetUri.path, 'Did you set the \'overwrite\' flag to true?');
    }

    // Different types. Files <-> Directory.
    if (targetStat && sourceStat.isDirectory !== targetStat.isDirectory) {
      if (targetStat.isDirectory) {
        throw FileSystemError.FileIsADirectory(
          targetStat.uri,
          `Cannot move '${sourceStat.uri}' file to an existing location.`,
        );
      }
      throw FileSystemError.FileNotADirectory(
        targetStat.uri,
        `Cannot move '${sourceStat.uri}' directory to an existing location.`,
      );
    }
    const [sourceMightHaveChildren, targetMightHaveChildren] = await Promise.all([
      this.mayHaveChildren(_sourceUri),
      this.mayHaveChildren(_targetUri),
    ]);
    if (
      overwrite
      && targetStat
      && targetStat.isDirectory
      && sourceStat.isDirectory
      && !sourceMightHaveChildren
      && !targetMightHaveChildren
    ) {
      await fse.rmdir(_sourceUri.path);
      const newStat = await this.doGetStat(_targetUri, 1);
      if (newStat) {
        return newStat;
      }
      throw FileSystemError.FileNotFound(
        targetUri.path,
        `Error occurred when moving resource from '${sourceUri}' to '${targetUri}'.`,
      );
    } else if (
      overwrite
      && targetStat
      && targetStat.isDirectory
      && sourceStat.isDirectory
      && !targetMightHaveChildren
      && sourceMightHaveChildren
    ) {
      // Copy source to target, since target is empty. Then wipe the source content.
      const newStat = await this.copy(sourceUri, targetUri, { overwrite });
      await this.delete(sourceUri, { moveToTrash: false });
      return newStat;
    } else {
      await fse.move(_sourceUri.path, _targetUri.path, { overwrite });
      const stat = await this.stat(_sourceUri);
      // 文件夹重命名 会导致文件夹删不掉
      if (stat) {
        this.delete(_sourceUri, { recursive: true });
      }
      const newStat = await this.doGetStat(_targetUri, 1);
      return newStat!;
    }
  }

  protected async doGetStat(uri: Uri, depth: number): Promise<FileStat | undefined> {
    try {
      const filePath = uri.path;
      const lstat = await fse.lstat(filePath);

      if (lstat.isSymbolicLink()) {
        let realPath: string;
        try {
          realPath = await fse.realpath(uri.path);
        } catch (e) {
          return undefined;
        }
        const stat = await fse.stat(filePath);
        const realURI = Uri.file(realPath);
        const realStat = await fse.lstat(realPath);

        let realStatData: FileStat;
        if (stat.isDirectory()) {
          realStatData = await this.doCreateDirectoryStat(realURI, realStat, depth);
        } else {
          realStatData = await this.doCreateFileStat(realURI, realStat);
        }

        return {
          ...realStatData,
          isSymbolicLink: true,
          uri: uri.toString(),
        };
      } else {
        if (lstat.isDirectory()) {
          return await this.doCreateDirectoryStat(uri, lstat, depth);
        }
        const fileStat = await this.doCreateFileStat(uri, lstat);

        return fileStat;
      }
    } catch (error) {
      if (isErrnoException(error)) {
        if (
          error.code === 'ENOENT'
          || error.code === 'EACCES'
          || error.code === 'EBUSY'
          || error.code === 'EPERM'
        ) {
          return undefined;
        }
      }
      throw error;
    }
  }

  protected async doCreateFileStat(uri: Uri, stat: any): Promise<FileStat> {
    return {
      uri: uri.toString(),
      lastModification: stat.mtime.getTime(),
      createTime: stat.ctime.getTime(),
      isSymbolicLink: stat.isSymbolicLink(),
      isDirectory: false,
      size: stat.size,
      type: this.getFileStatType(stat),
    };
  }

  protected getFileStatType(stat: any) {
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

  protected async doCreateDirectoryStat(uri: Uri, stat: any, depth: number): Promise<FileStat> {
    const children = depth > 0 ? await this.doGetChildren(uri, depth) : [];
    return {
      uri: uri.toString(),
      lastModification: stat.mtime.getTime(),
      createTime: stat.ctime.getTime(),
      isDirectory: true,
      isSymbolicLink: stat.isSymbolicLink(),
      children,
    };
  }

  protected async doGetChildren(uri: Uri, depth: number): Promise<FileStat[]> {
    const _uri = new URI(uri);
    const files = await fse.readdir(uri.path);
    const children = await Promise.all(
      files
        .map((fileName) => _uri.resolve(fileName))
        .map((childUri) => this.doGetStat(childUri.codeUri, depth - 1)),
    );
    return children.filter(notEmpty);
  }

  async getFileType(uri: string): Promise<string | undefined> {
    try {
      // 兼容性处理，本质 disk-file 不支持非 file 协议的文件头嗅探
      if (!uri.startsWith('file:/')) {
        return this._getFileType('');
      }
      const _uri = new URI(uri);
      const stat = await fse.stat(_uri.codeUri.path);

      let ext: string = '';
      if (!stat.isDirectory()) {
        // TODO: 暂时不通过 file-type 来判断
        if (stat.size) {
          ext = _uri.path.ext;
          if (ext[0] === '.') {
            ext = ext.slice(1);
          }
        }
        // 使用路径判断文件格式存在问题
        if (typeof this.runtimeConfig.resolveFileType === 'function') {
          return this.runtimeConfig.resolveFileType(uri.slice(7));
        }
        return this._getFileType(ext);
      }
      return 'directory';
    } catch (error) {
      if (isErrnoException(error)) {
        if (
          error.code === 'ENOENT'
          || error.code === 'EACCES'
          || error.code === 'EBUSY'
          || error.code === 'EPERM'
        ) {
          return undefined;
        }
      }
    }
  }

  private _getFileType(ext: string) {
    ext = (ext || '').toLowerCase();

    let type = 'text';

    if (['png', 'gif', 'jpg', 'jpeg', 'svg'].indexOf(ext) !== -1) {
      type = 'image';
    } else if (DiskFileSystemProvider.BinaryExtList.indexOf(ext) !== -1) {
      type = 'video';
    }

    return type;
  }
}

export class DiskFileSystemProviderWithoutWatcher extends DiskFileSystemProvider {
  initWatcher() {
    // Do nothing
  }
}
