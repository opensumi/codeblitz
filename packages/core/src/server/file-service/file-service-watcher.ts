import { parse, ParsedPattern } from '@ali/ide-core-common/lib/utils/glob';
import {
  IDisposable,
  Disposable,
  DisposableCollection,
  Uri,
  FileChangeType,
  FileSystemWatcherClient,
  FileSystemWatcherServer,
  WatchOptions,
} from '@ali/ide-core-common';
import debounce from 'lodash.debounce';
import path from 'path';
import { FileChangeCollection } from './file-change-collection';
import { fse, watch } from '../node';
import { ChangeEvent, FW } from '../node/extend/fs-watch';

export interface WatcherOptions {
  excludesPattern: ParsedPattern[];
  excludes: string[];
}

export interface NsfwFileSystemWatcherOption {
  verbose?: boolean;
  info?: (message: string, ...args: any[]) => void;
  error?: (message: string, ...args: any[]) => void;
}

export class FWFileSystemWatcherServer implements FileSystemWatcherServer {
  protected client: FileSystemWatcherClient | undefined;
  protected watcherSequence = 1;
  protected watcherOptions = new Map<number, WatcherOptions>();
  protected readonly watchers = new Map<number, { path: string; disposable: IDisposable }>();

  protected readonly toDispose = new DisposableCollection(
    Disposable.create(() => this.setClient(undefined))
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
    const realpath = await fse.realpath(basePath);
    let watcherId = this.checkIsParentWatched(realpath)!;
    if (watcherId) {
      return watcherId;
    }
    watcherId = this.watcherSequence++;
    this.debug('Starting watching:', basePath, options);
    const toDisposeWatcher = new DisposableCollection();
    this.watchers.set(watcherId, {
      path: realpath,
      disposable: toDisposeWatcher,
    });
    toDisposeWatcher.push(Disposable.create(() => this.watchers.delete(watcherId)));
    if (await fse.pathExists(basePath)) {
      this.start(watcherId, basePath, options, toDisposeWatcher);
    } else {
      const toClearTimer = new DisposableCollection();
      const timer = setInterval(async () => {
        if (await fse.pathExists(basePath)) {
          toClearTimer.dispose();
          this.pushAdded(watcherId, basePath);
          this.start(watcherId, basePath, options, toDisposeWatcher);
        }
      }, 500);
      toClearTimer.push(Disposable.create(() => clearInterval(timer)));
      toDisposeWatcher.push(toClearTimer);
    }
    this.toDispose.push(toDisposeWatcher);
    return watcherId;
  }

  protected async start(
    watcherId: number,
    basePath: string,
    rawOptions: WatchOptions | undefined,
    toDisposeWatcher: DisposableCollection
  ): Promise<void> {
    const options: WatchOptions = {
      excludes: [],
      ...rawOptions,
    };

    let watcher: FW | undefined = await watch(basePath, (events: ChangeEvent[]) => {
      for (const event of events) {
        if (event.action === watch.actions.CREATED) {
          this.pushAdded(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === watch.actions.DELETED) {
          this.pushDeleted(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === watch.actions.MODIFIED) {
          this.pushUpdated(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === watch.actions.RENAMED) {
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
      watcher = undefined;
      this.options.info('Stopped watching:', basePath);
      return;
    }
    toDisposeWatcher.push(
      Disposable.create(async () => {
        this.watcherOptions.delete(watcherId);
        if (watcher) {
          this.debug('Stopping watching:', basePath);
          watcher.stop();
          watcher = undefined;
          this.options.info('Stopped watching:', basePath);
        }
      })
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
    100
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
