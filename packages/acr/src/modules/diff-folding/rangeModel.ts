import { IRange } from '@opensumi/ide-core-common';
import { TEditorType } from '.';

export class RangeModel {
  private currentRangeMap: Map<TEditorType, IRange[]> = new Map();

  constructor() {}

  public setCurrentRangeMap(range: IRange[], type: TEditorType): void {
    this.currentRangeMap.set(type, range);
  }

  public getCurrentRangeMap(type: TEditorType): IRange[] {
    // @ts-ignore
    return this.currentRangeMap.get(type);
  }

  public findCurrentRangeMapByLine(startLine: number, type: TEditorType): IRange | undefined {
    return this.getCurrentRangeMap(type).find((e) => e.startLineNumber === startLine);
  }

  public delRange(line: number, type: TEditorType): IRange[] {
    const ranges = this.getCurrentRangeMap(type);
    const findR = this.findCurrentRangeMapByLine(line, type);

    if (findR) {
      const newRanges = ranges.filter((e) => e.startLineNumber !== findR.startLineNumber);
      this.setCurrentRangeMap(newRanges, type);
      return newRanges;
    }
    return ranges;
  }

  public changeRange(
    line: number,
    byType: 'start' | 'end',
    type: TEditorType,
    newRange: IRange
  ): IRange[] {
    const _newRanges = this.getCurrentRangeMap(type).map((e) => {
      if (byType === 'start' && e.startLineNumber === line) {
        return newRange;
      } else if (byType === 'end' && e.endLineNumber === line) {
        return newRange;
      }
      return e;
    });
    this.setCurrentRangeMap(_newRanges, type);
    return _newRanges;
  }
}
