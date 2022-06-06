import type { IPluginAPI } from '@alipay/alex/lib/editor';
import * as localforage from 'localforage';
import type { Uri } from '@alipay/alex';
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
    throw new Error('SCM Not Support IndexedDB');
  }

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
  commands.registerCommand('web-scm.localforage.removeModify', async (key) => {
    return await localforage.removeItem(key);
  });
  commands.registerCommand('web-scm.localforage.clear', async () => {
    return await localforage.clear();
  });
  commands.registerCommand('web-scm.localforage.iterate', async (basePath) => {
    const files: CacheFile[] = [];
    await localforage.iterate((value: CacheFile, key: string) => {
      if (key.startsWith(basePath)) {
        if (key.endsWith(':MODIFY')) {
          files.push(value);
        }
        // if (
        //   value.type === Status.ADDED ||
        //   value.type === Status.UNTRACKED
        // ) {
        // } else if (value.type === Status.DELETED) {
        // } else if (value.type === Status.MODIFIED) {
        // }
      }
    });
    return files;
  });
};
