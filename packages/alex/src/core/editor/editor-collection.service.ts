/**
 * kaitian 中关于滚动事件有 bug，先临时覆盖掉实现
 */

import { Autowired } from '@ali/common-di';
import { Emitter } from '@ali/ide-core-common';
import { PreferenceService, IRange } from '@ali/ide-core-browser';
import { IEditorFeatureRegistry } from '@ali/ide-editor/lib/browser';
import {
  BaseMonacoEditorWrapper,
  EditorCollectionServiceImpl,
} from '@ali/ide-editor/lib/browser/editor-collection.service';
import { IEditorDocumentModelRef } from '@ali/ide-editor/lib/browser/doc-model/types';
import {
  ICodeEditor,
  EditorCollectionService,
  CursorStatus,
  EditorType,
} from '@ali/ide-editor/lib/common/editor';
import { getConvertedMonacoOptions } from '@ali/ide-editor/lib/browser/preference/converter';

export class BrowserCodeEditor extends BaseMonacoEditorWrapper implements ICodeEditor {
  @Autowired(EditorCollectionService)
  private collectionService: EditorCollectionServiceImpl;

  @Autowired(IEditorFeatureRegistry)
  protected readonly editorFeatureRegistry: IEditorFeatureRegistry;

  private editorState: Map<string, monaco.editor.ICodeEditorViewState> = new Map();

  private readonly toDispose: monaco.IDisposable[] = [];

  protected _currentDocumentModelRef: IEditorDocumentModelRef;

  private _onCursorPositionChanged = new Emitter<CursorStatus>();
  public onCursorPositionChanged = this._onCursorPositionChanged.event;

  public _disposed: boolean = false;

  private _onRefOpen = new Emitter<IEditorDocumentModelRef>();

  public onRefOpen = this._onRefOpen.event;

  @Autowired(PreferenceService)
  preferenceService: PreferenceService;

  public get currentDocumentModel() {
    if (this._currentDocumentModelRef && !this._currentDocumentModelRef.disposed) {
      return this._currentDocumentModelRef.instance;
    } else {
      return null;
    }
  }

  getType() {
    return EditorType.CODE;
  }

  constructor(
    public readonly monacoEditor: monaco.editor.IStandaloneCodeEditor,
    options: any = {}
  ) {
    super(monacoEditor, EditorType.CODE);
    this._specialEditorOptions = options;
    this.collectionService.addEditors([this]);
    this.toDispose.push(
      monacoEditor.onDidChangeCursorPosition(() => {
        if (!this.currentDocumentModel) {
          return;
        }
        const selection = monacoEditor.getSelection();
        this._onCursorPositionChanged.fire({
          position: monacoEditor.getPosition(),
          selectionLength: selection
            ? this.currentDocumentModel.getMonacoModel().getValueInRange(selection).length
            : 0,
        });
      })
    );
    this.addDispose({
      dispose: () => {
        this.monacoEditor.dispose();
      },
    });
  }

  layout(): void {
    this.monacoEditor.layout();
  }

  focus(): void {
    this.monacoEditor.focus();
  }

  dispose() {
    super.dispose();
    this.saveCurrentState();
    this.collectionService.removeEditors([this]);
    this._disposed = true;
    this.toDispose.forEach((disposable) => disposable.dispose());
  }

  protected saveCurrentState() {
    if (this.currentUri) {
      const state = this.monacoEditor.saveViewState();
      if (state) {
        this.editorState.set(this.currentUri.toString(), state);
        // TODO store in storage
      }
    }
  }

  protected restoreState() {
    if (this.currentUri) {
      const state = this.editorState.get(this.currentUri.toString());
      if (state) {
        this.monacoEditor.restoreViewState(state);
      }
    }
  }

  async open(documentModelRef: IEditorDocumentModelRef, range?: IRange): Promise<void> {
    this.saveCurrentState();
    this._currentDocumentModelRef = documentModelRef;
    const model = this.currentDocumentModel!.getMonacoModel();
    this.monacoEditor.setModel(model);
    if (range) {
      // 对于第一次打开的文件，选区不能定位到屏幕中间，需要延迟一下等编辑器准备好后触发
      setTimeout(() => {
        this.monacoEditor.revealRangeInCenter(range);
        this.monacoEditor.setSelection(range);
      });
    } else {
      this.restoreState();
    }
    this._onRefOpen.fire(documentModelRef);
    // monaco 在文件首次打开时不会触发 cursorChange
    this._onCursorPositionChanged.fire({
      position: this.monacoEditor.getPosition(),
      selectionLength: 0,
    });
  }
}

export class EditorCollectionServiceImplOverride extends EditorCollectionServiceImpl {
  async createCodeEditor(dom: HTMLElement, options?: any, overrides?: { [key: string]: any }) {
    const mergedOptions = {
      ...getConvertedMonacoOptions(this.preferenceService).editorOptions,
      ...options,
    };
    // @ts-ignore
    const monacoCodeEditor = await this.monacoService.createCodeEditor(
      dom,
      mergedOptions,
      overrides
    );
    const editor = this.injector.get(BrowserCodeEditor, [monacoCodeEditor, options]);

    // @ts-ignore
    this._onCodeEditorCreate.fire(editor);
    return editor;
  }
}
