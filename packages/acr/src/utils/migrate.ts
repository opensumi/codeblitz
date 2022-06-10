/**
 * 存储在 lightning-fs db 中偏好设置数据迁移
 * Ant Code 接入上线后一段时间后该代码应删除
 */

import { STORAGE_DIR, HOME_ROOT, fsExtra as fse } from '@alipay/alex-core';
import { path } from '@opensumi/ide-core-common';
import { USER_PREFERENCE_URI } from '@opensumi/ide-preferences/lib/browser/user-preference-provider';

const { posix } = path;

export const getLegacyACRSettings = async () => {
  let db: IDBDatabase | null = null;
  const dbName = '@alipay/acr-ide';
  const storeName = '@alipay/acr-ide_files';

  let dbExisted = true;
  try {
    db = await new Promise<IDBDatabase | null>((resolve, reject) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        if (!dbExisted) {
          // open 始终会创建 db，本身不存在的直接删掉
          req.result.close();
          indexedDB.deleteDatabase(dbName);
          resolve(null);
        } else {
          resolve(req.result);
        }
      };
      req.onupgradeneeded = () => {
        dbExisted = false;
      };
    });

    if (!db || !db.objectStoreNames.contains(storeName)) {
      return;
    }
    const get = async <T>(key: string): Promise<T> => {
      let req: IDBRequest;
      await new Promise<void>((resolve, reject) => {
        const transaction = db!.transaction(storeName, 'readwrite');
        transaction.oncomplete = () => resolve();
        transaction.onabort = transaction.onerror = () => reject(transaction.error);
        const store = transaction.objectStore(storeName);
        req = store.get(key);
      });
      return req!?.result;
    };
    const root = await get<Map<string, any>>('!root');
    const ino = root
      ?.get('/')
      ?.get('browser_os_home')
      ?.get('.kaitian')
      ?.get('settings.json')
      ?.get(0)?.ino;

    if (typeof ino !== 'undefined') {
      return get<Uint8Array>(ino);
    }
  } finally {
    if (db) {
      // 销毁 legacy db
      db.close();
      indexedDB.deleteDatabase(dbName);
    }
  }
};

export const migrateSettings = async () => {
  try {
    const migrateSettingsKey = 'acr.migratedSettings';
    if (localStorage.getItem(migrateSettingsKey)) {
      return;
    }
    localStorage.setItem(migrateSettingsKey, '1');
    const content = await getLegacyACRSettings();
    if (!content) {
      return;
    }
    // launch 阶段 home filesystem 初始化完毕，方可写入
    const settingsPath = posix.join(HOME_ROOT, STORAGE_DIR, USER_PREFERENCE_URI.codeUri.path);
    await fse.ensureFile(settingsPath);
    await fse.writeFile(settingsPath, Buffer.from(content));
  } catch (err: any) {
    console.warn(`[ALEX ACR: Migrate Error: ${err?.message ?? ''}`);
  }
};
