import { fsExtra, isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { InlineChatHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat.handler';
import { AppConfig, ClientAppContribution, EDITOR_COMMANDS, IClientApp } from '@opensumi/ide-core-browser';
import {
  Disposable,
  DisposableStore,
  Domain,
  Emitter,
  Event,
  IChatProgress,
  ILogger,
  isArray,
  MaybePromise,
  Sequencer,
  URI,
} from '@opensumi/ide-core-common';
import { IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { Selection, SelectionDirection } from '@opensumi/ide-monaco';

import { Autowired } from '@opensumi/di';
import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';
import { LiveInlineDiffPreviewer } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff-previewer';
import { InlineDiffHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.handler';
import { InlineStreamDiffHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/inline-stream-diff.handler';
import { EResultKind } from '@opensumi/ide-ai-native/lib/common';
import { IMenuRegistry, MenuContribution, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { IEditor, IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser';
import { listenReadable, SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import path from 'path';
import { IDiffViewerProps, IDiffViewerTab, IExtendPartialEditEvent, ITabChangedEvent } from '../common';
import { removeStart } from '../utils';

@Domain(ClientAppContribution, MenuContribution)
export class DiffViewerContribution implements ClientAppContribution, MenuContribution {
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
  private readonly editorDocumentModelService: IEditorDocumentModelService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  @Autowired(ILogger)
  protected logger: ILogger;

  private readonly _onPartialEditEvent = this._disposables.add(new Emitter<IExtendPartialEditEvent>());
  public readonly onPartialEditEvent: Event<IExtendPartialEditEvent> = this._onPartialEditEvent.event;

  private readonly _onDidTabChange = this._disposables.add(new Emitter<ITabChangedEvent>());
  public readonly onDidTabChange: Event<ITabChangedEvent> = this._onDidTabChange.event;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  getFullPathUri(filePath: string) {
    return URI.file(this.getFullPath(filePath));
  }

  stripDirectory(filePath: string) {
    const result = removeStart(filePath, this.appConfig.workspaceDir);
    if (result.startsWith('/')) {
      return result.slice(1);
    }
    return result;
  }

  openFileInTab = async (filePath: string, content: string, options?: IResourceOpenOptions) => {
    const fullPath = this.getFullPath(filePath);
    if (!fsExtra.pathExistsSync(fullPath)) {
      fsExtra.ensureFileSync(fullPath);
      fsExtra.writeFileSync(fullPath, content);
    }

    const uri = URI.file(fullPath);
    return {
      uri,
      result: await this.workbenchEditorService.open(uri, options),
    };
  };

  private _openDiffInTab = async (
    filePath: string,
    oldContent: string,
    newContent: string,
    options?: IResourceOpenOptions,
  ) => {
    const { uri, result: openResourceResult } = await this.openFileInTab(filePath, oldContent, {
      ...options,
      preview: false,
    });

    if (!openResourceResult) {
      throw new Error('Failed to open file in tab: ' + filePath);
    }

    const editor = openResourceResult.group.codeEditor;

    if (oldContent === newContent) {
      this.inlineDiffHandler.destroyPreviewer();
      return;
    }

    const model = this.editorDocumentModelService.getModelReference(uri);
    if (!model || !model.instance) {
      throw new Error('Failed to get model reference: ' + filePath);
    }

    const monacoModel = model.instance.getMonacoModel();

    monacoModel.setValue(oldContent);
    const fullRange = monacoModel.getFullModelRange();

    const previewer = this.inlineDiffHandler.createDiffPreviewer(
      editor.monacoEditor,
      Selection.fromRange(fullRange, SelectionDirection.LTR),
      {
        disposeWhenEditorClosed: false,
      },
    ) as LiveInlineDiffPreviewer;
    const whenReady = Event.toPromise(previewer.getNode()!.onDidEditChange);

    previewer.setValue(newContent);

    await whenReady;
    previewer.layout();
    previewer.revealFirstDiff();
  };

  private sequencer = new Sequencer();
  openDiffInTab = async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
    await this.sequencer.queue(() => this._openDiffInTab(filePath, oldContent, newContent, options));
  };

  openDiffInTabByStream = async (
    filePath: string,
    oldContent: string,
    stream: SumiReadableStream<string>,
    options?: IResourceOpenOptions,
  ) => {
    const { uri, result: openResourceResult } = await this.openFileInTab(filePath, oldContent, {
      ...options,
      preview: false,
    });

    if (!openResourceResult) {
      throw new Error('Failed to open file in tab: ' + filePath);
    }

    const editor = openResourceResult.group.codeEditor;

    const model = this.editorDocumentModelService.getModelReference(uri);
    if (!model || !model.instance) {
      throw new Error('Failed to get model reference: ' + filePath);
    }

    const monacoModel = model.instance.getMonacoModel();

    monacoModel.setValue(oldContent);
    const fullRange = monacoModel.getFullModelRange();

    const controller = new InlineChatController();
    const newStream = new SumiReadableStream<IChatProgress>();
    controller.mountReadable(newStream);
    listenReadable<string>(stream, {
      onData(data) {
        newStream.emitData({
          kind: 'content',
          content: data,
        });
      },
      onEnd() {
        newStream.end();
      },
      onError(error) {
        newStream.emitError(error);
      },
    });

    this.inlineDiffHandler.showPreviewerByStream(
      editor.monacoEditor,
      {
        crossSelection: Selection.fromRange(fullRange, SelectionDirection.LTR),
        chatResponse: controller,
        previewerOptions: {
          disposeWhenEditorClosed: false,
        },
      },
    ) as LiveInlineDiffPreviewer;
  };

  getFilePathForEditor = (editor: IEditor) => {
    return this.stripDirectory(editor.currentUri!.codeUri.fsPath);
  };

  getAllTabs = (): IDiffViewerTab[] => {
    const editorGroup = this.workbenchEditorService.editorGroups[0];
    const resources = editorGroup.resources;

    return resources.map((editor, idx) => ({
      index: idx,
      filePath: this.stripDirectory(editor.uri.codeUri.fsPath),
    }));
  };

  getFileIndex = (filePath: string) => {
    const aPath = this.stripDirectory(filePath);
    return this.getAllTabs().findIndex((tab) => tab.filePath === aPath);
  };

  getDiffInfoForUri = (uri: URI) => {
    const result = {
      unresolved: 0,
      total: 0,
      toAddedLines: 0,
    };
    const resourceDiff = (this.inlineDiffHandler as any)._previewerNodeStore.get(uri.toString()) as
      | InlineStreamDiffHandler
      | null;

    if (resourceDiff) {
      const snapshot = resourceDiff.createSnapshot();
      const list = snapshot.decorationSnapshotData.partialEditWidgetList;
      const unresolved = list.filter(v => v.status === 'pending');
      result.total = list.length;
      result.unresolved = unresolved.length;
      result.toAddedLines = snapshot.decorationSnapshotData.addedDecList.filter(v => !v.isHidden).reduce(
        (acc, item) => {
          return acc + item.length;
        },
        0,
      );
    }
    return result;
  };

  async initialize(): Promise<void> {
    await isFilesystemReady();

    const disposable = new Disposable();
    this._disposables.add(disposable);

    disposable.addDispose(this.inlineDiffHandler.onPartialEditEvent((e) => {
      const fsPath = e.uri.fsPath;

      this._onPartialEditEvent.fire({
        filePath: this.stripDirectory(fsPath),
        ...e,
      });
    }));

    disposable.addDispose(this.workbenchEditorService.onActiveResourceChange((e) => {
      const _newPath = e?.uri.codeUri.fsPath;
      let newPath = _newPath;
      let currentIndex = -1;
      if (newPath) {
        currentIndex = this.getFileIndex(newPath);
        newPath = this.stripDirectory(newPath);
      }

      const event = {
        newPath,
        currentIndex,
        diffNum: 0,
      };

      if (e?.uri) {
        const diffInfo = this.getDiffInfoForUri(e.uri);
        event.diffNum = diffInfo.unresolved;
      }

      this._onDidTabChange.fire(event);
    }));

    this.diffViewerProps.onRef({
      openDiffInTab: async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
        return this.openDiffInTab(filePath, oldContent, newContent, options);
      },
      openDiffInTabByStream: this.openDiffInTabByStream,
      openFileInTab: async (filePath: string, content: string, options?: IResourceOpenOptions) => {
        const { uri } = await this.openFileInTab(filePath, content, options);
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
        return await fsExtra.readFile(fullPath, 'utf-8');
      },
      acceptAllPartialEdit: async () => {
        if (this.inlineDiffHandler) {
          this.inlineDiffHandler.handleAction(
            EResultKind.ACCEPT,
          );
        }
      },
      rejectAllPartialEdit: async () => {
        if (this.inlineDiffHandler) {
          this.inlineDiffHandler.handleAction(
            EResultKind.DISCARD,
          );
        }
      },
      dispose: () => {
        disposable.dispose();
      },
      getCurrentTab: () => {
        const allTabs = this.getAllTabs();
        const currentEditorFilePath = this.getFilePathForEditor(this.workbenchEditorService.currentEditor!);
        const currentTabIdx = allTabs.findIndex((tab) => {
          return tab.filePath === currentEditorFilePath;
        });
        if (currentTabIdx === -1) {
          return;
        }
        const uri = this.getFullPathUri(currentEditorFilePath);
        const diffInfo = this.getDiffInfoForUri(uri);

        const fileName = path.basename(currentEditorFilePath);
        return {
          index: currentTabIdx,
          filePath: currentEditorFilePath,
          fileName,
          ...diffInfo,
        };
      },
      getTabAtIndex: (index) => {
        const allTabs = this.getAllTabs();
        return allTabs[index];
      },
      getAllTabs: () => {
        return this.getAllTabs();
      },
      closeAllTab: async () => {
        return this.workbenchEditorService.closeAll();
      },
      onDidTabChange: (cb) => {
        return this.onDidTabChange(cb);
      },
    });
  }

  onDidStart(): MaybePromise<void> {
    if (this.diffViewerProps.data && isArray(this.diffViewerProps.data)) {
      this.diffViewerProps.data.forEach((item) => {
        this.openDiffInTab(item.path, item.oldCode, item.newCode);
      });
    }
  }

  registerMenus(registry: IMenuRegistry) {
    registry.unregisterMenuItem(MenuId.EditorTitle, EDITOR_COMMANDS.SPLIT_TO_RIGHT.id);
    registry.unregisterMenuItem(MenuId.EditorTitle, EDITOR_COMMANDS.CLOSE_ALL_IN_GROUP.id);
    registry.unregisterMenuId(MenuId.EditorTitle);
    registry.unregisterMenuId(MenuId.EditorTitleRun);
  }
  dispose() {
    this._disposables.dispose();
  }
}
