import { Provider, Injectable, Autowired } from '@ali/common-di';
import {
  Domain,
  URI,
  AppConfig,
  BrowserModule,
  FsProviderContribution,
} from '@ali/ide-core-browser';
import { ExtensionServiceClientImpl, IExtensionNodeClientService } from '@alipay/alex-core';
import { IExtensionMetadata } from '@alipay/alex-shared';
import { IFileServiceClient } from '@ali/ide-file-service';
import { KaitianExtFsProvider } from '@alipay/alex-core';

import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser';

const KT_EXT_LOCAL_SCHEME = 'kt-ext-local';

/**
 * 这里不使用框架的 express-file-server 的文件形式 /assets?path=file 这种无法自动加载相对路径的 sourcemap 文件
 */
@Domain(StaticResourceContribution, FsProviderContribution)
export class FileServerContribution implements StaticResourceContribution, FsProviderContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired()
  private readonly ktExtFsProvider: KaitianExtFsProvider;

  registerStaticResolver(service: StaticResourceService): void {
    service.registerStaticResourceProvider({
      scheme: KT_EXT_LOCAL_SCHEME,
      resolveStaticResource: (uri: URI) => {
        return uri.withScheme(location.protocol.slice(0, -1));
      },
      roots: [location.origin],
    });
  }

  registerProvider(registry: IFileServiceClient) {
    registry.registerProvider(KT_EXT_LOCAL_SCHEME, this.ktExtFsProvider);
  }
}

/**
 * 加上本地调试用的插件
 */
@Injectable()
class ExtensionServiceClient extends ExtensionServiceClientImpl {
  async getAllExtensions(...args: any[]) {
    const remoteExtensions = await super.getAllExtensions(args[0], args[1], args[2], args[3]);
    const res = await fetch('/getLocalExtensions');
    const localExtensions: IExtensionMetadata[] = await res.json();
    // 转换类似纯前端下的 scheme path，保持和实际运行一致，否则对于本地资源和实际使用的 bfs 不一致
    localExtensions.forEach((ext) => {
      const extensionUri = URI.from({
        scheme: KT_EXT_LOCAL_SCHEME,
        authority: location.host,
        path: `/assets/~${ext.path}`,
      });
      ext.path = ext.realPath = extensionUri.toString(true);
      ext.uri = extensionUri.codeUri;
    });
    return [...remoteExtensions, ...localExtensions];
  }
}

@Injectable()
export class StartupModule extends BrowserModule {
  providers: Provider[] = [
    FileServerContribution,
    {
      token: IExtensionNodeClientService,
      useClass: ExtensionServiceClient,
      override: true,
    },
  ];
}
