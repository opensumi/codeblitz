import { Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import { ServerAppContribution, ServerConfig } from '../core/app';
import { fsExtra as fse } from '../node';

@Domain(ServerAppContribution)
export class ExtensionManagerContribution implements ServerAppContribution {
  @Autowired(ServerConfig)
  private serverConfig: ServerConfig;

  async initialize() {
    // 初始化插件目录
    await fse.mkdirp(this.serverConfig.marketplace.extensionDir);
  }
}
