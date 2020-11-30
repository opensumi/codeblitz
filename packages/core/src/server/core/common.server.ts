import { Injectable } from '@ali/common-di';
import { ICommonServer, OS } from '@ali/ide-core-common';

@Injectable()
export class CommonServer implements ICommonServer {
  async getBackendOS(): Promise<OS.Type> {
    // 使用 linux 作为 server，path 保持 posix 风格
    return OS.Type.Linux;
  }
}
