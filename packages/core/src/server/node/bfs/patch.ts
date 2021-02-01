// @ts-nocheck
// patch
// 修复 stat 错误

import { BFSCallback } from 'browserfs/dist/node/core/file_system';
import { ApiError, ErrorCode } from 'browserfs/dist/node/core/api_error';
import Stats from 'browserfs/dist/node/core/node_fs_stats';
import { UnlockedOverlayFS } from 'browserfs/dist/node/backend/OverlayFS';

function makeModeWritable(mode: number): number {
  return 0o222 | mode;
}

UnlockedOverlayFS.prototype.stat = function (p: string, isLstat: boolean, cb: BFSCallback<Stats>) {
  if (!this.checkInitAsync(cb)) {
    return;
  }
  this._writable.stat(p, isLstat, (err: ApiError, stat?: Stats) => {
    if (err && err.errno === ErrorCode.ENOENT) {
      if (this._deletedFiles[p]) {
        cb(ApiError.ENOENT(p));
        return;
      }
      this._readable.stat(p, isLstat, (err: ApiError, stat?: Stats) => {
        if (stat) {
          stat = stat.clone();
          stat.mode = makeModeWritable(stat.mode);
        }
        cb(err, stat);
      });
    } else {
      cb(err, stat);
    }
  });
};
