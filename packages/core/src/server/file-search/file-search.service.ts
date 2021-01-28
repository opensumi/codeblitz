import { Injectable } from '@ali/common-di';
import { IFileSearchService } from './base';

@Injectable()
export class FileSearchService implements IFileSearchService {
  // 避免文件搜索面板打开报错
  async find(): Promise<string[]> {
    return Promise.resolve([]);
  }
}
