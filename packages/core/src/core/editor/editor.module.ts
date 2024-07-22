import {
  AppConfig,
  BrowserFS,
  FileSystemContribution,
  FileSystemInstance,
  getExtensionPath,
  RuntimeConfig,
  SCM_ROOT,
} from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable, Provider } from '@opensumi/di';
import {
  BrowserModule,
  ClientAppContribution,
  CommandContribution,
  CommandRegistry,
  CommandService,
  Disposable,
  Domain,
  IContextKeyService,
  IDisposable,
  KeybindingContribution,
  KeybindingRegistry,
  KeybindingRegistryImpl,
  MonacoContribution,
  MonacoService,
  PreferenceProvider,
  PreferenceScope,
  QUICK_OPEN_COMMANDS,
  ServiceNames,
  URI,
} from '@opensumi/ide-core-browser';
import { LayoutViewSizeConfig } from '@opensumi/ide-core-browser/lib/layout/constants';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';
import { uuid } from '@opensumi/ide-core-common';
import {
  BrowserEditorContribution,
  EditorCollectionService,
  EditorPreferences,
  IEditor,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser';
import { BreadCrumbServiceImpl } from '@opensumi/ide-editor/lib/browser/breadcrumb';
import { IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser/doc-model/types';
import { EditorHistoryService, EditorHistoryState } from '@opensumi/ide-editor/lib/browser/history';
import { IBreadCrumbService } from '@opensumi/ide-editor/lib/browser/types';
import { ICodeEditor } from '@opensumi/ide-editor/lib/common';
import { FileSchemeDocumentProvider } from '@opensumi/ide-file-scheme/lib/browser/file-doc';
import * as monaco from '@opensumi/ide-monaco';
import { ICSSStyleService, IThemeService } from '@opensumi/ide-theme';
import { FindController } from '@opensumi/monaco-editor-core/esm/vs/editor/contrib/find/browser/findController';
import { FindWidget } from '@opensumi/monaco-editor-core/esm/vs/editor/contrib/find/browser/findWidget';
import { ContextKeyDefinedExpr } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey';
import * as monacoKeybindings from '@opensumi/monaco-editor-core/esm/vs/platform/keybinding/common/keybindingsRegistry';
import debounce from 'lodash.debounce';

import { monacoBrowser } from '@opensumi/ide-monaco/lib/browser';
import { SCMService } from '@opensumi/ide-scm';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import md5 from 'md5';
import * as path from 'path';
import { AlexCommandContribution } from '../commands';
import { IDETheme } from '../extension/metadata';
import { IPropsService } from '../props.service';
import styles from '../style.module.less';
import { CodeDocumentModel, EditorProps, isCodeDocumentModel } from './types';

const ContextTrue = new RawContextKey('alex.context.true', undefined);
const ContextFalse = new RawContextKey('alex.context.false', undefined);

@Injectable()
class BreadCrumbServiceImplOverride extends BreadCrumbServiceImpl {
  getBreadCrumbs() {
    return undefined;
  }
}

@Injectable()
class FileSchemeDocumentProviderOverride extends FileSchemeDocumentProvider {
  @Autowired(IPropsService)
  propsService: IPropsService<EditorProps>;

  provideEncoding(uri: URI) {
    const encoding = this.propsService.props.documentModel.encoding;
    if (uri.scheme === 'file' && encoding) {
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
      URI.parse(getExtensionPath(IDETheme.extension, 'public')),
    );
    // 强制用集成设置的默认主题
    await this.themeService.applyTheme(
      this.defaultPreferenceProvider.get('general.theme') as string,
    );
  }
}

/**
 * 获取 history 跳转时机，由外部控制
 */
@Injectable()
class EditorHistoryServiceOverride extends EditorHistoryService {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IPropsService)
  propsService: IPropsService<EditorProps>;

  restoreState(state: EditorHistoryState) {
    if (!state) return;

    const {
      uri,
      position: { lineNumber },
    } = state;
    const documentModel = this.propsService.props.documentModel;
    if (uri.scheme !== 'file') {
      documentModel.onFilepathChange?.('');
      return super.restoreState(state);
    }
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
)
class EditorSpecialContribution extends Disposable
  implements
    FileSystemContribution,
    BrowserEditorContribution,
    ClientAppContribution,
    CommandContribution,
    KeybindingContribution
{
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

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(EditorCollectionService)
  private editorCollection: EditorCollectionService;

  @Autowired(IPropsService)
  private propsService: IPropsService<EditorProps>;

  @Autowired(ICSSStyleService)
  cssStyleService: ICSSStyleService;

  @Autowired(LayoutViewSizeConfig)
  protected layoutViewSize: LayoutViewSizeConfig;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

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
          return this.propsService.props.documentModel.readFile(filepath.slice(slashIndex + 1));
        },
        disableCache: this.propsService.props.editorConfig?.disableCache,
      }),
      createFileSystem(InMemory, {}),
    ]);
    const folderSystem = await createFileSystem(FolderAdapter, {
      wrapped: memSystem,
      folder: `/${md5(this.appConfig.workspaceDir)}`,
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
    // 恒为 true/false 的 contextKey
    ContextTrue.bind(this.globalContextKeyService);
    ContextFalse.bind(this.globalContextKeyService);

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

    // onStart阶段存在时序问题
    this.addDispose(
      this.editorCollection.onCodeEditorCreate((codeEditor: ICodeEditor) => {
        const disposer = this.contributeEditor(codeEditor);
        codeEditor.onDispose(() => {
          disposer.dispose();
        });
      }),
    );
  }

  onDidRestoreState() {
    const documentModel = this.propsService.props.documentModel;

    if (isCodeDocumentModel(documentModel)) {
      this.openEditorForCode(documentModel.ref, documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        this.propsService.onPropsChange(({ props, prevProps }) => {
          const newModel = props.documentModel as CodeDocumentModel;
          const oldModel = prevProps.documentModel as CodeDocumentModel;
          if (newModel.filepath !== oldModel.filepath || newModel.ref !== oldModel.ref) {
            this.openEditorForCode(newModel.ref, newModel.filepath);
          }
        }),
      );
    } else {
      this.openEditorForFs(documentModel.filepath);
      // 监听 props 变化
      this.addDispose(
        this.propsService.onPropsChange((e) => {
          if (e.affect('documentModel', 'filepath')) {
            this.openEditorForFs(e.props.documentModel.filepath);
          }
        }),
      );
    }

    this.addDispose(
      this.propsService.onPropsChange((e) => {
        if (e.affect('documentModel', 'encoding')) {
          const encoding = e.props.documentModel.encoding;
          if (encoding) {
            const resource = this.editorService.currentResource;
            if (resource) {
              this.editorDocumentModelService.changeModelOptions(resource.uri, {
                encoding,
              });
            }
          }
        }
      }),
    );
  }

  private openEditorForFs(relativePath?: string) {
    if (!relativePath) return;
    const uri = URI.file(path.join(this.appConfig.workspaceDir, relativePath));
    this.editorService.open(uri, {
      preview: true,
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
          const documentModel = this.propsService.props.documentModel;
          if (!isCodeDocumentModel(documentModel)) return;
          return {
            platform: 'github',
            project: `${documentModel.owner}/${documentModel.name}`,
            commit: documentModel.ref,
            rootUri: URI.file(this.appConfig.workspaceDir).resolve(
              encodeURIComponent(documentModel.ref),
            ).codeUri,
          };
        },
      },
    );

    // 注销命令
    registry.unregisterCommand(QUICK_OPEN_COMMANDS.OPEN.id);
    registry.registerCommand(QUICK_OPEN_COMMANDS.OPEN);
  }

  /**
   * 只 contribute code editor，diff editor 暂不需要
   */
  private contributeEditor(editor: IEditor) {
    // scrollbar 不支持偏好设置
    editor.monacoEditor.updateOptions({
      scrollbar: {
        alwaysConsumeMouseWheel: false,
        ...this.propsService.props.editorConfig?.scrollbar,
      },
    });

    const disposer = new Disposable();
    let oldHoverDecorations: string[] = [];
    disposer.addDispose(
      editor.monacoEditor.onMouseMove(
        debounce((event) => {
          if (this.runtimeConfig.disableHighlightLine) {
            return;
          }
          const type = event?.target?.type;
          if (
            type === monacoBrowser.editor.MouseTargetType.GUTTER_LINE_NUMBERS
            || type === monacoBrowser.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
          ) {
            const lineNumber = event.target.position!.lineNumber;
            oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, [
              {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                  description: 'line-content-description',
                  className: styles['line-content'],
                  glyphMarginClassName: styles['line-glyph-margin'],
                },
              },
            ]);
          } else {
            oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, []);
          }
        }, 10),
      ),
    );
    let oldClickDecorations: string[] = [];
    const highlightLine = (lineNumber: number | [number, number] | Array<[number, number]>) => {
      if (this.runtimeConfig.disableHighlightLine) {
        return;
      }
      let centerLine: number;
      let newDecorations: monaco.editor.IModelDeltaDecoration[];
      if (Array.isArray(lineNumber) && Array.isArray(lineNumber[0])) {
        centerLine = lineNumber[0][0];
        newDecorations = lineNumber.map((line) => {
          return {
            range: new monaco.Range(line[0], 1, line[1], 1),
            options: {
              description: 'line-anchor-description',
              isWholeLine: true,
              linesDecorationsClassName: styles['line-anchor'],
              className: styles['line-content'],
            },
          };
        });
      } else {
        const startLineNumber = typeof lineNumber === 'number' ? lineNumber : (lineNumber[0] as number);
        const endLineNumber = typeof lineNumber === 'number' ? lineNumber : (lineNumber[1] as number);
        centerLine = startLineNumber;
        newDecorations = [
          {
            range: new monaco.Range(startLineNumber, 1, endLineNumber, 1),
            options: {
              // @ts-ignore
              description: 'line-anchor-description',
              isWholeLine: true,
              linesDecorationsClassName: styles['line-anchor'],
              className: styles['line-content'],
            },
          },
        ];
      }
      // 延迟高亮，否则不居中
      oldClickDecorations = editor.monacoEditor.deltaDecorations(
        oldClickDecorations,
        newDecorations,
      );
      setTimeout(() => {
        if (this.propsService.props.editorConfig?.stretchHeight) {
          const firstLine = document.querySelector(`.${styles['line-anchor']}`) as HTMLElement;
          if (firstLine) {
            firstLine.scrollIntoView({ block: 'center' });
          }
        } else {
          editor.monacoEditor.revealLineInCenterIfOutsideViewport(centerLine);
        }
      }, 0);
    };

    disposer.addDispose(
      editor.monacoEditor.onMouseDown((event) => {
        const type = event?.target?.type;

        if (
          type === monacoBrowser.editor.MouseTargetType.GUTTER_LINE_NUMBERS
          || type === monacoBrowser.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
        ) {
          const lineNumber = event.target.position!.lineNumber;
          const lastLineNumber = this.propsService.props.documentModel.lineNumber;
          let nextLineNumber: number | [number, number] = lineNumber;
          if (event?.event?.shiftKey && lastLineNumber) {
            let startLineNumber = Array.isArray(lastLineNumber)
              ? Array.isArray(lastLineNumber[0])
                ? lastLineNumber[0][0]
                : lastLineNumber[0]
              : lastLineNumber;
            if (startLineNumber > nextLineNumber) {
              nextLineNumber = [nextLineNumber, startLineNumber];
            } else if (startLineNumber < nextLineNumber) {
              nextLineNumber = [startLineNumber, nextLineNumber];
            }
          }
          // 非受控
          if (!('lineNumber' in this.propsService.props.documentModel)) {
            highlightLine(nextLineNumber);
          }
          this.propsService.props.documentModel.onLineNumberChange?.(nextLineNumber);
        }
      }),
    );

    disposer.addDispose(
      editor.monacoEditor.onDidChangeModel(() => {
        const initialLineNumber = this.propsService.props.documentModel.lineNumber;
        if (initialLineNumber) {
          highlightLine(initialLineNumber);
        }
      }),
    );

    disposer.addDispose(
      this.propsService.onPropsChange((e) => {
        if (e.affect('documentModel', 'lineNumber')) {
          const newLineNumber = e.props.documentModel.lineNumber;
          if (newLineNumber) {
            highlightLine(newLineNumber);
          }
        }
      }),
    );

    if (this.propsService.props.editorConfig?.stretchHeight) {
      const { monacoEditor } = editor;

      const updateRootHeight = () => {
        const contentHeight = monacoEditor.getContentHeight() + 1;
        const tabHeight = this.runtimeConfig.hideEditorTab
          ? 0
          : this.layoutViewSize.editorTabsHeight;
        const root = document.querySelector('.alex-root') as HTMLElement;
        root.style.height = `${contentHeight + tabHeight}px`;
        monacoEditor.layout();
      };

      disposer.addDispose(monacoEditor.onDidContentSizeChange(updateRootHeight));
      updateRootHeight();
    }

    this.adjustFindWidgetPosition(editor, disposer);

    return disposer;
  }

  private adjustFindWidgetPosition(editor: IEditor, disposer: Disposable) {
    const adjustFindWidgetTop = this.propsService.props.editorConfig?.adjustFindWidgetTop;
    if (typeof adjustFindWidgetTop === 'undefined') {
      return;
    }
    const findController: FindController = editor.monacoEditor.getContribution(FindController.ID)!;
    const findState = findController.getState();

    let styleDisposer: IDisposable | null = null;
    disposer.addDispose(
      findState.onFindReplaceStateChange((e) => {
        if (!e.isRevealed) return;
        try {
          if (findState.isRevealed) {
            const widget: FindWidget = (findController as any)._widget;
            const dom = widget.getDomNode();
            const { top } = dom.parentElement!.getBoundingClientRect();
            const offsetTop = typeof adjustFindWidgetTop === 'number' ? top - adjustFindWidgetTop : top;
            const className = `find-widget-top-${uuid()}`;
            dom.classList.add(className);
            if (offsetTop < 0) {
              styleDisposer = this.cssStyleService.addClass(className, {
                top: `${-offsetTop}px !important;`,
              });
            }
          } else {
            styleDisposer?.dispose();
          }
        } catch (err) {
          console.error(err);
        }
      }),
    );
  }

  registerKeybindings(keybindings: KeybindingRegistry) {
    // editor 下默认注销的快捷键
    const keybindingList = [
      'ctrlcmd+,',
      'ctrlcmd+shift+p',
      'ctrlcmd+p',
      'F1',
      'alt+n',
      'alt+shift+t',
      'alt+shift+w',
      'ctrlcmd+\\',
    ];
    for (let i = 1; i < 10; i++) {
      keybindingList.push(`ctrlcmd+${i}`);
    }
    // 搜索快捷键
    if (this.propsService.props.editorConfig?.disableEditorSearch) {
      keybindingList.push('ctrlcmd+f');
    }
    // 自定义注销的快捷键
    if (this.runtimeConfig.unregisterKeybindings) {
      keybindingList.push(...this.runtimeConfig.unregisterKeybindings);
    }

    keybindingList.forEach((binding) => {
      keybindings.unregisterKeybinding(binding);
    });

    // 通过设置 when 为 false 来禁用快捷键
    if (this.propsService.props.editorConfig?.disableEditorSearch) {
      const findCommand = monacoKeybindings.KeybindingsRegistry.getDefaultKeybindings().find(
        (item) => item.command === 'actions.find',
      );
      if (findCommand) {
        findCommand.when = ContextKeyDefinedExpr.create('alex.context.false');
      }
    } else {
      // 设置为 passthrough，则忽略快捷键的处理，从而使事件冒泡，触发浏览器默认行为
      this.addDispose(
        keybindings.registerKeybinding({
          command: KeybindingRegistryImpl.PASSTHROUGH_PSEUDO_COMMAND,
          keybinding: 'ctrlcmd+f',
          when: '!editorFocus',
        }),
      );
    }
  }

  onMonacoLoaded(monacoService: MonacoService) {
    const codeEditorService = monacoService.getOverride(ServiceNames.CODE_EDITOR_SERVICE);
    const _openCodeEditor = codeEditorService.openCodeEditor;
    codeEditorService.openCodeEditor = (
      input: any,
      source?: monaco.editor.ICodeEditor,
      sideBySide?: boolean,
    ) => {
      return this.openCodeEditor(
        () => _openCodeEditor.call(codeEditorService, input, source, sideBySide),
        input,
        source,
        sideBySide,
      );
    };
  }

  /**
   * 获取内部跳转的时机
   */
  async openCodeEditor(
    raw: Function,
    input: any,
    source?: monaco.editor.ICodeEditor,
    sideBySide?: boolean,
  ) {
    // 非 file 协议路径设置为空，以触发 props 变化
    const documentModel = this.propsService.props.documentModel;
    if (input.resource.scheme !== 'file') {
      documentModel.onFilepathChange?.('');
      return raw();
    }
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
    AlexCommandContribution,
  ];
}
