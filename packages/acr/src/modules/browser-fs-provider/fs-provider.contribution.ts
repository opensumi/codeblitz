import { Autowired } from '@ali/common-di';
import {
  Domain,
  ResourceResolverContribution,
  URI,
  FsProviderContribution,
  AppConfig,
} from '@ali/ide-core-browser';
import { FileResource } from '@ali/ide-file-service/lib/browser/file-service-contribution';
import { IFileServiceClient } from '@ali/ide-file-service';
import { FileServiceClient } from '@ali/ide-file-service/lib/browser/file-service-client';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser/static.definition';
import { IWorkspaceService } from '@ali/ide-workspace';
import * as paths from '@ali/ide-core-common/lib/path';

import { BrowserFsProvider } from './fs-provider';
import { BrowserEditorContribution, ResourceService } from '@ali/ide-editor/lib/browser';
import { ExtendedFileSystemResourceProvider } from './fs-resource-provider';
import { fromSCMUri } from '../../utils/scm-uri';
import { IAntcodeService } from '../antcode-service/base';
import { BROWSER_FS_HOME_DIR } from '../../common/file-system';

const EXPRESS_SERVER_PATH = window.location.href;

// file 文件资源 远程读取
@Domain(
  ResourceResolverContribution,
  StaticResourceContribution,
  BrowserEditorContribution,
  FsProviderContribution
)
export class FileProviderContribution
  implements
    ResourceResolverContribution,
    StaticResourceContribution,
    BrowserEditorContribution,
    FsProviderContribution {
  @Autowired(IFileServiceClient)
  private readonly fileSystem: FileServiceClient;

  @Autowired()
  private readonly fileSystemResourceProvider: ExtendedFileSystemResourceProvider;

  @Autowired(AppConfig)
  private readonly appConfig: AppConfig;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  async resolve(uri: URI): Promise<FileResource | void> {
    if (uri.scheme !== 'file') {
      return;
    }
    const resource = new FileResource(uri, this.fileSystem);
    await resource.init();
    return resource;
  }

  registerProvider(registry: IFileServiceClient) {
    // 处理 file 协议的文件部分
    registry.registerProvider('file', new BrowserFsProvider({}));
  }

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
          BROWSER_FS_HOME_DIR.relative(rootUri).toString()
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
