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
  KeybindingContribution,
  KeybindingRegistry,
  MonacoContribution,
  MonacoService,
  ServiceNames,
} from '@ali/ide-core-browser';
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
import { BreadCrumbServiceImpl } from '@ali/ide-editor/lib/browser/breadcrumb';
import { IBreadCrumbService } from '@ali/ide-editor/lib/browser/types';
import { EditorHistoryService, EditorHistoryState } from '@ali/ide-editor/lib/browser/history';
import { IEditorDocumentModelService } from '@ali/ide-editor/lib/browser/doc-model/types';
import { FileSchemeDocumentProvider } from '@ali/ide-file-scheme/lib/browser/file-doc';
import { FILE_SCHEME } from '@ali/ide-file-scheme/lib/common';
import { quickCommand } from '@ali/ide-quick-open/lib/browser/quick-open.contribution';

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

/**
 * 获取 history 跳转时机，由外部控制
 */
@Injectable()
class EditorHistoryServiceOverride extends EditorHistoryService {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  restoreState(state: EditorHistoryState) {
    if (!state) return;

    const {
      uri,
      position: { lineNumber },
    } = state;
    // 非 file 协议外部无法处理，直接内部打开
    if (uri.scheme !== 'file') {
      return super.restoreState(state);
    }
    const documentModel = select((props) => props.documentModel);
    const onLineNumberChange = () => {
      documentModel.onLineNumberChange?.(lineNumber || 1);
    };

    if ('filepath' in documentModel) {
      let rootPath = '';
      if (isCodeDocumentModel(documentModel)) {
        rootPath = path.join(this.appConfig.workspaceDir, encodeURIComponent(documentModel.ref));
      } else {
        rootPath = this.appConfig.workspaceDir;
      }
      const relativePath = path.relative(rootPath, uri.path.toString());
      if (relativePath !== documentModel.filepath) {
        documentModel.onFilepathChange?.(relativePath);
        setTimeout(() => {
          onLineNumberChange();
        });
      } else {
        onLineNumberChange();
      }
    } else {
      const res = super.restoreState(state);
      // controlled
      onLineNumberChange();
      return res;
    }
  }
}

@Domain(
  FileSystemContribution,
  BrowserEditorContribution,
  ClientAppContribution,
  CommandContribution,
  KeybindingContribution,
  MonacoContribution
)
class EditorSpecialContribution
  extends Disposable
  implements
    FileSystemContribution,
    BrowserEditorContribution,
    ClientAppContribution,
    CommandContribution,
    KeybindingContribution,
    MonacoContribution {
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

  @Autowired()
  monacoService: MonacoService;

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
    // TODO: 暂时只有读，先去掉，避免编码改变导致的问题
    // this.scmService.registerSCMProvider({
    //   id: 'editor0',
    //   label: 'editor',
    //   contextValue: 'editor',
    //   getOriginalResource: (uri: Uri) => {
    //     return Promise.resolve(
    //       uri.with({ path: `${SCM_ROOT}${uri.path.slice(this.appConfig.workspaceDir.length)}` })
    //     );
    //   },
    //   groups: new Sequence(),
    //   onDidChangeResources: new Emitter<void>().event,
    //   onDidChange: new Emitter<void>().event,
    //   toJSON: () => ({}),
    //   dispose: () => {},
    // });
  }

  onDidRestoreState() {
    const documentModel = select((props) => props.documentModel);

    if (isCodeDocumentModel(documentModel)) {
      this.openEditorForCode(documentModel.ref, documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        onSelect(
          (props) => props.documentModel,
          (newModel: CodeDocumentModel, oldModel: CodeDocumentModel) =>
            newModel.filepath === oldModel.filepath && newModel.ref === oldModel.ref
        )((newModel: CodeDocumentModel) => {
          this.openEditorForCode(newModel.ref, newModel.filepath);
        })
      );
    } else {
      this.openEditorForFs(documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        onSelect((props) => props.documentModel.filepath)((newFilepath) => {
          this.openEditorForFs(newFilepath);
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
  }

  private openEditorForFs(relativePath?: string) {
    if (!relativePath) return;
    const uri = URI.file(path.join(this.appConfig.workspaceDir, relativePath));
    this.editorService.open(uri, {
      preview: true,
      // 始终只显示一个，目前切换编码，preview 会消失，可能得在 kaitian 中修复下
      replace: true,
      // 禁用 file tree 跳转
      disableNavigate: true,
    });
  }

  private openEditorForCode(ref?: string, filepath?: string) {
    if (!ref || !filepath) return;
    return this.openEditorForFs(`${encodeURIComponent(ref)}/${filepath}`);
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
            rootUri: URI.file(this.appConfig.workspaceDir).resolve(
              encodeURIComponent(documentModel.ref)
            ).codeUri,
          };
        },
      }
    );

    // 注销命令
    registry.unregisterCommand(quickCommand.id);
    registry.registerCommand(quickCommand);
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
          // 延迟高亮，否则不居中
          setTimeout(() => {
            editor.monacoEditor.revealLineInCenter(Number(lineNumber));
            oldClickDecorations = editor.monacoEditor.deltaDecorations(oldClickDecorations, [
              {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                  isWholeLine: true,
                  className: 'alex-line-content',
                },
              },
            ]);
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

  registerKeybindings(keybindings: KeybindingRegistry) {
    [
      'ctrlcmd+,',
      'ctrlcmd+shift+p',
      'ctrlcmd+p',
      'F1',
      'alt+n',
      'alt+shift+t',
      'alt+shift+w',
      'ctrlcmd+\\',
    ].forEach((binding) => {
      keybindings.unregisterKeybinding(binding);
    });
  }

  onMonacoLoaded(monacoService: MonacoService) {
    const codeEditorService = monacoService.getOverride(ServiceNames.CODE_EDITOR_SERVICE);
    const _openCodeEditor = codeEditorService.openCodeEditor;
    codeEditorService.openCodeEditor = (
      input: monaco.editor.IResourceInput,
      source?: monaco.editor.ICodeEditor,
      sideBySide?: boolean
    ) => {
      return this.openCodeEditor(
        () => _openCodeEditor.call(codeEditorService, input, source, sideBySide),
        input,
        source,
        sideBySide
      );
    };
  }

  /**
   * 获取内部跳转的时机
   */
  async openCodeEditor(
    raw: Function,
    input: monaco.editor.IResourceInput,
    source?: monaco.editor.ICodeEditor,
    sideBySide?: boolean
  ) {
    // 非 file 协议外部无法处理，直接内部打开
    if (input.resource.scheme !== 'file') {
      return raw();
    }
    const documentModel = select((props) => props.documentModel);
    const onLineNumberChange = () => {
      if (input.options?.selection) {
        documentModel.onLineNumberChange?.(input.options?.selection.startLineNumber || 1);
      }
    };

    if ('filepath' in documentModel) {
      let rootPath = '';
      if (isCodeDocumentModel(documentModel)) {
        rootPath = path.join(this.appConfig.workspaceDir, encodeURIComponent(documentModel.ref));
      } else {
        rootPath = this.appConfig.workspaceDir;
      }
      const relativePath = path.relative(rootPath, input.resource.path);
      if (relativePath !== documentModel.filepath) {
        documentModel.onFilepathChange?.(relativePath);
        setTimeout(() => {
          onLineNumberChange();
        });
      } else {
        onLineNumberChange();
      }
    } else {
      const res = await raw();
      // controlled
      onLineNumberChange();
      return res;
    }
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
    {
      token: EditorHistoryService,
      useClass: EditorHistoryServiceOverride,
      override: true,
    },
    ThemeContribution,
    EditorSpecialContribution,
  ];
}
