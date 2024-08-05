import { isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { InlineChatHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat.handler';
import {
  AppConfig,
  BrowserModule,
  ClientAppContribution,
  EDITOR_COMMANDS,
  IClientApp,
} from '@opensumi/ide-core-browser';
import {
  CommandContribution,
  Disposable,
  DisposableStore,
  Domain,
  Emitter,
  Event,
  IChatProgress,
  ILogger,
  Sequencer,
  URI,
} from '@opensumi/ide-core-common';
import { IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { Selection, SelectionDirection } from '@opensumi/ide-monaco';

import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';
import { LiveInlineDiffPreviewer } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff-previewer';
import { InlineDiffHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.handler';
import { EResultKind } from '@opensumi/ide-ai-native/lib/common';
import { IEditor, IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser';
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import { requireModule } from '../../api/require';
import { Autowired, Injectable } from '../../modules/opensumi__common-di';
import { IMenuRegistry, MenuContribution } from '../../modules/opensumi__ide-core-browser';
import { ApplyDefaultThemeContribution } from '../theme';
import { IDiffViewerProps, IDiffViewerTab, IExtendPartialEditEvent } from './common';
import { removeStart } from './utils';

const fse = requireModule('fs-extra');
const path = requireModule('path');

@Domain(CommandContribution, ClientAppContribution, MenuContribution)
export class DiffViewerContribution implements CommandContribution, ClientAppContribution, MenuContribution {
  private _disposables = new DisposableStore();

  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(InlineChatHandler)
  protected inlineChatHandler: InlineChatHandler;

  @Autowired(InlineDiffHandler)
  protected inlineDiffHandler: InlineDiffHandler;

  @Autowired(IEditorDocumentModelService)
  private readonly editorCollectionService: IEditorDocumentModelService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  @Autowired(ILogger)
  protected logger: ILogger;

  private readonly _onPartialEditEvent = this._disposables.add(new Emitter<IExtendPartialEditEvent>());
  public readonly onPartialEditEvent: Event<IExtendPartialEditEvent> = this._onPartialEditEvent.event;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  stripDirectory(filePath: string) {
    const result = removeStart(filePath, this.appConfig.workspaceDir);
    if (result.startsWith('/')) {
      return result.slice(1);
    }
    return result;
  }

  async initialize(app: IClientApp): Promise<void> {
    await isFilesystemReady();

    const disposable = new Disposable();

    const openFileInTab = async (filePath: string, content: string, options?: IResourceOpenOptions) => {
      const fullPath = this.getFullPath(filePath);
      if (!fse.pathExistsSync(fullPath)) {
        fse.ensureFileSync(fullPath);
        fse.writeFileSync(fullPath, content);
      }

      const uri = URI.file(fullPath);
      return {
        uri,
        result: await this.workbenchEditorService.open(uri, options),
      };
    };

    const openDiffInTab = async (
      filePath: string,
      oldContent: string,
      newContent: string,
      options?: IResourceOpenOptions,
    ) => {
      const { uri, result: openResourceResult } = await openFileInTab(filePath, oldContent, {
        ...options,
        preview: false,
      });

      if (!openResourceResult) {
        throw new Error('Failed to open file in tab: ' + filePath);
      }

      const editor = openResourceResult.group.codeEditor;

      if (oldContent === newContent) {
        this.inlineDiffHandler.hidePreviewer(editor.monacoEditor);
        return;
      }

      const model = this.editorCollectionService.getModelReference(uri);
      if (!model || !model.instance) {
        throw new Error('Failed to get model reference: ' + filePath);
      }

      const monacoModel = model.instance.getMonacoModel();

      monacoModel.setValue(oldContent);
      const fullRange = monacoModel.getFullModelRange();

      const previewer = this.inlineDiffHandler.createDiffPreviewer(editor.monacoEditor, Selection.fromRange(fullRange, SelectionDirection.LTR), {
        disposeWhenEditorClosed: false,
      }) as LiveInlineDiffPreviewer;
      const whenReady = Event.toPromise(previewer.getNode().onDidEditChange);

      previewer.setValue(newContent);

      await whenReady;
      previewer.layout();
      previewer.revealFirstDiff();
    };

    const getFilePathForEditor = (editor: IEditor) => {
      return this.stripDirectory(editor.currentUri!.codeUri.fsPath);
    };

    const getAllTabs = (): IDiffViewerTab[] => {
      const editorGroup = this.workbenchEditorService.editorGroups[0];
      const resources = editorGroup.resources;

      return resources.map((editor, idx) => ({
        index: idx,
        filePath: this.stripDirectory(editor.uri.codeUri.fsPath),
      }));
    };

    this.inlineDiffHandler.onPartialEditEvent((e) => {
      const fsPath = e.uri.fsPath;

      this._onPartialEditEvent.fire({
        filePath: this.stripDirectory(fsPath),
        ...e,
      });
    });

    const sequencer = new Sequencer();

    this.diffViewerProps.onRef({
      openDiffInTab: async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
        await sequencer.queue(() => openDiffInTab(filePath, oldContent, newContent, options));
      },
      openFileInTab: async (filePath: string, content: string, options?: IResourceOpenOptions) => {
        const { uri } = await openFileInTab(filePath, content, options);
        return uri;
      },
      openTab: async (filePath: string, options?: IResourceOpenOptions) => {
        const fullPath = this.getFullPath(filePath);
        const uri = URI.file(fullPath);
        await this.workbenchEditorService.open(uri, {
          ...options,
        });
      },
      closeTab: async (filePath) => {
        await this.workbenchEditorService.close(URI.file(this.getFullPath(filePath)), false);
      },
      onPartialEditEvent: (cb) => {
        return this.onPartialEditEvent(cb);
      },
      getFileContent: async (filePath: string) => {
        const fullPath = this.getFullPath(filePath);
        return await fse.readFile(fullPath, 'utf-8');
      },
      acceptAllPartialEdit: async () => {
        if (this.inlineDiffHandler) {
          this.inlineDiffHandler.handleAction(
            this.workbenchEditorService.currentEditor!.monacoEditor,
            EResultKind.ACCEPT,
          );
        }
      },
      rejectAllPartialEdit: async () => {
        if (this.inlineDiffHandler) {
          this.inlineDiffHandler.handleAction(
            this.workbenchEditorService.currentEditor!.monacoEditor,
            EResultKind.DISCARD,
          );
        }
      },
      dispose: () => {
        disposable.dispose();
      },
      getCurrentTab: () => {
        const allTabs = getAllTabs();
        const currentEditorFilePath = getFilePathForEditor(this.workbenchEditorService.currentEditor!);
        const currentTabIdx = allTabs.findIndex((tab) => {
          return tab.filePath === currentEditorFilePath;
        });
        if (!currentTabIdx) {
          return;
        }
        return {
          index: currentTabIdx,
          filePath: currentEditorFilePath,
        };
      },
      getTabAtIndex: (index) => {
        const allTabs = getAllTabs();
        return allTabs[index];
      },
      getAllTabs: () => {
        return getAllTabs();
      },
      closeAllTab: async () => {
        return this.workbenchEditorService.closeAll();
      }
    });
  }
  registerCommands() {
  }
  registerMenus(registry: IMenuRegistry) {
    registry.unregisterMenuItem('editor/title', EDITOR_COMMANDS.SPLIT_TO_RIGHT.id);
    registry.unregisterMenuItem('editor/title', EDITOR_COMMANDS.CLOSE_ALL_IN_GROUP.id);
  }
  dispose() {
    this._disposables.dispose();
  }
}

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
    ApplyDefaultThemeContribution,
  ];
}
