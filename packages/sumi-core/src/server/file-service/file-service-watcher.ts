import {
  Disposable,
  DisposableCollection,
  FileChangeType,
  FileSystemWatcherClient,
  IDisposable,
  IFileSystemWatcherServer,
  ParsedPattern,
  parseGlob as parse,
  URI,
  Uri,
  WatchOptions,
} from '@opensumi/ide-core-common';
import debounce from 'lodash.debounce';
import path from 'path';
import { fsExtra as fse, fsWatcher } from '../node';
import { FileChangeCollection } from './file-change-collection';

export interface WatcherOptions {
  excludesPattern: ParsedPattern[];
  excludes: string[];
}

export interface NsfwFileSystemWatcherOption {
  verbose?: boolean;
  info?: (message: string, ...args: any[]) => void;
  error?: (message: string, ...args: any[]) => void;
}

export class FWFileSystemWatcherServer implements IFileSystemWatcherServer {
  private static WATCHER_FILE_DETECTED_TIME = 500;
  protected client: FileSystemWatcherClient | undefined;
  protected watcherSequence = 1;
  protected watcherOptions = new Map<number, WatcherOptions>();
  protected readonly watchers = new Map<number, { path: string; disposable: IDisposable }>();

  protected readonly toDispose = new DisposableCollection(
    Disposable.create(() => this.setClient(undefined)),
  );

  protected changes = new FileChangeCollection();

  protected readonly options: {
    verbose: boolean;
    // tslint:disable-next-line
    info: (message: string, ...args: any[]) => void;
    // tslint:disable-next-line
    error: (message: string, ...args: any[]) => void;
  };

  constructor(options?: NsfwFileSystemWatcherOption) {
    this.options = {
      verbose: false,
      // tslint:disable-next-line
      info: (message, ...args) => console.info(message, ...args),
      // tslint:disable-next-line
      error: (message, ...args) => console.error(message, ...args),
      ...options,
    };
  }

  dispose(): void {
    this.toDispose.dispose();
  }

  /**
   * 查找父目录是否已经在监听
   * @param watcherPath
   */
  checkIsParentWatched(watcherPath: string): number | undefined {
    let watcherId: number | undefined;
    this.watchers.forEach((watcher) => {
      if (watcherId) {
        return;
      }
      if (watcherPath.indexOf(watcher.path) === 0) {
        watcherId = this.watcherSequence++;
        this.watchers.set(watcherId, {
          path: watcherPath,
          disposable: new DisposableCollection(),
        });
      }
    });
    return watcherId;
  }

  async watchFileChanges(uri: string, options?: WatchOptions): Promise<number> {
    const basePath = Uri.parse(uri).path;
    let realpath;
    if (await fse.pathExists(basePath)) {
      realpath = basePath;
    }
    let watcherId = realpath && this.checkIsParentWatched(realpath)!;
    if (watcherId) {
      return watcherId;
    }
    watcherId = this.watcherSequence++;
    this.debug('Starting watching:', basePath, options);
    const toDisposeWatcher = new DisposableCollection();
    if (await fse.pathExists(basePath)) {
      this.watchers.set(watcherId, {
        path: realpath,
        disposable: toDisposeWatcher,
      });
      toDisposeWatcher.push(Disposable.create(() => this.watchers.delete(watcherId)));
      this.start(watcherId, basePath, options, toDisposeWatcher);
    } else {
      const watchPath = await this.lookup(basePath);
      if (watchPath) {
        this.watchers.set(watcherId, {
          path: watchPath,
          disposable: toDisposeWatcher,
        });
        toDisposeWatcher.push(Disposable.create(() => this.watchers.delete(watcherId)));
        this.start(watcherId, watchPath, options, toDisposeWatcher, basePath);
      } else {
        const toClearTimer = new DisposableCollection();
        const timer = setInterval(async () => {
          if (await fse.pathExists(basePath)) {
            toClearTimer.dispose();
            this.pushAdded(watcherId, basePath);
            this.start(watcherId, basePath, options, toDisposeWatcher);
          }
        }, FWFileSystemWatcherServer.WATCHER_FILE_DETECTED_TIME);
        toClearTimer.push(Disposable.create(() => clearInterval(timer)));
        toDisposeWatcher.push(toClearTimer);
      }
    }
    this.toDispose.push(toDisposeWatcher);
    return watcherId;
  }

  /**
   * 向上查找存在的目录
   * 默认向上查找 3 层，避免造成较大的目录监听带来的性能问题
   * 当前框架内所有配置文件可能存在的路径层级均不超过 3 层
   * @param path 监听路径
   * @param count 向上查找层级
   */
  protected async lookup(path: string, count: number = 3) {
    let uri = new URI(path);
    let times = 0;
    while (!(await fse.pathExists(uri.codeUri.fsPath)) && times <= count) {
      uri = uri.parent;
      times++;
    }
    if (await fse.pathExists(uri.codeUri.fsPath)) {
      return uri.codeUri.fsPath;
    } else {
      return '';
    }
  }

  protected async start(
    watcherId: number,
    basePath: string,
    rawOptions: WatchOptions | undefined,
    toDisposeWatcher: DisposableCollection,
    rawFile?: string,
  ): Promise<void> {
    const options: WatchOptions = {
      excludes: [],
      ...rawOptions,
    };

    const { watch, actions } = fsWatcher;
    let watcher = await watch(basePath, (events) => {
      for (const event of events) {
        if (rawFile && event.file !== rawFile) {
          return;
        }
        if (event.action === actions.CREATED) {
          this.pushAdded(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === actions.DELETED) {
          this.pushDeleted(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === actions.MODIFIED) {
          this.pushUpdated(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === actions.RENAMED) {
          if (event.newDirectory) {
            this.pushDeleted(watcherId, this.resolvePath(event.directory, event.oldFile!));
            this.pushAdded(watcherId, this.resolvePath(event.newDirectory, event.newFile!));
          } else {
            this.pushDeleted(watcherId, this.resolvePath(event.directory, event.oldFile!));
            this.pushAdded(watcherId, this.resolvePath(event.directory, event.newFile!));
          }
        }
      }
    });

    watcher.start();
    if (toDisposeWatcher.disposed) {
      this.debug('Stopping watching:', basePath);
      watcher.stop();
      this.options.info('Stopped watching:', basePath);
      return;
    }
    toDisposeWatcher.push(
      Disposable.create(async () => {
        this.watcherOptions.delete(watcherId);
        if (watcher) {
          this.debug('Stopping watching:', basePath);
          watcher.stop();
          this.options.info('Stopped watching:', basePath);
        }
      }),
    );
    this.watcherOptions.set(watcherId, {
      excludesPattern: options.excludes.map((pattern) => parse(pattern)),
      excludes: options.excludes,
    });
  }

  unwatchFileChanges(watcherId: number): Promise<void> {
    const watcher = this.watchers.get(watcherId);
    if (watcher) {
      this.watchers.delete(watcherId);
      watcher.disposable.dispose();
    }
    return Promise.resolve();
  }

  setClient(client: FileSystemWatcherClient | undefined) {
    if (client && this.toDispose.disposed) {
      return;
    }
    this.client = client;
  }

  protected pushAdded(watcherId: number, path: string): void {
    // this.debug('Added:', `${watcherId}:${path}`);
    this.pushFileChange(watcherId, path, FileChangeType.ADDED);
  }

  protected pushUpdated(watcherId: number, path: string): void {
    // this.debug('Updated:', `${watcherId}:${path}`);
    this.pushFileChange(watcherId, path, FileChangeType.UPDATED);
  }

  protected pushDeleted(watcherId: number, path: string): void {
    // this.debug('Deleted:', `${watcherId}:${path}`);
    this.pushFileChange(watcherId, path, FileChangeType.DELETED);
  }

  protected pushFileChange(watcherId: number, path: string, type: FileChangeType): void {
    if (this.isIgnored(watcherId, path)) {
      return;
    }

    const uri = Uri.file(path).toString();
    this.changes.push({ uri, type });

    this.fireDidFilesChanged();
  }

  protected resolvePath(directory: string, file: string): string {
    return path.join(directory, file);
  }

  /**
   * Fires file changes to clients.
   * It is debounced in the case if the filesystem is spamming to avoid overwhelming clients with events.
   */
  protected readonly fireDidFilesChanged: () => void = debounce(
    () => this.doFireDidFilesChanged(),
    100,
  );
  protected doFireDidFilesChanged(): void {
    const changes = this.changes.values();
    this.changes = new FileChangeCollection();
    const event = { changes };
    if (this.client) {
      this.client.onDidFilesChanged(event);
    }
  }

  protected isIgnored(watcherId: number, path: string): boolean {
    const options = this.watcherOptions.get(watcherId);

    if (!options || !options.excludes || options.excludes.length < 1) {
      return false;
    }
    return options.excludesPattern.some((match) => {
      return match(path);
    });
  }

  protected debug(message: string, ...params: any[]): void {
    if (this.options.verbose) {
      this.options.info(message, ...params);
    }
  }
}
