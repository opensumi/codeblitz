import type { Uri } from '@codeblitzjs/ide-core';
import type { IPluginAPI } from '@codeblitzjs/ide-core/lib/editor';
import { Deferred } from '@codeblitzjs/ide-core/lib/modules/opensumi__ide-core-browser';
import * as localforage from 'localforage';

export const PLUGIN_ID = 'web-scm';

export interface CacheFile {
  uri: Uri;
  content: string;
  length?: number;
  type?: Status;
}
export enum Status {
  INDEX_MODIFIED,
  INDEX_ADDED,
  INDEX_DELETED,
  INDEX_RENAMED,
  INDEX_COPIED,

  MODIFIED,
  DELETED,
  UNTRACKED,
  IGNORED,
  INTENT_TO_ADD,
  ADDED,

  ADDED_BY_US,
  ADDED_BY_THEM,
  DELETED_BY_US,
  DELETED_BY_THEM,
  BOTH_ADDED,
  BOTH_DELETED,
  BOTH_MODIFIED,
}

export const activate = ({ commands }: IPluginAPI) => {
  if (!localforage.supports(localforage.INDEXEDDB)) {
    throw new Error('[SCM] IndexedDB  Not Support');
  }
  const workerReady = new Deferred<void>();

  // 只存储在IndexedDB
  localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'WEB_SCM',
    storeName: 'WEB_SCM_TABLE',
  });

  commands.registerCommand('web-scm.localforage.get', async (key) => {
    return await localforage.getItem(key);
  });
  commands.registerCommand('web-scm.localforage.set', async (key, value) => {
    return await localforage.setItem(key, value);
  });
  commands.registerCommand('web-scm.localforage.remove', async (key) => {
    return await localforage.removeItem(key);
  });
  commands.registerCommand('web-scm.localforage.clear', async () => {
    return await localforage.clear();
  });
  commands.registerCommand('web-scm.localforage.iterate', async (basePath) => {
    const files: CacheFile[] = [];
    await localforage.iterate((value: CacheFile, key: string) => {
      if (key.startsWith(basePath)) {
        files.push(value);
      }
    });
    return files;
  });

  commands.registerCommand('web-scm.log', () => {
    // noop
  });

  // TODO 待 OpenSumi内增加 getEncoding api
  // https://github.com/opensumi/core/issues/3104
  commands.registerCommand('code-service.getEncoding', (uri: Uri) => {
    return 'utf8';
  });

  commands.registerCommand('web-scm.windowOpen', async (path) => {
    if (!path) {
      window.location = window.location;
    } else {
      window.open(path);
    }
  });

  commands.registerCommand('code-service.conflictConfig', () => {
    return {
      isMergeConflicts: false,
    };
  });
};
