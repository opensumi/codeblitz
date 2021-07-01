import { Injectable } from '@ali/common-di';
import { memoize } from '@ali/ide-core-common';
import { diff_match_patch as diffMatchPatch } from 'diff-match-patch';

import { IDmpService } from './common';

/**
 * 避免内存开销，仅保留一个 dmp 实例
 */
@Injectable()
export class DmpServiceImpl implements IDmpService {
  @memoize
  public get dmpInstance() {
    return new diffMatchPatch();
  }
}
