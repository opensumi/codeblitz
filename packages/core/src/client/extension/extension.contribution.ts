import { Autowired } from '@opensumi/di';
import { Domain, URI, FsProviderContribution } from '@opensumi/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@opensumi/ide-static-resource/lib/browser/static.definition';
import { IFileServiceClient } from '@opensumi/ide-file-service';

import { KaitianExtFsProvider } from './extension-fs.provider';
import { EXT_SCHEME } from '../../common/constant';

/**
 * @class 扩展静态资源转换
 */
@Domain(StaticResourceContribution, FsProviderContribution)
export class KtExtFsProviderContribution
  implements StaticResourceContribution, FsProviderContribution
{
  @Autowired()
  private readonly ktExtFsProvider: KaitianExtFsProvider;

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
  }
}
