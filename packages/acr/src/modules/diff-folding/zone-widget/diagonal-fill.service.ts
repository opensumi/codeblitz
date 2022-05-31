import { AntcodeDiffFoldingService } from './../diff-folding.service';
import { Disposable } from '@opensumi/ide-core-common';
import { Injectable, Autowired } from '@opensumi/di';
import { ICommentsService } from '@opensumi/ide-comments';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { IMyViewZone, IViewZoneChangeAccessor, TEditorType } from '..';
import { ViewZoneDelegate } from '@opensumi/ide-monaco-enhance';

/**
 * @deprecated
 */
@Injectable()
export class DiagonalFillWidgetService extends Disposable {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(AntcodeDiffFoldingService)
  private readonly antcodeDiffFoldingService: AntcodeDiffFoldingService;

  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  private getViewZones(
    type: TEditorType
  ): IViewZoneChangeAccessor & { _zones: { [key in number]: IMyViewZone } } {
    return (this.antcodeDiffFoldingService.getMonacoEditor(type) as any)?._modelData?.view
      ?.viewZones;
  }

  /**
   * 仅找出评论行对应的 empty widget
   */
  private findCommentEmptyWidget(type: TEditorType): IMyViewZone[] {
    const { originalEditor, modifiedEditor } =
      this.workbenchEditorService.currentEditorGroup.diffEditor;

    const viewZones = this.getViewZones(this.slopeType(type));
    if (!(viewZones && viewZones._zones)) return [];

    let commentList: number[] = [];

    if (type === 'original') {
      commentList = this.commentsService
        // @ts-ignore
        .getThreadsByUri(originalEditor.currentUri)
        .map((e) => e.range.startLineNumber);
    } else {
      commentList = this.commentsService
        // @ts-ignore
        .getThreadsByUri(modifiedEditor.currentUri)
        .map((e) => e.range.startLineNumber);
    }

    const toArrayZones = Object.values<IMyViewZone>(viewZones._zones);

    const equivalentCommentLines = commentList.map((e) =>
      this.antcodeDiffFoldingService.convertModelPositionToViewPosition(
        type,
        type === 'modified' ? this.convertEduivalentLines(type, e) : e
      )
    );

    return toArrayZones.filter((e: any) => {
      return (
        !(e.delegate instanceof ViewZoneDelegate) &&
        e.delegate.afterLineNumber > 0 &&
        equivalentCommentLines.includes(e.delegate.afterLineNumber)
      );
    });
  }

  private changeEmptyWidget(type: TEditorType, whitespaceId: number, newLineNumber: number): void {
    const viewZones = this.getViewZones(type);
    if (!viewZones._zones) return;
    const delegate = viewZones._zones[whitespaceId].delegate;
    delegate.afterLineNumber = newLineNumber;
    viewZones.layoutZone(whitespaceId);
  }

  private removeEmptyWidget(type: TEditorType, whitespaceId: number): void {
    const viewZones = this.getViewZones(type);
    viewZones.removeZone(whitespaceId);
  }

  private layout(type: TEditorType): void {
    const editor = this.antcodeDiffFoldingService.getMonacoEditor(type);
    editor.layout();
  }

  // type 翻转
  private slopeType(type: TEditorType): TEditorType {
    return type === 'original' ? 'modified' : 'original';
  }

  private convertEduivalentLines = (type: TEditorType, lineNumber: number) => {
    if (type === 'original') {
      return this.antcodeDiffFoldingService.getDiffLineInformationForOriginal(lineNumber);
    }
    return this.antcodeDiffFoldingService.getDiffLineInformationForModified(lineNumber);
  };

  public flushEmptyWidgetPosition(type: TEditorType): void {
    const allCommentEmptyWidgets = this.findCommentEmptyWidget(type);

    allCommentEmptyWidgets.forEach((e) => {
      this.changeEmptyWidget(
        this.slopeType(type),
        e.whitespaceId,
        type === 'modified'
          ? this.antcodeDiffFoldingService.convertViewPositionToModelPosition(
              type,
              e.delegate.afterLineNumber
            )
          : this.convertEduivalentLines(
              type,
              this.antcodeDiffFoldingService.convertViewPositionToModelPosition(
                type,
                e.delegate.afterLineNumber
              )
            )
      );
    });
    if (allCommentEmptyWidgets.length > 0) {
      this.layout(type);
    }
  }
}
