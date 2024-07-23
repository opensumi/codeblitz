/**
 * 参考 https://github.com/npm/write-file-atomic
 * 目前不考虑多线程的情况，因此只根据 filename 加锁即可
 */

import * as path from 'path';
import { fsExtra as fse } from './fs-extra';

const mutex = {
  _waiting: new Map<string, (() => void)[]>(),

  lock(path: string) {
    if (!this._waiting.has(path)) {
      this._waiting.set(path, []);
    }
    return new Promise<void>((resolve) => {
      const resolveList = this._waiting.get(path)!;
      resolveList.push(resolve);
      if (resolveList.length === 1) {
        resolve();
      }
    });
  },

  unlock(path: string) {
    if (!this._waiting.has(path)) {
      throw new Error(`no lock for ${path}`);
    }
    const resolveList = this._waiting.get(path)!;
    resolveList.shift();
    if (resolveList.length > 0) {
      resolveList[0]();
    } else {
      this._waiting.delete(path);
    }
  },
};

const writeFileAtomic = async (
  filename: string,
  data: any,
  options?: Record<string, any> | string,
) => {
  const absoluteName = path.resolve(filename);
  await mutex.lock(absoluteName);
  try {
    await fse.writeFile(absoluteName, data, options);
  } finally {
    mutex.unlock(absoluteName);
  }
};

export { writeFileAtomic, writeFileAtomic as writeFileAtomicAsync };
