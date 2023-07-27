import { Injectable } from '@opensumi/di';
import { OperatingSystem } from '@opensumi/ide-core-common';
import { ICommonServer } from './base';

@Injectable()
export class CommonServer implements ICommonServer {
  async getBackendOS() {
    // 使用 linux 作为 server，path 保持 posix 风格
    return OperatingSystem.Linux;
  }
}
