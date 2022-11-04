import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { Disposable, Emitter, Event, IRange, positionToRange } from '@opensumi/ide-core-common';
import { Injectable, Autowired } from '@opensumi/di';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { DiffFoldingZoneWidget } from '.';
import { CUSTOM_FOLDING_LINE_NUMBER, DiffFoldingChangeData, TEditorType, TFoldingType } from '..';
import { getMaxLineCount, isVisibilityRangeByUpOrDownWidget } from '../utils';

@Injectable()
export class DiffFoldingWidgetService extends Disposable {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  protected originalWidgetMap: Map<monaco.Position, DiffFoldingZoneWidget> = new Map();
  protected modifiedWidgetMap: Map<monaco.Position, DiffFoldingZoneWidget> = new Map();

  protected readonly _onUnFoldChange = new Emitter<{
    data: DiffFoldingChangeData;
    type: TEditorType;
  }>();
  public readonly onUnFoldChanged: Event<{
    data: DiffFoldingChangeData;
    type: TEditorType;
  }> = this._onUnFoldChange.event;

  constructor() {
    super();
  }

  private collectDisposable(widget: DiffFoldingZoneWidget, type: TEditorType): void {
    this.addDispose(widget);
    this.addDispose(
      widget.onDidChangeFoldData((data: DiffFoldingChangeData) => {
        this._onUnFoldChange.fire({
          data,
          type,
        });
      })
    );
  }

  public clear() {
    this.dispose();
    this.originalWidgetMap.clear();
    this.modifiedWidgetMap.clear();
  }

  /**
   * 控制第一行代码内容的显示与隐藏
   * ps: startLineNumber 为 1 的 zonewidget 需要隐藏第一行代码内容
   */
  private handleFirstLineHide(isVisibility: boolean) {
    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;
    const dom = (diffEditor as any).monacoDiffEditor._domElement;
    const key = 'margin-top';
    // 目的是通过 margin-top 属性控制当前 monaco diff editor 的 dom 节点向上位移，隐藏第一行代码的内容，使得 zone widget 从视觉上是位于第一行位置的
    const value = '-20px';

    if (isVisibility) {
      dom.style.setProperty(key, value);
    } else {
      dom.style.removeProperty(key);
    }
  }

  public launchFirstLineHideHandle() {
    this.handleFirstLineHide(
      !!this.findWidgetByKey(1, 'original') && !!this.findWidgetByKey(1, 'modified')
    );
  }

  /**
   * 由传递进来的 range 区间计算每一个 zoneWidget 要显示的功能点（向上、向下、全部）
   * @abstract
   * 在头部的 range 区间只有向上或全部
   * 在尾部的 range 区间只有向下或全部
   * 在中间的 range 区间三者都有可能
   */
  public calcZonwWidgetPoint(
    startLineNumber: number,
    endLineNumber: number,
    type: TEditorType
  ): DiffFoldingChangeData[] {
    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;
    const { originalEditor, modifiedEditor } = diffEditor;
    let result: DiffFoldingChangeData[] = [];

    const unFoldNumber = endLineNumber - startLineNumber;

    const perData = (fType: TFoldingType) => {
      return {
        type: fType,
        lineNumber: startLineNumber,
        unFoldNumber:
          fType !== 'all' ? Math.min(CUSTOM_FOLDING_LINE_NUMBER, unFoldNumber) : unFoldNumber,
      };
    };

    if (isVisibilityRangeByUpOrDownWidget(unFoldNumber)) {
      result.push(perData('up'), perData('down'));

      if (startLineNumber == 1) {
        result = result.filter((e) => e.type !== 'down');
      }

      if (getMaxLineCount(type == 'original' ? originalEditor : modifiedEditor) === endLineNumber) {
        result = result.filter((e) => e.type !== 'up');
      }
    }

    result.push(perData('all'));

    return result;
  }

  public generateZoneWidget(originalRanges: IRange[], modifiedRanges: IRange[]): void {
    this.clear();

    originalRanges.forEach((e) => {
      this.addWidget(e.startLineNumber, 'original');
    });

    modifiedRanges.forEach((e) => {
      this.addWidget(e.startLineNumber, 'modified');
    });
  }

  public showAll(originalRanges: IRange[], modifiedRanges: IRange[]): void {
    this.originalWidgetMap.forEach((o, position) => {
      const range = originalRanges.find((r) => r.startLineNumber === position.lineNumber);
      // @ts-ignore
      this.showWidget(range.startLineNumber, range.endLineNumber, 'original');
    });
    this.modifiedWidgetMap.forEach((o, position) => {
      const range = modifiedRanges.find((r) => r.startLineNumber === position.lineNumber);
      // @ts-ignore
      this.showWidget(range.startLineNumber, range.endLineNumber, 'modified');
    });
  }

  public flushZonePosition(): void {
    this.originalWidgetMap.forEach((o) => {
      o.flushWhitespacesZones();
    });
    this.modifiedWidgetMap.forEach((e) => {
      e.flushWhitespacesZones();
    });
  }

  public toPosition(line: number): monaco.Position {
    return new monaco.Position(line, 1);
  }

  public findWidgetByKey(line: number, type: TEditorType): monaco.Position {
    const maps = type === 'original' ? this.originalWidgetMap : this.modifiedWidgetMap;
    for (const position of maps.keys()) {
      if (position.lineNumber === line) {
        return position;
      }
    }
    // @ts-ignore
    return;
  }

  public delWidget(line: number, type: TEditorType): void {
    const toMapKey = this.findWidgetByKey(line, type);
    const map = type === 'original' ? this.originalWidgetMap : this.modifiedWidgetMap;

    if (map.has(toMapKey)) {
      const widget = map.get(toMapKey);
      // @ts-ignore
      widget.hide();
      // @ts-ignore
      widget.dispose();
      map.delete(toMapKey);
    }
  }

  public addWidget(line: number, type: TEditorType): void {
    const positions = this.toPosition(line);

    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;
    const { originalEditor, modifiedEditor } = diffEditor;

    if (type === 'original') {
      this.originalWidgetMap.set(
        positions,
        new DiffFoldingZoneWidget(
          originalEditor.monacoEditor as unknown as monaco.editor.ICodeEditor
        )
      );
      this.collectDisposable(
        this.originalWidgetMap.get(positions) as DiffFoldingZoneWidget,
        'original'
      );
    } else if (type === 'modified') {
      this.modifiedWidgetMap.set(
        positions,
        new DiffFoldingZoneWidget(
          modifiedEditor.monacoEditor as unknown as monaco.editor.ICodeEditor
        )
      );
      this.collectDisposable(
        this.modifiedWidgetMap.get(positions) as DiffFoldingZoneWidget,
        'modified'
      );
    }
  }

  public showWidget(startLineNumber: number, endLineNumber: number, type: TEditorType): void {
    const toMapKey = this.findWidgetByKey(startLineNumber, type);
    const map = type === 'original' ? this.originalWidgetMap : this.modifiedWidgetMap;

    if (map.has(toMapKey)) {
      const widget = map.get(toMapKey);
      // @ts-ignore
      widget.show(positionToRange(toMapKey), 1);
      // @ts-ignore
      widget.renderColumnList(this.calcZonwWidgetPoint(startLineNumber, endLineNumber, type));
    }
  }
}
