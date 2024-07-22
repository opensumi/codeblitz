import { Autowired } from '@opensumi/di';
import { Domain, FsProviderContribution, Schemes, URI } from '@opensumi/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@opensumi/ide-core-browser/lib/static-resource/static.definition';
import { IFileServiceClient } from '@opensumi/ide-file-service';

import { EXT_SCHEME } from '../../common/constant';
import { OpenSumiExtFsProvider } from './extension-fs.provider';

/**
 * @class 扩展静态资源转换
 */
@Domain(StaticResourceContribution, FsProviderContribution)
export class KtExtFsProviderContribution implements StaticResourceContribution, FsProviderContribution {
  @Autowired()
  private readonly ktExtFsProvider: OpenSumiExtFsProvider;

  registerStaticResolver(service: StaticResourceService): void {
    // 直接依赖插件市场内置的插件服务，无需抽象外部依赖
    // 处理 kt-ext 的协议内容获取
    service.registerStaticResourceProvider({
      scheme: EXT_SCHEME,
      resolveStaticResource: (uri: URI) => {
        // kt-ext 协议统一走 scheme 头转换为 https
        return uri.withScheme('https');
      },
      roots: [
        'https://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com',
        'https://gw.alipayobjects.com',
      ],
    });
  }

  registerProvider(registry: IFileServiceClient) {
    registry.registerProvider(EXT_SCHEME, this.ktExtFsProvider);
    // 一些插件读取文件会直接走 https/http 协议
    registry.registerProvider(Schemes.https, this.ktExtFsProvider);
    registry.registerProvider(Schemes.http, this.ktExtFsProvider);
  }
}
