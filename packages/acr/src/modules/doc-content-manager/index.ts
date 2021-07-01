import { Autowired, Injectable } from '@ali/common-di';

import { IGitDocContentManager } from './base';
import { IAntcodeService } from '../antcode-service/base';

/**
 * 在内存中做一个 git file content 的缓存
 * 后续可能会把一部分内容做持久化 (要考虑销毁时机)
 */
@Injectable()
export class GitDocContentManager implements IGitDocContentManager {
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private _fileContentCacheMap = new Map<string /* fs path */, string /* content */>();

  async getContentByPathWithRef(path: string, ref: string): Promise<string> {
    const content = await this.antcodeService.getFileContentByRef(path, ref);
    // @ts-ignore
    return content;
  }
}
