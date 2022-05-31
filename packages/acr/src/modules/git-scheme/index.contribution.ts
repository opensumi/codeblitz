import { Autowired } from '@opensumi/di';
import { Domain } from '@opensumi/ide-core-common';
import { LRUMap, URI } from '@opensumi/ide-core-browser';
import { getLanguageIdFromMonaco } from '@opensumi/ide-core-browser/lib/services';
import { IResource, IDiffResource } from '@opensumi/ide-editor/lib/common';
import {
  EditorComponentRegistry,
  IEditorDocumentModelContentRegistry,
  BrowserEditorContribution,
  ResourceService,
} from '@opensumi/ide-editor/lib/browser';
import { GitDocContentProvider } from './doc-content-provider/git';
import { GitResourceProvider } from './resource-provider/git';
import { IAntcodeService } from '../antcode-service/base';
import { DiffView } from './diff.view';
import { DiskFileSystemProvider } from '@alipay/alex-core/lib/server/file-service/disk-file-system.provider';

// kaitian 中这里组件只用在 file 上，这里相当于用同名 id，来渲染对应组件
// TODO: kaitian 导出组件 id
const IMAGE_PREVIEW_COMPONENT_ID = 'image-preview';
const EXTERNAL_OPEN_COMPONENT_ID = 'external-file';

/**
 * 这里的 override 主要是希望直接使用 IAntcodeService
 * 而不是 ide-fw 中的 ICodeService, 保持尽量少的 API
 */
@Domain(BrowserEditorContribution)
export class GitSchemeContribution implements BrowserEditorContribution {
  @Autowired()
  private readonly gitResourceProvider: GitResourceProvider;

  @Autowired()
  private readonly gitDocContentProvider: GitDocContentProvider;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private cachedFileType = new LRUMap<string, string | undefined>(200, 100);

  registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry) {
    // 注册 git content provider provider 提供 doc / 文档的内容和 meta 信息
    registry.registerEditorDocumentModelContentProvider(
      // @ts-ignore
      this.gitDocContentProvider
    );
  }

  registerEditorComponent(editorComponentRegistry: EditorComponentRegistry) {
    // 处理 git 协议的 editor component type
    editorComponentRegistry.registerEditorComponentResolver(
      'git',
      (resource: IResource, results) => {
        const type = this.getFileType(resource.uri);
        if (type === 'image') {
          results.push({
            type: 'component',
            componentId: IMAGE_PREVIEW_COMPONENT_ID,
          });
        } else if (type === 'binary') {
          results.push({
            type: 'component',
            componentId: EXTERNAL_OPEN_COMPONENT_ID,
          });
        } else {
          // TODO: 处理 video 等文件，参照 packages/file-scheme/src/browser/file-scheme.contribution.ts
          results.push({
            type: 'code',
          });
        }
      }
    );

    // 针对非 text 的 diff 视图，kaitian 中也未处理，这里先临时简单实现下
    editorComponentRegistry.registerEditorComponentResolver(
      'diff',
      (resource: IDiffResource, results, resolve) => {
        const { modified } = resource.metadata || {};
        // diff 下 modified 和 original 和 type 一致，否则就是 deleted 和 added
        if (modified && this.getFileType(modified) !== 'text') {
          resolve([
            {
              type: 'component',
              componentId: 'diff-view',
            },
          ]);
        }
      }
    );

    editorComponentRegistry.registerEditorComponent(
      {
        uid: 'diff-view',
        component: DiffView,
      },
      {
        getFileType: (resource: IDiffResource) => {
          return this.getFileType(resource.metadata!.modified);
        },
      }
    );
  }

  registerResource(resourceService: ResourceService) {
    // 处理 git 协议的 editor tab 展示信息
    resourceService.registerResourceProvider(this.gitResourceProvider);
  }

  private getFileType(uri: URI): string | undefined {
    const uriString = uri.toString();
    if (!this.cachedFileType.has(uriString)) {
      if (getLanguageIdFromMonaco(uri)) {
        // 对于已知 language 对应扩展名的文件，当 text 处理
        this.cachedFileType.set(uriString, 'text');
      } else {
        this.cachedFileType.set(uriString, this.getRealFileType(uri));
      }
    }
    return this.cachedFileType.get(uriString);
  }

  private getRealFileType(uri: URI) {
    // TODO: 图片也被识别为 binary，导致图片无法展示，暂时还是根据后缀判断
    // 需要 code 接口进一步支持，同时二进制文件支持下载
    // code 接口上 binaryFile 标识是否为二进制文件，先根据这个判断，再根据后缀判断
    // const change = this.antcodeService.getChangeByUri(uri);
    // if (change?.binaryFile) {
    //   return 'binary';
    // }
    let type = 'text';
    let {
      path: { ext },
    } = uri;
    ext = ext.startsWith('.') ? ext.slice(1) : ext;
    if (['png', 'gif', 'jpg', 'jpeg', 'svg'].indexOf(ext) > -1) {
      type = 'image';
    } else if (DiskFileSystemProvider.BinaryExtList.indexOf(ext) > -1) {
      type = 'binary';
    }
    return type;
  }
}
