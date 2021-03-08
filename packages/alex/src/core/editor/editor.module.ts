import { Provider, Injectable, Autowired } from '@ali/common-di';
import {
  BrowserModule,
  ClientAppContribution,
  URI,
  Uri,
  Domain,
  getPreferenceThemeId,
  CommandService,
  PreferenceProvider,
  PreferenceScope,
  IDisposable,
  Emitter,
} from '@ali/ide-core-browser';
import { Sequence } from '@ali/ide-core-common/lib/sequence';
import { BreadCrumbServiceImpl } from '@ali/ide-editor/lib/browser/breadcrumb';
import { IBreadCrumbService } from '@ali/ide-editor/lib/browser/types';
import { IThemeService } from '@ali/ide-theme';
import {
  getExtensionPath,
  AppConfig,
  BrowserFS,
  FileSystemContribution,
  FileSystemInstance,
  SCM_ROOT,
} from '@alipay/alex-core';
import { WorkbenchEditorService, BrowserEditorContribution } from '@ali/ide-editor/lib/browser';
import { FileServiceClient } from '@ali/ide-file-service/lib/browser/file-service-client';
import { IFileServiceClient } from '@ali/ide-file-service/lib/common';
import { IEditorDocumentModelService } from '@ali/ide-editor/lib/browser/doc-model/types';
import { EditorPreferences } from '@ali/ide-editor/lib/browser';
import * as path from 'path';
import md5 from 'md5';
import { IWorkspaceService } from '@ali/ide-workspace';
import { SCMService } from '@ali/ide-scm';
import { DirtyDiffWidget } from '@ali/ide-scm/lib/browser/dirty-diff/dirty-diff-widget';
import { IDETheme } from '../../core/extensions';
import { select, onSelect } from './container';

// TODO: 此处 diff 的 stage 和 revertChange 应该是 git 注册的，框架中直接添加了按钮，耦合，需要修复实现 scm/change/title
// @ts-ignore
const _addAction = DirtyDiffWidget.prototype._addAction;
// @ts-ignore
DirtyDiffWidget.prototype._addAction = function (icon: string, type: any) {
  if (icon === 'plus' || icon === 'rollback') return;
  _addAction.call(this, icon, type);
};

@Injectable()
class BreadCrumbServiceImplOverride extends BreadCrumbServiceImpl {
  getBreadCrumbs() {
    return undefined;
  }
}

@Injectable()
class FileServiceClientOverride extends FileServiceClient {
  getEncoding() {
    return Promise.resolve(select((props) => props.documentModel.encoding) || 'utf8');
  }
}

/**
 * editor 下无需 workspace 偏好，否则会导致请求报错
 * TODO：或许应该支持配置项来直接禁用
 */
@Injectable()
class WorkspacePreferenceProvider extends PreferenceProvider {
  getPreferences() {
    return undefined;
  }

  getLanguagePreferences() {
    return undefined;
  }

  doSetPreference() {
    return Promise.resolve(false);
  }
}

@Domain(ClientAppContribution)
class ThemeContribution implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  async initialize() {
    this.themeService.registerThemes(
      IDETheme.packageJSON.contributes!.themes,
      URI.parse(getExtensionPath(IDETheme.extension))
    );
    await this.themeService.applyTheme(getPreferenceThemeId());
  }
}

@Domain(FileSystemContribution, BrowserEditorContribution, ClientAppContribution)
class EditorSpecialContribution
  implements FileSystemContribution, BrowserEditorContribution, ClientAppContribution {
  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(CommandService)
  commandService: CommandService;

  @Autowired(EditorPreferences)
  editorPreferences: EditorPreferences;

  @Autowired(IEditorDocumentModelService)
  private editorDocumentModelService: IEditorDocumentModelService;

  @Autowired(IWorkspaceService)
  workspaceService: IWorkspaceService;

  @Autowired(SCMService)
  scmService: SCMService;

  private readonly disposables: IDisposable[] = [];

  async mountFileSystem(rootFS: FileSystemInstance<'MountableFileSystem'>) {
    // TODO: 提供配置选择存储在内存中还是 indexedDB 中
    const {
      createFileSystem,
      FileSystem: { Editor, OverlayFS, FolderAdapter, InMemory },
    } = BrowserFS;
    const [editorSystem, memSystem] = await Promise.all([
      createFileSystem(Editor, {
        readFile: select((props) => props.documentModel.readFile),
      }),
      createFileSystem(InMemory, {}),
    ]);
    const folderSystem = await createFileSystem(FolderAdapter, {
      wrapped: memSystem,
      folder: `/${md5(this.appConfig.workspaceDir)}`,
    });
    await new Promise<void>((resolve, reject) => {
      (folderSystem as InstanceType<typeof FolderAdapter>).initialize((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const overlayFileSystem = await createFileSystem(OverlayFS, {
      readable: editorSystem,
      writable: folderSystem,
    });
    // return {
    //   codeFileSystem,
    //   idbFileSystem,
    //   folderSystem,
    //   overlayFileSystem,
    // };
    rootFS.mount(this.appConfig.workspaceDir, overlayFileSystem);
    rootFS.mount(SCM_ROOT, editorSystem);
    this.disposables.push({
      dispose: () => {
        rootFS.umount(this.appConfig.workspaceDir);
        rootFS.umount(SCM_ROOT);
      },
    });
  }

  initialize() {
    // 切换分支需更改工作区
    // onSelect(props => props.workspaceDir)(() => {
    //   this.workspaceService.setWorkspace()
    // })
    this.scmService.registerSCMProvider({
      id: 'editor0',
      label: 'editor',
      contextValue: 'editor',
      getOriginalResource: (uri: Uri) => {
        return Promise.resolve(
          uri.with({ path: `${SCM_ROOT}${uri.path.slice(this.appConfig.workspaceDir.length)}` })
        );
      },
      groups: new Sequence(),
      onDidChangeResources: new Emitter<void>().event,
      onDidChange: new Emitter<void>().event,
      toJSON: () => ({}),
      dispose: () => {},
    });
  }

  onDidRestoreState() {
    const filepath = select((props) => props.documentModel.filepath);
    // const readonly = select(props => props.documentModel.readonly)
    if (filepath) {
      // const readonlyFiles = this.editorPreferences['editor.readonlyFiles'].s
      this.openEditor(filepath);
    }

    // 监听 props 变化
    onSelect((props) => props.documentModel.filepath)((newFilepath) => {
      this.openEditor(newFilepath);
    });

    onSelect((props) => props.documentModel.encoding)((encoding) => {
      if (encoding) {
        const resource = this.editorService.currentResource;
        if (resource) {
          this.editorDocumentModelService.changeModelOptions(resource.uri, {
            encoding,
          });
        }
      }
    });
  }

  private openEditor(relativePath: string) {
    const uri = URI.file(path.join(this.appConfig.workspaceDir, relativePath));
    this.editorService.open(uri, {
      preview: true,
    });
  }

  dispose() {
    this.disposables.forEach((disposer) => disposer.dispose());
  }
}

@Injectable()
export class EditorSpecialModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IBreadCrumbService,
      useClass: BreadCrumbServiceImplOverride,
      override: true,
    },
    {
      token: IFileServiceClient,
      useClass: FileServiceClientOverride,
      override: true,
    },
    {
      token: PreferenceProvider,
      useClass: WorkspacePreferenceProvider,
      tag: PreferenceScope.Workspace,
      override: true,
    },
    ThemeContribution,
    EditorSpecialContribution,
  ];
}
