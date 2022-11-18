import type { IPluginAPI } from '@alipay/alex/lib/editor';
import * as localforage from 'localforage';
import type { Uri } from '@alipay/alex';
import { Deferred } from '@alipay/alex/lib/modules/opensumi__ide-core-browser';

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

  commands.registerCommand('web-scm.windowOpen', async (path) => {
    window.open(path);
  });

  /*
      21 修改次数
      22 新增文件
      23 删除文件
      24 提交次数
   */
  commands.registerCommand('web-scm.yuyanlog', (code, msg, extra) => {
    // 埋点数据
    console.log(' >>> log', code, msg, extra);
  });

  commands.registerCommand('alex.gty.workerReady', () => {
    return workerReady.resolve();
  });
};
