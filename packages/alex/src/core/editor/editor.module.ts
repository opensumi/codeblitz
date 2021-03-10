import { Provider, Injectable, Autowired } from '@ali/common-di';
import debounce from 'lodash.debounce';
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
  Emitter,
  CommandContribution,
  CommandRegistry,
  Disposable,
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
import {
  WorkbenchEditorService,
  BrowserEditorContribution,
  EditorPreferences,
  IEditorFeatureRegistry,
  IEditor,
} from '@ali/ide-editor/lib/browser';
import { IEditorDocumentModelService } from '@ali/ide-editor/lib/browser/doc-model/types';
import { FileSchemeDocumentProvider } from '@ali/ide-file-scheme/lib/browser/file-doc';
import { FILE_SCHEME } from '@ali/ide-file-scheme/lib/common';
import * as path from 'path';
import md5 from 'md5';
import { IWorkspaceService } from '@ali/ide-workspace';
import { SCMService } from '@ali/ide-scm';
import { DirtyDiffWidget } from '@ali/ide-scm/lib/browser/dirty-diff/dirty-diff-widget';
import { IDETheme } from '../../core/extensions';
import { select, onSelect } from './container';
import { isCodeDocumentModel, CodeDocumentModel } from './types';

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
class FileSchemeDocumentProviderOverride extends FileSchemeDocumentProvider {
  async provideEncoding(uri: URI) {
    const encoding = select((props) => props.documentModel.encoding);
    if (uri.scheme === FILE_SCHEME && encoding) {
      return encoding;
    }
    return super.provideEncoding(uri);
  }
}

/**
 * editor 下无需 workspace 偏好，否则会导致请求报错
 * TODO：或许应该支持配置项来直接禁用
 */
@Injectable()
class WorkspacePreferenceProvider extends PreferenceProvider {
  constructor() {
    super();
    this._ready.resolve();
  }

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

@Injectable()
class FoldersPreferenceProvider extends PreferenceProvider {
  constructor() {
    super();
    this._ready.resolve();
  }

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
class ThemeContribution extends Disposable implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  protected readonly defaultPreferenceProvider: PreferenceProvider;

  async initialize() {
    this.themeService.registerThemes(
      IDETheme.packageJSON.contributes!.themes,
      URI.parse(getExtensionPath(IDETheme.extension))
    );
    // 强制用集成设置的默认主题
    await this.themeService.applyTheme(this.defaultPreferenceProvider.get('general.theme'));
  }
}

@Domain(
  FileSystemContribution,
  BrowserEditorContribution,
  ClientAppContribution,
  CommandContribution
)
class EditorSpecialContribution
  extends Disposable
  implements
    FileSystemContribution,
    BrowserEditorContribution,
    ClientAppContribution,
    CommandContribution {
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

  async mountFileSystem(rootFS: FileSystemInstance<'MountableFileSystem'>) {
    // TODO: 提供配置选择存储在内存中还是 indexedDB 中
    const {
      createFileSystem,
      FileSystem: { Editor, OverlayFS, FolderAdapter, InMemory },
    } = BrowserFS;
    const [editorSystem, memSystem] = await Promise.all([
      createFileSystem(Editor, {
        readFile: (filepath: string) => {
          const slashIndex = filepath.indexOf('/');
          return select((props) => props.documentModel.readFile)(filepath.slice(slashIndex + 1));
        },
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
    rootFS.mount(this.appConfig.workspaceDir, overlayFileSystem);
    rootFS.mount(SCM_ROOT, editorSystem);
    this.addDispose({
      dispose: () => {
        rootFS.umount(this.appConfig.workspaceDir);
        rootFS.umount(SCM_ROOT);
      },
    });
  }

  initialize() {
    // 提供写时 diff 视图
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
    const documentModel = select((props) => props.documentModel);

    if (isCodeDocumentModel(documentModel)) {
      this.openCodeEditor(documentModel.ref, documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        onSelect(
          (props) => props.documentModel,
          (newModel: CodeDocumentModel, oldModel: CodeDocumentModel) =>
            newModel.filepath === oldModel.filepath && newModel.ref === oldModel.ref
        )((newModel: CodeDocumentModel) => {
          this.openCodeEditor(newModel.ref, newModel.filepath);
        })
      );
    } else {
      this.openEditor(documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        onSelect((props) => props.documentModel.filepath)((newFilepath) => {
          this.openEditor(newFilepath);
        })
      );
    }

    this.addDispose(
      onSelect((props) => props.documentModel.encoding)((encoding) => {
        if (encoding) {
          const resource = this.editorService.currentResource;
          if (resource) {
            this.editorDocumentModelService.changeModelOptions(resource.uri, {
              encoding,
            });
          }
        }
      })
    );

    this.addDispose(
      this.editorService.onActiveResourceChange((resource) => {
        if (!resource) return;
        const documentModel = select((props) => props.documentModel);
        let rootPath = '';
        if (isCodeDocumentModel(documentModel)) {
          rootPath = path.join(this.appConfig.workspaceDir, documentModel.ref);
        } else {
          rootPath = this.appConfig.workspaceDir;
        }
        const relativePath = path.relative(rootPath, resource.uri.codeUri.path);
        select((props) => props.documentModel.onFilepathChange)?.(relativePath);
      })
    );
  }

  private openEditor(relativePath?: string) {
    if (!relativePath) return;
    const uri = URI.file(path.join(this.appConfig.workspaceDir, relativePath));
    this.editorService.open(uri, {
      preview: true,
      // 始终只显示一个，目前切换编码，preview 会消失，可能得在 kaitian 中修复下
      replace: true,
    });
  }

  private openCodeEditor(ref?: string, filepath?: string) {
    if (!ref || !filepath) return;
    return this.openEditor(`${encodeURIComponent(ref)}/${filepath}`);
  }

  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(
      { id: 'alex.codeServiceProject' },
      {
        execute: () => {
          const documentModel = select((props) => props.documentModel);
          if (!isCodeDocumentModel(documentModel)) return;
          return {
            platform: 'antcode',
            project: `${documentModel.owner}/${documentModel.name}`,
            commit: documentModel.ref,
            rootUri: URI.file(this.appConfig.workspaceDir).resolve(documentModel.ref).codeUri,
          };
        },
      }
    );
  }

  registerEditorFeature(registry: IEditorFeatureRegistry) {
    registry.registerEditorFeatureContribution({
      contribute: (editor: IEditor) => {
        const disposer = new Disposable();
        let oldHoverDecorations: string[] = [];
        disposer.addDispose(
          editor.monacoEditor.onMouseMove(
            debounce((event) => {
              const type = event?.target?.type;
              if (
                type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
                type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
              ) {
                const lineNumber = event.target.position!.lineNumber;
                oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, [
                  {
                    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                    options: {
                      className: 'alex-line-content',
                      glyphMarginClassName: `alex-line-glyph-margin}`,
                    },
                  },
                ]);
              } else {
                oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, []);
              }
            }, 10)
          )
        );
        let oldClickDecorations: string[] = [];
        const highlightLine = (lineNumber: number) => {
          oldClickDecorations = editor.monacoEditor.deltaDecorations(oldClickDecorations, [
            {
              range: new monaco.Range(lineNumber, 1, lineNumber, 1),
              options: {
                isWholeLine: true,
                className: 'alex-line-content',
              },
            },
          ]);
          // 延迟高亮，否则不居中
          setTimeout(() => {
            editor.monacoEditor.revealLineInCenter(Number(lineNumber));
          }, 0);
        };

        disposer.addDispose(
          editor.monacoEditor.onMouseDown((event) => {
            const type = event?.target?.type;
            if (
              type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
              type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
            ) {
              const lineNumber = event.target.position!.lineNumber;
              // 非受控
              if (!('lineNumber' in select((props) => props.documentModel))) {
                highlightLine(lineNumber);
              }
              select((props) => props.documentModel.onLineNumberChange)?.(lineNumber);
            }
          })
        );

        disposer.addDispose(
          editor.monacoEditor.onDidChangeModel(() => {
            const initialLineNumber = select((props) => props.documentModel.lineNumber);
            if (initialLineNumber) {
              highlightLine(initialLineNumber);
            }
          })
        );

        disposer.addDispose(
          onSelect((props) => props.documentModel.lineNumber)((newLineNumber) => {
            if (newLineNumber) {
              highlightLine(newLineNumber);
            }
          })
        );
        return disposer;
      },
    });
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
      token: FileSchemeDocumentProvider,
      useClass: FileSchemeDocumentProviderOverride,
      override: true,
    },
    {
      token: PreferenceProvider,
      useClass: WorkspacePreferenceProvider,
      tag: PreferenceScope.Workspace,
      override: true,
    },
    {
      token: PreferenceProvider,
      useClass: FoldersPreferenceProvider,
      tag: PreferenceScope.Folder,
      override: true,
    },
    ThemeContribution,
    EditorSpecialContribution,
  ];
}
