import {
  debounce,
  Disposable,
  DisposableCollection,
  FileUri,
  IDisposable,
  Event,
  Emitter,
  FileChangeType,
} from '@ali/ide-core-common';
import * as paths from '@ali/ide-core-common/lib/path';
import { ParsedPattern } from '@ali/ide-core-common/lib/utils/glob';

import bfs, { IBsfwAction } from '../../common/file-system';
// 原本写在 node 端，复制了一份
import { FileChangeCollection, FileChange } from './file-change-collection';

export interface WatcherOptions {
  excludesPattern: ParsedPattern[];
  excludes: string[];
}

interface WatchConfig {
  excludes: string[];
}

export class FsWatcher extends Disposable {
  private _onDidFilesChanged: Emitter<{
    changes: FileChange[];
  }> = new Emitter();
  public get onDidFilesChanged() {
    return this._onDidFilesChanged.event;
  }

  async watchFileChanges(uri: string, options?: WatchConfig): Promise<number> {
    const basePath = FileUri.fsPath(uri);
    const realpath = await bfs.realpath(basePath);
    let watcherId = this.checkIsParentWatched(realpath);
    if (watcherId) {
      return watcherId;
    }
    watcherId = this.watcherSequence++;
    const toDisposeWatcher = new DisposableCollection();
    this.watchers.set(watcherId, {
      path: realpath,
      disposable: toDisposeWatcher,
    });
    toDisposeWatcher.push(Disposable.create(() => this.watchers.delete(watcherId)));
    if (await bfs.exists(basePath)) {
      this.start(watcherId, basePath, options, toDisposeWatcher);
    } else {
      const toClearTimer = new DisposableCollection();
      const timer = setInterval(async () => {
        if (await bfs.exists(basePath)) {
          toClearTimer.dispose();
          this.pushAdded(watcherId, basePath);
          this.start(watcherId, basePath, options, toDisposeWatcher);
        }
      }, 500);
      toClearTimer.push(Disposable.create(() => clearInterval(timer)));
      toDisposeWatcher.push(toClearTimer);
    }
    this.addDispose(toDisposeWatcher);
    return watcherId;
  }

  unwatchFileChanges(watcherId: number): Promise<void> {
    const watcher = this.watchers.get(watcherId);
    if (watcher) {
      this.watchers.delete(watcherId);
      watcher.disposable.dispose();
    }
    return Promise.resolve();
  }

  /**
   * 查找父目录是否已经在监听
   * @param watcherPath
   */
  private checkIsParentWatched(watcherPath: string): number {
    let watcherId;
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

  private async start(
    watcherId: number,
    basePath: string,
    rawOptions: WatchConfig | undefined,
    toDisposeWatcher: DisposableCollection
  ): Promise<void> {
    bfs.onDidChange((events) => {
      for (const event of events) {
        if (event.action === IBsfwAction.CREATED) {
          this.pushAdded(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === IBsfwAction.DELETED) {
          this.pushDeleted(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === IBsfwAction.MODIFIED) {
          this.pushUpdated(watcherId, this.resolvePath(event.directory, event.file!));
        }
        if (event.action === IBsfwAction.RENAMED) {
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
  }

  private resolvePath(directory: string, file: string): string {
    const path = paths.join(directory, file);
    return path;
  }

  // 这里要使用 FileChangeType，因为 ide-fw 中 onFilesChanged 去分发事件时就是这个类型
  private pushAdded(watcherId: number, path: string): void {
    this.pushFileChange(watcherId, path, FileChangeType.ADDED);
  }

  private pushUpdated(watcherId: number, path: string): void {
    this.pushFileChange(watcherId, path, FileChangeType.UPDATED);
  }

  private pushDeleted(watcherId: number, path: string): void {
    this.pushFileChange(watcherId, path, FileChangeType.DELETED);
  }

  private pushFileChange(watcherId: number, path: string, type: FileChangeType): void {
    if (this.isIgnored(watcherId, path)) {
      return;
    }

    const uri = FileUri.create(path).toString();
    this.changes.push({ uri, type } as any);
    this.fireDidFilesChanged();
  }

  private changes = new FileChangeCollection();

  /**
   * Fires file changes to clients.
   * It is debounced in the case if the filesystem is spamming to avoid overwhelming clients with events.
   */
  @debounce(100)
  protected fireDidFilesChanged(): void {
    const changes = this.changes.values();
    this.changes = new FileChangeCollection();
    const event = { changes };
    // disk-fs-provider 中还有一层 exclude pattern 逻辑，目前实现在外部
    this._onDidFilesChanged.fire(event);
  }

  protected watcherSequence = 1;
  protected watcherOptions = new Map<number, WatcherOptions>();
  protected readonly watchers = new Map<number, { path: string; disposable: IDisposable }>();

  protected isIgnored(watcherId: number, path: string): boolean {
    const options = this.watcherOptions.get(watcherId);

    if (!options || !options.excludes || options.excludes.length < 1) {
      return false;
    }
    return options.excludesPattern.some((match) => {
      return match(path);
    });
  }
}
