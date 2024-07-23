import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import { Uri } from '@opensumi/ide-core-common';
import {
  DisposableCollection,
  Emitter,
  Event,
  IDisposable,
  isArray,
  isEmptyObject,
  match,
  ParsedPattern,
  parseGlob as parse,
  URI,
} from '@opensumi/ide-core-common';
import { FileChangeEvent } from '@opensumi/ide-core-common';
import {
  DidFilesChangedParams,
  FileAccess,
  FileCopyOptions,
  FileCreateOptions,
  FileDeleteOptions,
  FileMoveOptions,
  FileSetContentOptions,
  FileStat,
  FileSystemError,
} from '@opensumi/ide-file-service/lib/common';
import * as path from 'path';
import { TextDocument, TextDocumentContentChangeEvent } from 'vscode-languageserver-types';
import { HOME_ROOT } from '../../common';
import { RPCService } from '../../connection';
import { ServerConfig } from '../core/app';
import { INodeLogger } from '../core/node-logger';
import { fsExtra as fse } from '../node';
import { IDiskFileProvider, IFileService } from './base';
import { decode, encode, getEncodingInfo, UTF8 } from './encoding';

export abstract class FileSystemNodeOptions {
  public static DEFAULT: FileSystemNodeOptions = {
    encoding: 'utf8',
    overwrite: false,
    recursive: true,
    moveToTrash: true,
  };

  abstract encoding: string;
  abstract recursive: boolean;
  abstract overwrite: boolean;
  abstract moveToTrash: boolean;
}

@Injectable()
export class FileService extends RPCService implements IFileService {
  protected watcherId: number = 0;
  protected readonly watcherList: number[] = [];
  protected readonly watcherDisposerMap = new Map<number, IDisposable>();
  protected readonly onFileChangedEmitter = new Emitter<DidFilesChangedParams>();
  readonly onFilesChanged: Event<DidFilesChangedParams> = this.onFileChangedEmitter.event;
  protected toDisposable = new DisposableCollection();
  protected filesExcludes: string[] = [];
  protected filesExcludesMatcherList: ParsedPattern[] = [];
  protected workspaceRoots: string[] = [];

  @Autowired(INodeLogger)
  private readonly logger: INodeLogger;

  @Autowired(IDiskFileProvider)
  diskService: IDiskFileProvider;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  constructor(protected readonly options: FileSystemNodeOptions) {
    super();
    this.addDisposable();
  }

  /**
   * @deprecated
   * Just make ts happy
   * 当前只需 file，无需额外注册，直接用 diskFileSystem 即可
   */
  registerProvider(): any {}

  private addDisposable() {
    this.toDisposable.push(this.diskService.onDidChangeFile((e) => this.fireFilesChange(e)));
    this.toDisposable.push({
      dispose: () => {
        this.watcherList.forEach((id) => this.unwatchFileChanges(id));
      },
    });
  }

  async watchFileChanges(uri: string, options?: { excludes: string[] }): Promise<number> {
    const id = this.watcherId++;
    const _uri = this.getUri(uri);

    const watcherId = await this.diskService.watch(_uri.codeUri, {
      excludes: (options && options.excludes) || [],
    });
    this.watcherDisposerMap.set(id, {
      dispose: () => this.diskService.unwatch!(watcherId),
    });
    this.watcherList.push(id);
    return id;
  }

  async unwatchFileChanges(watcherId: number) {
    this.watcherDisposerMap.get(watcherId)?.dispose?.();
  }

  setWatchFileExcludes(excludes: string[]) {
    this.diskService.setWatchFileExcludes(excludes);
  }

  getWatchFileExcludes(): string[] {
    return this.diskService.getWatchFileExcludes() as string[];
  }

  setFilesExcludes(excludes: string[], roots?: string[]) {
    this.filesExcludes = excludes;
    this.filesExcludesMatcherList = [];
    if (roots) {
      this.setWorkspaceRoots(roots);
    } else {
      this.updateExcludeMatcher();
    }
  }

  getFilesExcludes(): string[] {
    return this.filesExcludes;
  }

  setWorkspaceRoots(roots: string[]) {
    this.workspaceRoots = roots;
    this.updateExcludeMatcher();
  }

  async getFileStat(uri: string): Promise<FileStat | undefined> {
    const _uri = this.getUri(uri);
    const stat = await this.diskService.stat(_uri.codeUri);
    return this.filterStat(stat as FileStat);
  }

  async exists(uri: string): Promise<boolean> {
    this.logger.warn(
      'Deprecated Warning: fileService.exists is deprecated, please use fileService.access instead!',
    );
    return this.access(uri);
  }

  async resolveContent(
    uri: string,
    options?: FileSetContentOptions,
  ): Promise<{ stat: FileStat; content: string }> {
    const _uri = this.getUri(uri);
    const stat = await this.diskService.stat(_uri.codeUri);
    if (!stat) {
      throw FileSystemError.FileNotFound(uri);
    }
    if (stat.isDirectory) {
      throw FileSystemError.FileIsADirectory(uri, 'Cannot resolve the content.');
    }
    const encoding = await this.doGetEncoding(options);
    const buffer = await this.diskService.readFile(_uri.codeUri, encoding);
    return { stat, content: decode(this.getNodeBuffer(buffer), encoding) };
  }

  async setContent(
    file: FileStat,
    content: string,
    options?: FileSetContentOptions,
  ): Promise<FileStat> {
    const _uri = this.getUri(file.uri);
    const stat = await this.diskService.stat(_uri.codeUri);

    if (!stat) {
      throw FileSystemError.FileNotFound(file.uri);
    }
    if (stat.isDirectory) {
      throw FileSystemError.FileIsADirectory(file.uri, 'Cannot set the content.');
    }
    if (!(await this.isInSync(file, stat))) {
      throw this.createOutOfSyncError(file, stat);
    }
    const encoding = await this.doGetEncoding(options);
    await this.diskService.writeFile(_uri.codeUri, encode(content, encoding), {
      create: false,
      overwrite: true,
      encoding,
    });
    const newStat = await this.diskService.stat(_uri.codeUri);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(file.uri, 'Error occurred while writing file content.');
  }

  async updateContent(
    file: FileStat,
    contentChanges: TextDocumentContentChangeEvent[],
    options?: FileSetContentOptions,
  ): Promise<FileStat> {
    const _uri = this.getUri(file.uri);
    const stat = await this.diskService.stat(_uri.codeUri);
    if (!stat) {
      throw FileSystemError.FileNotFound(file.uri);
    }
    if (stat.isDirectory) {
      throw FileSystemError.FileIsADirectory(file.uri, 'Cannot set the content.');
    }
    if (!this.checkInSync(file, stat)) {
      throw this.createOutOfSyncError(file, stat);
    }
    if (contentChanges.length === 0) {
      return stat;
    }
    const encoding = await this.doGetEncoding(options);
    const buffer = this.getNodeBuffer(await this.diskService.readFile(_uri.codeUri));
    const content = decode(buffer, encoding);
    const newContent = this.applyContentChanges(content, contentChanges);
    await this.diskService.writeFile(_uri.codeUri, encode(newContent, encoding), {
      create: false,
      overwrite: true,
      encoding,
    });
    const newStat = await this.diskService.stat(_uri.codeUri);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(file.uri, 'Error occurred while writing file content.');
  }

  async move(sourceUri: string, targetUri: string, options?: FileMoveOptions): Promise<FileStat> {
    const _sourceUri = this.getUri(sourceUri);
    const _targetUri = this.getUri(targetUri);

    const result: any = await this.diskService.rename(_sourceUri.codeUri, _targetUri.codeUri, {
      overwrite: !!options?.overwrite,
    });

    if (result) {
      return result;
    }
    const stat = await this.diskService.stat(_targetUri.codeUri);
    return stat as FileStat;
  }

  async copy(sourceUri: string, targetUri: string, options?: FileCopyOptions): Promise<FileStat> {
    const _sourceUri = this.getUri(sourceUri);
    const _targetUri = this.getUri(targetUri);
    const overwrite = await this.doGetOverwrite(options);

    const result: any = await this.diskService.copy(_sourceUri.codeUri, _targetUri.codeUri, {
      overwrite: !!overwrite,
    });

    if (result) {
      return result;
    }
    const stat = await this.diskService.stat(_targetUri.codeUri);
    return stat as FileStat;
  }

  async createFile(uri: string, options: FileCreateOptions = {}): Promise<FileStat> {
    const _uri = this.getUri(uri);

    const content = await this.doGetContent(options);
    const encoding = await this.doGetEncoding(options);
    let newStat: any = await this.diskService.writeFile(_uri.codeUri, encode(content, encoding), {
      create: true,
      overwrite: options?.overwrite || false,
      encoding,
    });
    newStat ||= await this.diskService.stat(_uri.codeUri);
    if (newStat) {
      return newStat;
    }
    throw FileSystemError.FileNotFound(uri, 'Error occurred while creating the file.');
  }

  async createFolder(uri: string): Promise<FileStat> {
    const _uri = this.getUri(uri);

    const result = await this.diskService.createDirectory(_uri.codeUri);

    if (result) {
      return result;
    }
    const stat = await this.diskService.stat(_uri.codeUri);
    return stat as FileStat;
  }

  async delete(uri: string, options?: FileDeleteOptions): Promise<void> {
    const _uri = this.getUri(uri);

    const stat = await this.diskService.stat(_uri.codeUri);
    if (!stat) {
      throw FileSystemError.FileNotFound(uri);
    }

    return this.diskService.delete(_uri.codeUri, {
      recursive: true,
      moveToTrash: await this.doGetMoveToTrash(options),
    });
  }

  async access(uri: string, mode: number = FileAccess.Constants.F_OK): Promise<boolean> {
    const _uri = this.getUri(uri);
    return await this.diskService.access(_uri.codeUri, mode);
  }

  async getEncoding(uri: string): Promise<string> {
    // TODO 临时修复方案 目前识别率太低，全部返回 UTF8
    return UTF8;
    // const _uri = this.getUri(uri);
    // if (_uri.scheme !== Schemas.file) {
    //   console.warn(`Only support scheme file!, will return UTF8!`);
    //   return UTF8;
    // }
    // const stat = await this.diskService.stat(_uri.codeUri);
    // if (!stat) {
    //   throw FileSystemError.FileNotFound(uri);
    // }
    // if (stat.isDirectory) {
    //   throw FileSystemError.FileIsDirectory(uri, 'Cannot get the encoding.');
    // }
    // const encoding = detectEncodingByURI(_uri);
    // return encoding || this.options.encoding || UTF8;
  }

  getEncodingInfo = getEncodingInfo;

  // FIXME: no usage any more?
  async getRoots(): Promise<FileStat[]> {
    return [];
  }

  async getCurrentUserHome(): Promise<FileStat | undefined> {
    return this.getFileStat(Uri.file(HOME_ROOT).toString());
  }

  getDrives(): Promise<string[]> {
    return Promise.resolve([]);
  }

  /**
   * Only support scheme `file`
   */
  async getFsPath(uri: string): Promise<string | undefined> {
    if (!uri.startsWith('file:/')) {
      return undefined;
    } else {
      return Uri.parse(uri).path;
    }
  }

  async getFileType(uri: string): Promise<string | undefined> {
    try {
      if (!uri.startsWith('file:/')) {
        return this._getFileType('');
      }
      const _uri = new URI(uri);
      const stat = await fse.stat(_uri.codeUri.path);

      let ext: string = '';
      if (stat.isDirectory()) {
        return 'directory';
      }
      // TODO: 暂时不通过 file-type 来判断
      if (stat.size) {
        ext = _uri.path.ext;
        if (ext[0] === '.') {
          ext = ext.slice(1);
        }
      }
      return this._getFileType(ext);
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

  getUri(uri: string | Uri): URI {
    const _uri = new URI(uri);

    if (!_uri.scheme) {
      throw new Error(`没有设置 scheme: ${uri}`);
    }

    return _uri;
  }

  /**
   * Current policy: sends * all * Provider onDidChangeFile events to * all * clients and listeners
   */
  fireFilesChange(e: FileChangeEvent) {
    if (e.length < 1) {
      return false;
    }
    this.logger.debug('FileChangeEvent:', e);
    this.onFileChangedEmitter.fire({
      changes: e,
    });
  }

  dispose(): void {
    this.toDisposable.dispose();
  }

  // Protected or private

  private updateExcludeMatcher() {
    this.filesExcludes.forEach((str) => {
      if (this.workspaceRoots.length > 0) {
        this.workspaceRoots.forEach((root: string) => {
          const uri = new URI(root);
          const uriWithExclude = uri.resolve(str).path.toString();
          this.filesExcludesMatcherList.push(parse(uriWithExclude));
        });
      } else {
        this.filesExcludesMatcherList.push(parse(str));
      }
    });
  }

  private isExclude(uriString: string) {
    const uri = new URI(uriString);

    return this.filesExcludesMatcherList.some((matcher) => {
      return matcher(uri.path.toString());
    });
  }

  private filterStat(stat?: FileStat) {
    if (!stat) {
      return;
    }

    if (this.isExclude(stat.uri)) {
      return;
    }

    if (stat.children) {
      stat.children = this.filterStatChildren(stat.children);
    }

    return stat;
  }

  private filterStatChildren(children: FileStat[]) {
    const list: FileStat[] = [];

    children.forEach((child) => {
      if (this.isExclude(child.uri)) {
        return;
      }
      const state = this.filterStat(child);
      if (state) {
        list.push(state);
      }
    });

    return list;
  }

  private getNodeBuffer(asBuffer: any): Buffer {
    if (Buffer.isBuffer(asBuffer)) {
      return asBuffer;
    }
    if (isArray(asBuffer)) {
      return Buffer.from(asBuffer);
    }
    if (asBuffer && isArray(asBuffer.data)) {
      return Buffer.from(asBuffer.data);
    }
    if (!asBuffer || isEmptyObject(asBuffer)) {
      return Buffer.from([]);
    }
    return asBuffer;
  }

  protected applyContentChanges(
    content: string,
    contentChanges: TextDocumentContentChangeEvent[],
  ): string {
    let document = TextDocument.create('', '', 1, content);
    for (const change of contentChanges) {
      let newContent = change.text;
      if (change.range) {
        const start = document.offsetAt(change.range.start);
        const end = document.offsetAt(change.range.end);
        newContent = document.getText().substr(0, start) + change.text + document.getText().substr(end);
      }
      document = TextDocument.create(
        document.uri,
        document.languageId,
        document.version,
        newContent,
      );
    }
    return document.getText();
  }

  protected async isInSync(file: FileStat, stat: FileStat): Promise<boolean> {
    if (this.checkInSync(file, stat)) {
      return true;
    }
    return false;
  }

  protected checkInSync(file: FileStat, stat: FileStat): boolean {
    return stat.lastModification === file.lastModification && stat.size === file.size;
  }

  protected createOutOfSyncError(file: FileStat, stat: FileStat): Error {
    return FileSystemError.FileIsOutOfSync(file, stat);
  }

  private _getFileType(ext: string) {
    let type = 'text';

    if (['png', 'gif', 'jpg', 'jpeg', 'svg'].indexOf(ext) !== -1) {
      type = 'image';
    } else if (ext && ['xml'].indexOf(ext) === -1) {
      type = 'binary';
    }

    return type;
  }

  protected async doGetEncoding(option?: { encoding?: string }): Promise<string> {
    return option && typeof option.encoding !== 'undefined'
      ? option.encoding
      : this.options.encoding;
  }

  protected async doGetOverwrite(option?: { overwrite?: boolean }): Promise<boolean | undefined> {
    return option && typeof option.overwrite !== 'undefined'
      ? option.overwrite
      : this.options.overwrite;
  }

  protected async doGetRecursive(option?: { recursive?: boolean }): Promise<boolean> {
    return option && typeof option.recursive !== 'undefined'
      ? option.recursive
      : this.options.recursive;
  }

  protected async doGetMoveToTrash(option?: { moveToTrash?: boolean }): Promise<boolean> {
    return option && typeof option.moveToTrash !== 'undefined'
      ? option.moveToTrash
      : this.options.moveToTrash;
  }

  protected async doGetContent(option?: { content?: string }): Promise<string> {
    return (option && option.content) || '';
  }
}
export function getSafeFileService(injector: Injector) {
  const fileService = injector.get(FileService, [FileSystemNodeOptions.DEFAULT]);
  const serverConfig: ServerConfig = injector.get(ServerConfig);
  fileServiceInterceptor(
    fileService,
    [
      'exists',
      'resolveContent',
      'setContent',
      'updateContent',
      'createFile',
      'createFolder',
      'delete',
      'access',
      'getFsPath',
      'getFileType',
      'getFileStat',
      'move',
      'copy',
    ],
    serverConfig.blockPatterns || [],
  );
  return fileService;
}

// tslint:disable-next-line:no-any
function isErrnoException(error: any | NodeJS.ErrnoException): error is NodeJS.ErrnoException {
  return (
    (error as NodeJS.ErrnoException).code !== undefined
    && (error as NodeJS.ErrnoException).errno !== undefined
  );
}

// 对于首个参数为uri的方法进行安全拦截
function fileServiceInterceptor(
  fileService: IFileService,
  blackList: string[],
  blockPatterns: string[],
) {
  for (const method of blackList) {
    if (typeof fileService[method] === 'function') {
      // tslint:disable-next-line: ban-types
      const originFunc: Function = fileService[method];
      fileService[method] = (...args) => {
        // 第一个参数为uri/{uri}
        if (blockPatterns.length > 0) {
          const uri = typeof args[0] === 'string' ? args[0] : args[0].uri;
          if (typeof uri === 'string') {
            let resolvedURI = uri;
            if (uri.startsWith('file://')) {
              /**
               * match('file:///test/folder/**', 'file:///test/foo/../test/token')
               *
               * 防止被绕过
               */
              resolvedURI = `file://${path.resolve(uri.slice(7))}`;
            }
            for (const blockPattern of blockPatterns) {
              if (match(blockPattern, resolvedURI)) {
                throw new Error('illegal accessing ' + uri + ' with rule ' + blockPattern);
              }
            }
          }
        }
        return originFunc.apply(fileService, args);
        // copy和move第二个参数也为uri，只禁止来源
      };
    }
  }
}
