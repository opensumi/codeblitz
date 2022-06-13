import { DiffFoldingChangeData, TEditorType } from './index';
import { Autowired } from '@opensumi/di';
import {
  Disposable,
  IEventBus,
  DisposableCollection,
  CommandContribution,
  URI,
  WithEventBus,
  OnEvent,
} from '@opensumi/ide-core-common';
import {
  MonacoContribution,
  ClientAppContribution,
  IRange,
  CommandRegistry,
  PreferenceService,
  IContextKey,
  IContextKeyService,
  PreferenceChange,
  localize,
} from '@opensumi/ide-core-browser';
import { Domain } from '@opensumi/ide-core-common/lib/di-helper';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { MiscCommands, MISC_IS_EXPAND_RAW_KEY } from '.';
import { AntcodeDiffFoldingService } from './diff-folding.service';
import { sleep, generateRange } from './utils';
import { DiffFoldingWidgetService } from './zone-widget/widget.service';
import { AntcodeCommentsService } from '../comments/comments.service';
import { EditorGroupOpenEvent } from '@opensumi/ide-editor/lib/browser';
import { isChangeFileURI } from '../merge-request/changes-tree/util';
import { GitDocContentProvider } from '../git-scheme/doc-content-provider/git';
import { IMessageService } from '@opensumi/ide-overlay';
import { ICommentsService } from '@opensumi/ide-comments';

@Domain(CommandContribution, ClientAppContribution)
export class DiffFoldingContribution extends WithEventBus implements CommandContribution {
  @Autowired(IEventBus)
  public readonly eventBus: IEventBus;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(GitDocContentProvider)
  private readonly gitDocContentProvider: GitDocContentProvider;

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

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  private disposeColl = new DisposableCollection();

  private readonly miscIsExpand: IContextKey<boolean>;

  private currentURI: URI | undefined;

  private isDiffData = false;

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

    const { diffEditor } = this.workbenchEditorService.currentEditorGroup;
    const originalUri = diffEditor.originalEditor.currentUri as URI;
    const modifiedUri = diffEditor.modifiedEditor.currentUri as URI;
    if (!originalUri || !modifiedUri) return;
    // TODO 更好判断是否是diff数据
    if (
      this.gitDocContentProvider.diffData.has(originalUri.toString()) &&
      this.gitDocContentProvider.diffData.has(modifiedUri.toString())
    ) {
      this.isDiffData = true;
    } else {
      this.isDiffData = false;
    }
    // diff 数据折叠
    if (!this.preferenceService.get('acr.foldingEnabled') && !this.isDiffData) return;
    let originReverse: IRange[], modifiedReverse: IRange[];
    if (this.isDiffData) {
      originReverse = this.gitDocContentProvider.diffData.get(originalUri.toString()) as IRange[];
      modifiedReverse = this.gitDocContentProvider.diffData.get(modifiedUri.toString()) as IRange[];

      const originalThreads = this.commentsService.getThreadsByUri(originalUri);
      const modifiedThreads = this.commentsService.getThreadsByUri(modifiedUri);

      const originalHideThreads = originalThreads.filter((thread) => {
        const { startLineNumber } = thread.range;
        const isHide = originReverse.some((range) => {
          if (range.endLineNumber >= startLineNumber && range.startLineNumber < startLineNumber) {
            return true;
          }
        });
        return isHide;
      });

      const modifiedHideThreads = modifiedThreads.filter((thread) => {
        const { startLineNumber } = thread.range;
        const isHide = modifiedReverse.some((range) => {
          if (range.endLineNumber >= startLineNumber && range.startLineNumber < startLineNumber) {
            return true;
          }
        });
        return isHide;
      });
      const hideThreads = [...originalHideThreads, ...modifiedHideThreads];
      // 此处折叠后不能再打开 折叠部分的评论隐藏
      hideThreads.forEach((thread) => {
        // TODO 点击全部评论按钮还是会展示
        thread.hide();
      });
    } else {
      const [oRanges, mRanges] = await this.antcodeDiffFoldingService.computeDiffToRange(
        // FIXME @倾一 清理掉 `!`
        originalUri.codeUri,
        modifiedUri.codeUri,
        !!this.preferenceService.get('diffEditor.ignoreTrimWhitespace')
      );

      [originReverse, modifiedReverse] = await this.antcodeDiffFoldingService.calcReverseRange(
        oRanges,
        mRanges
      );
    }

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
        if (this.isDiffData) {
          // 文件不展开
          this.messageService.info(localize('codereview.folding.cantExpand'));
          return;
        }
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
