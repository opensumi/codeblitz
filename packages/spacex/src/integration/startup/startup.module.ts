import { Provider, Injectable, Autowired } from '@ali/common-di';
import { Domain, URI, AppConfig, BrowserModule } from '@ali/ide-core-browser';
import {
  ExtensionServiceClientImpl,
  IExtensionNodeClientService,
  NodeModule,
} from '@alipay/spacex-core';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser/static.definition';

/**
 * 这里不使用框架的 express-file-server 的文件形式 /assets?path=file 这种无法自动加载相对路径的 sourcemap 文件
 */
@Domain(StaticResourceContribution)
export class FileServerContribution implements StaticResourceContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  registerStaticResolver(service: StaticResourceService): void {
    service.registerStaticResourceProvider({
      scheme: 'file',
      resolveStaticResource: (uri: URI) => {
        return new URI(`${this.appConfig.staticServicePath}/assets/~${uri.codeUri.path}`);
      },
    });
  }
}

/**
 * 加上本地调试用的插件
 */
@Injectable()
class ExtensionServiceClient extends ExtensionServiceClientImpl {
  async getAllExtensions(...args: any[]) {
    const remoteExtensions = await super.getAllExtensions(args[0], args[1], args[2], args[3]);
    const res = await fetch('getLocalExtensions');
    const localExtensions = await res.json();
    return [...remoteExtensions, ...localExtensions];
  }
}

@Injectable()
export class StartupClientModule extends BrowserModule {
  providers: Provider[] = [FileServerContribution];
}

@Injectable()
export class StartupServerModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IExtensionNodeClientService,
      useClass: ExtensionServiceClient,
      override: true,
    },
  ];
}
