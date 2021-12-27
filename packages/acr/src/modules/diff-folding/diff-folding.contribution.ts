import { DiffFoldingChangeData, TEditorType } from './index';
import { Autowired } from '@ali/common-di';
import {
  Disposable,
  IEventBus,
  DisposableCollection,
  CommandContribution,
  URI,
  WithEventBus,
  OnEvent,
} from '@ali/ide-core-common';
import {
  MonacoContribution,
  ClientAppContribution,
  IRange,
  CommandRegistry,
  PreferenceService,
  IContextKey,
  IContextKeyService,
  PreferenceChange,
} from '@ali/ide-core-browser';
import { Domain } from '@ali/ide-core-common/lib/di-helper';
import { WorkbenchEditorService } from '@ali/ide-editor';
import { MiscCommands, MISC_IS_EXPAND_RAW_KEY } from '.';
import { AntcodeDiffFoldingService } from './diff-folding.service';
import { sleep, generateRange } from './utils';
import { DiffFoldingWidgetService } from './zone-widget/widget.service';
import { AntcodeCommentsService } from '../comments/comments.service';
import { EditorGroupOpenEvent } from '@ali/ide-editor/lib/browser';
import { isChangeFileURI } from '../merge-request/changes-tree/util';

@Domain(CommandContribution, ClientAppContribution, MonacoContribution)
export class DiffFoldingContribution
  extends WithEventBus
  implements MonacoContribution, CommandContribution
{
  @Autowired(IEventBus)
  public readonly eventBus: IEventBus;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  @Autowired(AntcodeDiffFoldingService)
  private readonly antcodeDiffFoldingService: AntcodeDiffFoldingService;

  @Autowired(DiffFoldingWidgetService)
  private readonly diffFoldingWidgetService: DiffFoldingWidgetService;

  @Autowired(AntcodeCommentsService)
  private readonly antcodeCommentsService: AntcodeCommentsService;

  private disposeColl = new DisposableCollection();

  private readonly miscIsExpand: IContextKey<boolean>;

  private currentURI: URI | undefined;

  constructor() {
    super();
    this.miscIsExpand = MISC_IS_EXPAND_RAW_KEY.bind(this.globalContextKeyService);
    this.antcodeDiffFoldingService.currentRangeModel.setCurrentRangeMap([], 'original');
    this.antcodeDiffFoldingService.currentRangeModel.setCurrentRangeMap([], 'modified');
  }

  onMonacoLoaded() {}

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(MiscCommands.ExpandFie, {
      execute: async () => {
        this.miscIsExpand.set(true);

        await this.foldingEditorAll(!this.miscIsExpand.get());
        this.diffFoldingWidgetService.clear();
        this.diffFoldingWidgetService.launchFirstLineHideHandle();
      },
    });
  }

  @OnEvent(EditorGroupOpenEvent)
  onEditorGroupOpen(e: EditorGroupOpenEvent) {
    this.init(e.payload.resource.uri);
  }

  async init(uri: URI) {
    this.currentURI = uri;

    this.diffFoldingWidgetService.clear();
    this.diffFoldingWidgetService.launchFirstLineHideHandle();
    // 切换文件重置展开状态
    this.miscIsExpand.set(false);
    this.disposeColl.dispose();

    if (!isChangeFileURI(uri)) return;
    if (uri.scheme !== 'diff') return;

    if (!this.preferenceService.get('acr.foldingEnabled')) return;

    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;

    if (!diffEditor.originalEditor.currentUri || !diffEditor.modifiedEditor.currentUri) return;

    const [oRanges, mRanges] = await this.antcodeDiffFoldingService.computeDiffToRange(
      // FIXME @倾一 清理掉 `!`
      diffEditor.originalEditor.currentUri.codeUri,
      diffEditor.modifiedEditor.currentUri.codeUri,
      !!this.preferenceService.get('diffEditor.ignoreTrimWhitespace')
    );

    const [originReverse, modifiedReverse] = await this.antcodeDiffFoldingService.calcReverseRange(
      oRanges,
      mRanges
    );

    this.generateFolding(originReverse, modifiedReverse);

    this.generateZoneWidget(originReverse, modifiedReverse);

    this.foldingEditorAll(true);

    this.antcodeDiffFoldingService.renderOverviewRulerByZone();

    this.launchFlushEmptyWidgetPosition();
  }

  onStart() {
    this.addDispose(
      this.antcodeCommentsService.onDidChangeComments(async () => {
        await sleep(0);
        this.launchFlushEmptyWidgetPosition();
      })
    );

    this.addDispose(
      this.preferenceService.onSpecificPreferenceChange(
        'acr.foldingEnabled',
        async (data: PreferenceChange) => {
          const isEnable = data.newValue;

          if (isEnable === true && this.currentURI) {
            await this.init(this.currentURI);
          }
          if (isEnable === false) {
            this.diffFoldingWidgetService.clear();
            this.diffFoldingWidgetService.launchFirstLineHideHandle();
            this.foldingEditorAll(false);
          }
        }
      )
    );

    this.addDispose(
      this.preferenceService.onSpecificPreferenceChange(
        'diffEditor.ignoreTrimWhitespace',
        async () => {
          // FIXME @倾一 清理掉 `!`
          await this.init(this.currentURI!);
        }
      )
    );

    // zone widget event change
    this.addDispose(
      this.diffFoldingWidgetService.onUnFoldChanged(async (changeData) => {
        const { data, type } = changeData;

        let formatDataForOriginal: DiffFoldingChangeData = data;
        let formatDataForModified: DiffFoldingChangeData = data;

        if (type === 'original') {
          formatDataForModified = {
            ...data,
            lineNumber: this.antcodeDiffFoldingService.getDiffLineInformationForOriginal(
              data.lineNumber
            ),
          };
        } else if (type === 'modified') {
          formatDataForOriginal = {
            ...data,
            lineNumber: this.antcodeDiffFoldingService.getDiffLineInformationForModified(
              data.lineNumber
            ),
          };
        }

        this.handleUnFoldChange(formatDataForOriginal, 'original');
        this.handleUnFoldChange(formatDataForModified, 'modified');
        this.diffFoldingWidgetService.flushZonePosition();
        await sleep(10);
        this.launchFlushEmptyWidgetPosition();
        this.antcodeDiffFoldingService.renderOverviewRulerByZone();
      })
    );
  }

  private launchFlushEmptyWidgetPosition(type: TEditorType | 'all' = 'all'): void {
    if (type === 'all') {
      // ****** 顺序最好不要改变
      // this.diagonalFillWidgetService.flushEmptyWidgetPosition('original');
      // this.diagonalFillWidgetService.flushEmptyWidgetPosition('modified');
    } else {
      // this.diagonalFillWidgetService.flushEmptyWidgetPosition(type);
    }
  }

  private handleUnFoldChange(changeData: DiffFoldingChangeData, editorType: TEditorType): void {
    const { lineNumber, type, unFoldNumber } = changeData;
    if (type === 'all') {
      const newRange = this.antcodeDiffFoldingService.currentRangeModel.delRange(
        lineNumber,
        editorType
      );
      this.antcodeDiffFoldingService.setHiddenAreas(editorType, newRange);
      this.diffFoldingWidgetService.delWidget(lineNumber, editorType);
    } else {
      const [startLine, endLine] = this.antcodeDiffFoldingService.updateDynamicRegionLimit(
        editorType,
        changeData
      );

      const changeLine = type === 'up' ? startLine : endLine;
      const changeType = type === 'up' ? 'start' : 'end';

      if (startLine && endLine) {
        const newRange = this.antcodeDiffFoldingService.currentRangeModel.changeRange(
          changeLine,
          changeType,
          editorType,
          generateRange(startLine, endLine)
        );
        this.antcodeDiffFoldingService.setHiddenAreas(editorType, newRange);
        this.diffFoldingWidgetService.delWidget(lineNumber, editorType);
        this.diffFoldingWidgetService.addWidget(startLine, editorType);
        this.diffFoldingWidgetService.showWidget(startLine, endLine, editorType);
      }
    }

    this.diffFoldingWidgetService.launchFirstLineHideHandle();
  }

  private async foldingEditorAll(isFold: boolean) {
    if (isFold) {
      this.antcodeDiffFoldingService.setHiddenAreas(
        'original',
        this.antcodeDiffFoldingService.currentRangeModel.getCurrentRangeMap('original')
      );
      this.antcodeDiffFoldingService.setHiddenAreas(
        'modified',
        this.antcodeDiffFoldingService.currentRangeModel.getCurrentRangeMap('modified')
      );
    } else {
      this.antcodeDiffFoldingService.setHiddenAreas('original', []);
      this.antcodeDiffFoldingService.setHiddenAreas('modified', []);
    }
  }

  private generateFolding(originalRanges: IRange[], modifiedRanges: IRange[]) {
    this.antcodeDiffFoldingService.currentRangeModel.setCurrentRangeMap(originalRanges, 'original');
    this.antcodeDiffFoldingService.currentRangeModel.setCurrentRangeMap(modifiedRanges, 'modified');
  }

  private generateZoneWidget(originalRanges: IRange[], modifiedRanges: IRange[]) {
    this.diffFoldingWidgetService.generateZoneWidget(originalRanges, modifiedRanges);
    this.diffFoldingWidgetService.showAll(originalRanges, modifiedRanges);
    this.diffFoldingWidgetService.launchFirstLineHideHandle();
    this.diffFoldingWidgetService.flushZonePosition();
  }
}
