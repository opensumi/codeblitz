import { Autowired, Injectable } from '@opensumi/di';
import { AppConfig, Domain, path as paths, URI } from '@opensumi/ide-core-browser';
import {
  StaticResourceContribution as CoreStaticResourceContribution,
  StaticResourceService,
} from '@opensumi/ide-core-browser/lib/static-resource';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { IPropsService } from '../../props.service';
import { fromSCMUri } from '../../utils';
import { CodeDocumentModel, EditorProps } from '../types';

const EXPRESS_SERVER_PATH = window.location.href;

// file 文件资源 远程读取
@Domain(CoreStaticResourceContribution)
export class EditorStaticResourceContribution implements CoreStaticResourceContribution {
  @Autowired(AppConfig)
  private readonly appConfig: AppConfig;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IPropsService)
  propsService: IPropsService<EditorProps>;

  registerStaticResolver(service: StaticResourceService): void {
    // 用来打开 raw 文件，如 jpg
    service.registerStaticResourceProvider({
      scheme: 'file',
      resolveStaticResource: (uri: URI) => {
        const documentModel = this.propsService.props.documentModel;

        if (
          !(this.appConfig.staticServicePath
            || (documentModel && (documentModel as CodeDocumentModel).resolveStaticResourcePath))
        ) {
          return uri;
        }

        // 将 file 协议转为代码托管平台提供的 raw 服务
        const assetsUri = new URI(this.appConfig.staticServicePath!);
        const rootUri = new URI(this.workspaceService.workspace?.uri!);
        const relativePath = rootUri.relative(uri);
        if (!relativePath) {
          return uri;
        }

        // FIXME: 由于 resolveStaticResource 是同步方法，这里 hardcode 了 workspaceManagerService 的实现
        let relativePathStr = relativePath.toString();

        // trim leading whitespace
        if (relativePathStr.startsWith(paths.Path.separator)) {
          relativePathStr = relativePathStr.slice(1);
        }

        if (documentModel && (documentModel as CodeDocumentModel).resolveStaticResourcePath) {
          return (documentModel as CodeDocumentModel).resolveStaticResourcePath!(
            documentModel as CodeDocumentModel,
          );
        }
        return assetsUri.withPath(assetsUri.path.join(relativePathStr));
      },
      roots: [this.appConfig.staticServicePath || EXPRESS_SERVER_PATH],
    });
  }
}
