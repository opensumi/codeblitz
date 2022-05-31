import { Autowired, Injectable } from '@opensumi/di';
import { Domain, URI, AppConfig, MaybePromise } from '@opensumi/ide-core-browser';
import {
  StaticResourceContribution as CoreStaticResourceContribution,
  StaticResourceService,
} from '@opensumi/ide-static-resource/lib/browser/static.definition';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import * as paths from '@opensumi/ide-core-common/lib/path';
import {
  BrowserEditorContribution,
  ResourceService,
  IResource,
} from '@opensumi/ide-editor/lib/browser';
import { fromSCMUri } from '../utils/scm-uri';
import { FileSystemResourceProvider } from '@opensumi/ide-editor/lib/browser/fs-resource/fs-resource';

const EXPRESS_SERVER_PATH = window.location.href;

@Injectable()
class ExtendedFileSystemResourceProvider extends FileSystemResourceProvider {
  constructor() {
    super();
  }

  handlesUri(uri: URI) {
    const weight = super.handlesUri(uri);
    if (weight === 10) {
      return 100 as any;
    }
    return weight;
  }

  provideResource(uri: URI): MaybePromise<IResource<any>> {
    // 为了让 file 协议文件不要默认打开
    return (super.provideResource(uri) as Promise<IResource<any>>).then((n) => ({
      ...n,
      supportsRevive: false,
    }));
  }
}

// file 文件资源 远程读取
@Domain(CoreStaticResourceContribution, BrowserEditorContribution)
export class StaticResourceContribution
  implements CoreStaticResourceContribution, BrowserEditorContribution
{
  @Autowired()
  private readonly fileSystemResourceProvider: ExtendedFileSystemResourceProvider;

  @Autowired(AppConfig)
  private readonly appConfig: AppConfig;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  // FIXME: 获取图片等文件
  registerStaticResolver(service: StaticResourceService): void {
    // 用来打开 raw 文件，如 jpg
    service.registerStaticResourceProvider({
      scheme: 'file',
      // @ts-ignore
      resolveStaticResource: (uri: URI) => {
        // file 协议统一走 scm raw 服务
        // https://127.0.0.1:8080/asset-service/v3/project/$repo/repository/blobs/$ref
        // GET /api/v3/projects/{id}/repository/blobs/{sha}
        const assetsUri = new URI(this.appConfig.staticServicePath || EXPRESS_SERVER_PATH);
        const rootUri = new URI(this.workspaceService.workspace?.uri!);
        const relativePath = rootUri.relative(uri);
        if (!relativePath) {
          return;
        }

        // FIXME: 由于 resolveStaticResource 是同步方法，这里 hardcode 了 workspaceManagerService 的实现
        let relativePathStr = relativePath.toString();
        const [ref] = paths.Path.splitPath(
          // @ts-ignore
          rootUri.toString()
        ).reverse();
        // trim leading whitespace
        if (relativePathStr.startsWith(paths.Path.separator)) {
          relativePathStr = relativePathStr.slice(1);
        }

        return assetsUri.withPath(assetsUri.path.join(ref, relativePathStr));
      },
      roots: [this.appConfig.staticServicePath || EXPRESS_SERVER_PATH],
    });
    service.registerStaticResourceProvider({
      scheme: 'git',
      resolveStaticResource: (uri: URI) => {
        const { ref, path } = fromSCMUri(uri);
        const assetsUri = new URI(this.appConfig.staticServicePath || EXPRESS_SERVER_PATH);
        return assetsUri.withPath(assetsUri.path.join(ref, path));
      },
      roots: [this.appConfig.staticServicePath || EXPRESS_SERVER_PATH],
    });
  }

  registerResource(resourceService: ResourceService) {
    // 注册 provider 处理 file scheme 对应的 icon/meta 等信息
    // 这里使用拓展过的 fs resource provider 主要是为了将 supportsRevive 置为 false
    resourceService.registerResourceProvider(this.fileSystemResourceProvider);
  }
}
