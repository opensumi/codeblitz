import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { Autowired, Injectable } from '@opensumi/di';
import { ICommentsService } from '@opensumi/ide-comments';
import { IRange, Position, PreferenceService, Uri, URI } from '@opensumi/ide-core-browser';
import { IDiffEditor, WorkbenchEditorService } from '@opensumi/ide-editor';
import { DiffFoldingChangeData, TEditorType } from '.';
import { generateRange, getMaxLineCount } from './utils';
import { RangeModel } from './rangeModel';

@Injectable()
export class AntcodeDiffFoldingService {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  public get diffEditor(): IDiffEditor {
    return this.workbenchEditorService.currentEditorGroup.diffEditor;
  }

  public currentRangeModel: RangeModel = new RangeModel();

  /**
   * To: https://github.com/microsoft/vscode/blob/1.37.1/src/vs/editor/common/services/editorWorkerServiceImpl.ts#L48
   */
  private get editorWorkerService(): any {
    return (this.workbenchEditorService.currentEditorGroup.diffEditor as any).monacoDiffEditor
      ._editorWorkerService;
  }

  public getMonacoEditor(type: TEditorType): monaco.editor.ICodeEditor {
    // @ts-ignore todo
    return type === 'original'
      ? this.diffEditor.originalEditor.monacoEditor
      : this.diffEditor.modifiedEditor.monacoEditor;
  }

  public getCoordinatesConverter(type: TEditorType) {
    return (this.getMonacoEditor(type) as any)?._modelData?.viewModel?.coordinatesConverter;
  }

  public convertViewPositionToModelPosition(type: TEditorType, lineNumber: number): number {
    const coordinatesConverter = this.getCoordinatesConverter(type);
    // @ts-ignore
    if (!coordinatesConverter) return null;

    const modelPosition = coordinatesConverter.convertViewPositionToModelPosition(
      new Position(lineNumber, 1)
    );

    return modelPosition.lineNumber;
  }

  public convertModelPositionToViewPosition(type: TEditorType, lineNumber: number): number {
    const coordinatesConverter = this.getCoordinatesConverter(type);
    // @ts-ignore
    if (!coordinatesConverter) return null;

    const modelPosition = coordinatesConverter.convertModelPositionToViewPosition(
      new Position(lineNumber, 1)
    );

    return modelPosition.lineNumber;
  }

  // 计算出最终需要折叠的 range 区间
  public async calcReverseRange(
    originalRanges: IRange[],
    modifiedRanges: IRange[]
  ): Promise<IRange[][]> {
    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;

    const [originalWithCommentRanges, modifiedWithCommentRanges] =
      this.findCommentsLine(diffEditor);

    // 左右 range 同步
    const [syncOriginReverse, syncModifiedReverse] = [
      originalRanges.concat(originalWithCommentRanges),
      modifiedRanges.concat(modifiedWithCommentRanges),
    ];

    const original = this.pipeWithFoldingRange(
      this.flushRange(syncOriginReverse),
      getMaxLineCount(diffEditor.originalEditor)
    );

    const modified = this.pipeWithFoldingRange(
      this.flushRange(syncModifiedReverse),
      getMaxLineCount(diffEditor.modifiedEditor)
    );

    return [original, modified];
  }

  public async computeDiffToRange(
    originalUri: Uri,
    modifiedUri: Uri,
    ignoreTrimWhitespace: boolean
  ): Promise<IRange[][]> {
    if (!this.editorWorkerService) return [[], []];

    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;

    const diffResult = await this.editorWorkerService.computeDiff(
      originalUri,
      modifiedUri,
      ignoreTrimWhitespace
    );

    const isRenderSideBySide = this.preferenceService.get('diffEditor.renderSideBySide');

    const originalRanges: IRange[] = [];
    const modifiedRanges: IRange[] = [];

    // 普通模式
    const handleDefaultNormal = () => {
      const changes = diffResult.changes || [];

      changes.forEach((val: any) => {
        const {
          modifiedEndLineNumber,
          modifiedStartLineNumber,
          originalEndLineNumber,
          originalStartLineNumber,
        } = val;
        // 当 endline 为 0 表示该 diff 行是阴影区域，所以需要对 startline 加1，
        const calcOriginalStartLine = originalEndLineNumber === 0 ? 2 : 3;
        const calcModifiedStartLine = modifiedEndLineNumber === 0 ? 2 : 3;

        originalRanges.push(
          generateRange(
            Math.max(1, originalStartLineNumber - calcOriginalStartLine),
            Math.min(
              // @ts-ignore
              getMaxLineCount(diffEditor.originalEditor),
              Math.max(originalStartLineNumber, originalEndLineNumber) + 3
            )
          )
        );
        modifiedRanges.push(
          generateRange(
            Math.max(1, modifiedStartLineNumber - calcModifiedStartLine),
            Math.min(
              // @ts-ignore
              getMaxLineCount(diffEditor.modifiedEditor),
              Math.max(modifiedStartLineNumber, modifiedEndLineNumber) + 3
            )
          )
        );
      });
    };

    if (isRenderSideBySide === true) {
      handleDefaultNormal();
    } else {
      // inline 模式暂发现与普通模式相同，但还是作于区分
      handleDefaultNormal();
    }

    return [originalRanges, modifiedRanges];
  }

  public updateDynamicRegionLimit(
    editorType: TEditorType,
    data: DiffFoldingChangeData
  ): [number, number] {
    const { lineNumber, type, unFoldNumber } = data;

    const region = this.currentRangeModel
      .getCurrentRangeMap(editorType)
      .find((e) => e.startLineNumber === lineNumber);

    // @ts-ignore
    if (!region) return [null, null];

    let { startLineNumber, endLineNumber } = region;

    if (type === 'up') {
      endLineNumber = Math.max(endLineNumber - unFoldNumber, startLineNumber + 1);
    } else if (type === 'down') {
      startLineNumber = Math.min(startLineNumber + unFoldNumber, endLineNumber - 1);
    }

    return [startLineNumber, endLineNumber];
  }

  public setHiddenAreas(type: TEditorType, range: IRange[]): void {
    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;
    const { originalEditor, modifiedEditor } = diffEditor;
    const monacoEditor =
      type === 'original' ? originalEditor.monacoEditor : modifiedEditor.monacoEditor;

    if (monacoEditor) {
      (monacoEditor as any).setHiddenAreas(
        range.map((e) => {
          return {
            ...e,
            startLineNumber: e.startLineNumber + 1,
          };
        })
      );
    }
  }

  // 基于 folding 的 range 计算, 反向计算出应该 folding 的区间
  private pipeWithFoldingRange(ranges: IRange[], maxLineCount?: number): IRange[] {
    let outerRanges: IRange[] = ranges.reduce((pre, cur, index, array) => {
      return pre.concat(
        // @ts-ignore
        generateRange(
          index === 0 ? 1 : array[Math.max(0, index - 1)]?.endLineNumber,
          cur.startLineNumber
        )
      );
    }, []);

    // 补上最后的 range 区间，用于解决文末存在大量非改动的情况，应自动收起
    const lastEndLine = ranges[ranges.length - 1]?.endLineNumber;
    if (maxLineCount && maxLineCount >= lastEndLine) {
      if (maxLineCount >= lastEndLine) {
        outerRanges = outerRanges.concat(generateRange(lastEndLine, maxLineCount));
      }
    }

    return this.filterRangeByRule(outerRanges);
  }

  // 过滤不符合规范的 range
  private filterRangeByRule(range: IRange[]) {
    // 区间差得大于 1
    const limit = (r: IRange) => {
      return r.endLineNumber - r.startLineNumber > 1;
    };
    return range.filter(limit);
  }

  /**
   * 刷盘规则
   * 1. 下一个 startLineNumber 要比上一个 endLineNumber 大
   * 2. 某个 range 区间在另一个区间的范围内，则忽略
   * 3. 某两个 range 区间，第一个左端点大于第二个的左断点且第一个右端点小于第二个的右端点，则进行合并
   * 4. 同上，左 =>> 右
   * 5. 两个区间之间相差小于 5 就合并在一起
   */
  private flushRange(range: IRange[]) {
    const sortByStartLine = range.sort((p, c) => p.startLineNumber - c.startLineNumber);
    const temp: IRange[] = [];
    const length = sortByStartLine.length;
    // @ts-ignore
    let currentSign: IRange = null;
    let index = 0;

    const moveNext = (i) => (currentSign = sortByStartLine[i]);
    const pushTemp = (range: IRange) => {
      const findIndex = temp.findIndex((e) => e.startLineNumber == range.startLineNumber);
      if (findIndex != -1) {
        temp.splice(findIndex, 1, range);
      } else {
        temp.push(range);
      }
    };

    while (index < length) {
      if (!currentSign) {
        moveNext(index);
        pushTemp(currentSign);
        index++;
      } else {
        const { startLineNumber, endLineNumber } = sortByStartLine[index];
        if (startLineNumber >= currentSign.endLineNumber) {
          moveNext(index);
          pushTemp(currentSign);
          index++;
        } else if (startLineNumber < currentSign.endLineNumber) {
          currentSign = generateRange(
            currentSign.startLineNumber,
            Math.max(currentSign.endLineNumber, endLineNumber)
          );
          pushTemp(currentSign);
          index++;
        }
      }
    }
    return temp;
  }

  public getDiffLineInformationForOriginal(lineNumber: number): number {
    const monacoDiffEditor = (this.workbenchEditorService.currentEditorGroup.diffEditor as any)
      .monacoDiffEditor;

    return monacoDiffEditor._getEquivalentLineForOriginalLineNumber(lineNumber);
  }

  public getDiffLineInformationForModified(lineNumber: number): number {
    const monacoDiffEditor = (this.workbenchEditorService.currentEditorGroup.diffEditor as any)
      .monacoDiffEditor;

    return monacoDiffEditor._getEquivalentLineForModifiedLineNumber(lineNumber);
  }

  // 找出当前文件的评论组件所在的行数，也计入 range 区间
  private findCommentsLine(diffEditor: IDiffEditor): [IRange[], IRange[]] {
    const { originalEditor, modifiedEditor } = diffEditor;

    const maxOriginalLineCount = getMaxLineCount(originalEditor);
    const maxModifiedLineCount = getMaxLineCount(modifiedEditor);

    let originalLineNumbers: number[] = [];
    let modifiedLineNumbers: number[] = [];

    const commentOriginal = this.commentsService
      // @ts-ignore
      .getThreadsByUri(originalEditor.currentUri)
      .map((e) => e.range.startLineNumber);
    const commentModified = this.commentsService
      // @ts-ignore
      .getThreadsByUri(modifiedEditor.currentUri)
      .map((e) => e.range.startLineNumber);

    originalLineNumbers = commentOriginal;
    modifiedLineNumbers = commentModified;

    /**
     * 同步左右两侧评论组件的 range
     * 需要用到 _getEquivalentLineForOriginalLineNumber 和 _getEquivalentLineForModifiedLineNumber
     * To: https://github.com/microsoft/vscode/blob/1.37.1/src/vs/editor/browser/widget/diffEditorWidget.ts#L1111
     */
    const computeForInverseLine = (type: TEditorType, lineNumber: number) => {
      if (type === 'original') {
        return this.getDiffLineInformationForOriginal(lineNumber);
      }
      return this.getDiffLineInformationForModified(lineNumber);
    };

    commentOriginal.forEach((e) => modifiedLineNumbers.push(computeForInverseLine('original', e)));
    commentModified.forEach((e) => originalLineNumbers.push(computeForInverseLine('modified', e)));

    const originalRanges = Array.from(new Set(originalLineNumbers)).map((e) =>
      // @ts-ignore
      generateRange(Math.max(1, e - 3), Math.min(maxOriginalLineCount, e + 3))
    );

    const modifiedRanges = Array.from(new Set(modifiedLineNumbers)).map((e) =>
      // @ts-ignore
      generateRange(Math.max(1, e - 3), Math.min(maxModifiedLineCount, e + 3))
    );

    return [originalRanges, modifiedRanges];
  }

  /**
   * 重新渲染右侧 overviewRuler
   * TO: https://github.com/microsoft/vscode/blob/f06011ac164ae4dc8e753a3fe7f9549844d15e35/src/vs/editor/common/view/overviewZoneManager.ts#L176
   *
   * */
  public renderOverviewRulerByZone(): void {
    const originalOverviewRuler = (this.diffEditor as any).monacoDiffEditor?._originalOverviewRuler;

    const modifiedOverviewRuler = (this.diffEditor as any).monacoDiffEditor?._modifiedOverviewRuler;

    if (!originalOverviewRuler && !modifiedOverviewRuler) return;

    const originalZones = originalOverviewRuler?._zoneManager?._zones;
    const modifiedZones = modifiedOverviewRuler?._zoneManager?._zones;

    // 改变原有数据的 startLineNumber 和 endLineNumber
    originalZones.forEach((zone) => {
      zone.startLineNumber = this.convertModelPositionToViewPosition(
        'original',
        zone.startLineNumber
      );
      zone.endLineNumber = this.convertModelPositionToViewPosition('original', zone.endLineNumber);
    });

    modifiedZones.forEach((zone) => {
      zone.startLineNumber = this.convertModelPositionToViewPosition(
        'modified',
        zone.startLineNumber
      );
      zone.endLineNumber = this.convertModelPositionToViewPosition('modified', zone.endLineNumber);
    });

    // _colorZonesInvalid 设为 true 才会重新计算
    originalOverviewRuler._zoneManager._colorZonesInvalid = true;
    modifiedOverviewRuler._zoneManager._colorZonesInvalid = true;

    originalOverviewRuler._render();
    modifiedOverviewRuler._render();
  }
}
