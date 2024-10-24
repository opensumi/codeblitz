import { fsExtra, isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { AppConfig, ClientAppContribution, EDITOR_COMMANDS } from '@opensumi/ide-core-browser';
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
import { ICodeEditor, Selection, SelectionDirection } from '@opensumi/ide-monaco';

import { Autowired } from '@opensumi/di';
import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';
import { LiveInlineDiffPreviewer } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff-previewer';
import { InlineDiffController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.controller';
import { InlineDiffService } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.service';
import {
  IInlineStreamDiffSnapshotData,
  InlineStreamDiffHandler,
} from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/inline-stream-diff.handler';
import { AcceptPartialEditWidget } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.component';
import { EResultKind } from '@opensumi/ide-ai-native/lib/common';
import { IMenuRegistry, MenuContribution, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { IEditor, IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser';
import { listenReadable, SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import path from 'path';
import { IDiffViewerProps, IDiffViewerTab, IExtendPartialEditEvent, ITabChangedEvent } from '../common';
import { removeStart } from '../utils';

export interface ITotalCodeInfo {
  totalAddedLinesCount: number;
  totalDeletedLinesCount: number;
  totalChangedLinesCount: number;
  unresolvedAddedLinesCount: number;
  unresolvedDeletedLinesCount: number;
  unresolvedChangedLinesCount: number;
}

@Domain(ClientAppContribution, MenuContribution)
export class DiffViewerContribution implements ClientAppContribution, MenuContribution {
  private _disposables = new DisposableStore();

  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(IEditorDocumentModelService)
  private readonly editorDocumentModelService: IEditorDocumentModelService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  @Autowired(ILogger)
  protected logger: ILogger;

  @Autowired(InlineDiffService)
  protected inlineDiffService: InlineDiffService;

  private readonly _onPartialEditEvent = this._disposables.add(new Emitter<IExtendPartialEditEvent>());
  public readonly onPartialEditEvent: Event<IExtendPartialEditEvent> = this._onPartialEditEvent.event;

  private readonly _onDidTabChange = this._disposables.add(new Emitter<ITabChangedEvent>());
  public readonly onDidTabChange: Event<ITabChangedEvent> = this._onDidTabChange.event;

  private sequencer = new Sequencer();
  private fileSequencer = new Sequencer();

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  getFullPathUri(filePath: string) {
    return URI.file(this.getFullPath(filePath));
  }

  normalizePath(path: string) {
    let result = removeStart(path, this.appConfig.workspaceDir);
    if (result.startsWith('/')) {
      return result.slice(1);
    }
    return result;
  }

  private async _openFileInTab(filePath: string, content: string, options?: IResourceOpenOptions) {
    const fullPath = this.getFullPath(filePath);
    if (!await fsExtra.pathExists(fullPath)) {
      await fsExtra.ensureFile(fullPath);
      await fsExtra.writeFile(fullPath, content);
    }

    const uri = URI.file(fullPath);
    return {
      uri,
      result: await this.workbenchEditorService.open(uri, options),
    };
  }

  openFileInTab = async (filePath: string, content: string, options?: IResourceOpenOptions) => {
    return this.fileSequencer.queue(() => this._openFileInTab(filePath, content, options));
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
    const index = openResourceResult.group.resources.indexOf(openResourceResult.resource);
    const inlineDiffHandler = InlineDiffController.get(editor.monacoEditor)!;
    if (oldContent === newContent) {
      inlineDiffHandler.destroyPreviewer();
      return;
    }

    const model = this.editorDocumentModelService.getModelReference(uri);
    if (!model || !model.instance) {
      throw new Error('Failed to get model reference: ' + filePath);
    }

    const monacoModel = model.instance.getMonacoModel();

    monacoModel.setValue(oldContent);
    const fullRange = monacoModel.getFullModelRange();

    const previewer = inlineDiffHandler.createDiffPreviewer(
      editor.monacoEditor,
      Selection.fromRange(fullRange, SelectionDirection.LTR),
      {
        disposeWhenEditorClosed: false,
        renderRemovedWidgetImmediately: true,
      },
    ) as LiveInlineDiffPreviewer;
    const whenReady = Event.toPromise(previewer.getNode()!.onDidEditChange);

    previewer.setValue(newContent);

    await whenReady;
    if (previewer && previewer.isModel(uri.toString())) {
      const diffInfo = this.computeDiffInfo(previewer.getNode());
      if (diffInfo) {
        // 因为 onTabChange 时机早于应用上 diff 的时机，这里补发一个 onDidTabChange 事件
        this._onDidTabChange.fire({
          currentIndex: index,
          diffNum: diffInfo.unresolved,
          newPath: filePath,
        });
      }
    }

    previewer.layout();
    previewer.revealFirstDiff();
  };

  openDiffInTab = async (
    filePath: string,
    oldContent: string,
    newContent: string,
    options?: IResourceOpenOptions,
  ) => {
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

    const inlineDiffHandler = InlineDiffController.get(editor.monacoEditor)!;
    inlineDiffHandler.showPreviewerByStream(
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
    return this.normalizePath(editor.currentUri!.codeUri.path);
  };

  getAllTabs = (): IDiffViewerTab[] => {
    const editorGroup = this.workbenchEditorService.editorGroups[0];
    const resources = editorGroup.resources;

    return resources.map((editor, idx) => ({
      index: idx,
      filePath: this.normalizePath(editor.uri.codeUri.path),
    }));
  };

  getFileIndex = (filePath: string) => {
    const aPath = this.normalizePath(filePath);
    return this.getAllTabs().findIndex((tab) => tab.filePath === aPath);
  };

  /**
   * 获取当前编辑器的代码采纳状态
   * 1. 已经采纳的代码信息
   * 2. 还未处理的代码信息
   */
  getTotalCodeInfo(snapshot: IInlineStreamDiffSnapshotData): ITotalCodeInfo {
    const partialEditWidgetList = snapshot.decorationSnapshotData.partialEditWidgetList;

    // 代码除了新增和删除行，还需要统计变更行
    // 1. 新增 N 行 => N
    // 2. 删除 N 行 => N
    // 3. 新增 M 行，删除 N 行 => max(M, N)
    // 综上所述，变更行数 = sum(list.map(item => max(新增行数, 删除行数)))
    const resolvedStatus = caculate(partialEditWidgetList);
    const unresolvedStatus = { added: 0, deleted: 0, changed: 0 };

    partialEditWidgetList.forEach((v, idx) => {
      if (v.status === 'pending') {
        const addedDec = snapshot.decorationSnapshotData.addedDecList[idx];
        const removedWidget = snapshot.decorationSnapshotData.removedWidgetList[idx];
        const addedLinesCount = addedDec?.length || 0;
        const deletedLinesCount = removedWidget?.height || 0;
        unresolvedStatus.added += addedLinesCount;
        unresolvedStatus.deleted += deletedLinesCount;
        unresolvedStatus.changed += Math.max(addedLinesCount, deletedLinesCount);
      }
    });

    return {
      totalAddedLinesCount: resolvedStatus.added,
      totalDeletedLinesCount: resolvedStatus.deleted,
      totalChangedLinesCount: resolvedStatus.changed,
      unresolvedAddedLinesCount: unresolvedStatus.added,
      unresolvedDeletedLinesCount: unresolvedStatus.deleted,
      unresolvedChangedLinesCount: unresolvedStatus.changed,
    };
    function caculate(list: AcceptPartialEditWidget[]) {
      const result = { added: 0, deleted: 0, changed: 0 };
      list.forEach((widget) => {
        const addedLinesCount = widget.addedLinesCount;
        const deletedLinesCount = widget.deletedLinesCount;
        result.added += addedLinesCount;
        result.deleted += deletedLinesCount;
        result.changed += Math.max(addedLinesCount, deletedLinesCount);
      });
      return result;
    }
  }

  computeDiffInfo(resourceDiff: InlineStreamDiffHandler | undefined) {
    if (resourceDiff) {
      const result = {
        unresolved: 0,
        total: 0,
        toAddedLines: 0,
        toChangedLines: 0,
      };

      const snapshot = resourceDiff.currentSnapshotStore || resourceDiff.createSnapshot();
      const list = snapshot.decorationSnapshotData.partialEditWidgetList;
      const unresolved = list.filter(v => v.status === 'pending');
      result.total = list.length;
      result.unresolved = unresolved.length;
      const codeInfo = this.getTotalCodeInfo(snapshot);
      result.toAddedLines = codeInfo.unresolvedAddedLinesCount;
      result.toChangedLines = codeInfo.unresolvedChangedLinesCount;
      return result;
    }
  }

  getDiffInfoForUri = (uri: URI, editor: ICodeEditor) => {
    let resourceDiff: InlineStreamDiffHandler | undefined;
    const controller = InlineDiffController.get(editor)!;

    const previewer = controller.getPreviewer() as LiveInlineDiffPreviewer;
    if (previewer && previewer.isModel(uri.toString())) {
      resourceDiff = previewer.getNode();
    }

    if (!resourceDiff) {
      resourceDiff = controller.getStoredState(uri.toString()) as
        | InlineStreamDiffHandler
        | undefined;
    }

    return this.computeDiffInfo(resourceDiff) || {
      unresolved: 0,
      total: 0,
      toAddedLines: 0,
      toChangedLines: 0,
    };
  };

  getCurrentInlineDiffHandler() {
    const editor = this.workbenchEditorService.currentEditor;
    if (!editor) {
      throw new Error('No active editor');
    }

    return InlineDiffController.get(editor.monacoEditor)!;
  }

  async initialize(): Promise<void> {
    await isFilesystemReady();

    const disposable = new Disposable();
    this._disposables.add(disposable);

    disposable.addDispose(this.inlineDiffService.onPartialEdit((e) => {
      const path = e.uri.path;

      this._onPartialEditEvent.fire({
        filePath: this.normalizePath(path),
        ...e,
      });
    }));

    disposable.addDispose(this.workbenchEditorService.onActiveResourceChange((e) => {
      let newPath = e?.uri.codeUri.path;
      let currentIndex = -1;
      if (newPath) {
        currentIndex = this.getFileIndex(newPath);
        newPath = this.normalizePath(newPath);
      }

      const event = {
        newPath,
        currentIndex,
        diffNum: 0,
      };

      if (e?.uri) {
        const editor = this.workbenchEditorService.currentEditor!;
        const diffInfo = this.getDiffInfoForUri(e.uri, editor.monacoEditor);
        event.diffNum = diffInfo.unresolved;
        Object.assign(event, diffInfo);
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
        const handler = this.getCurrentInlineDiffHandler();
        if (handler) {
          handler.handleAction(
            EResultKind.ACCEPT,
          );
        }
      },
      rejectAllPartialEdit: async () => {
        const handler = this.getCurrentInlineDiffHandler();
        if (handler) {
          handler.handleAction(
            EResultKind.DISCARD,
          );
        }
      },
      dispose: () => {
        disposable.dispose();
      },
      getCurrentTab: () => {
        const allTabs = this.getAllTabs();
        const editor = this.workbenchEditorService.currentEditor!;
        const currentEditorFilePath = this.getFilePathForEditor(editor);
        const currentTabIdx = allTabs.findIndex((tab) => {
          return tab.filePath === currentEditorFilePath;
        });
        if (currentTabIdx === -1) {
          return;
        }
        const uri = this.getFullPathUri(currentEditorFilePath);
        const diffInfo = this.getDiffInfoForUri(uri, editor.monacoEditor);

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
