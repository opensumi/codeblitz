import * as React from 'react';
import { Autowired } from '@ali/common-di';
import {
  CommentsContribution as CoreCommentsContribution,
  ICommentsFeatureRegistry,
  ICommentsThread,
  ICommentsZoneWidget,
} from '@ali/ide-comments';
import {
  ClientAppContribution,
  Domain,
  IRange,
  MaybePromise,
  URI,
  IEventBus,
  getIcon,
  Disposable,
  toDisposable,
} from '@ali/ide-core-browser';
import {
  IEditorDocumentModel,
  DidApplyEditorDecorationFromProvider,
  IEditor,
} from '@ali/ide-editor/lib/browser';
import { AntcodeCommentsService } from './comments.service';
import { IAntcodeService, IPullRequestChangeDiff } from '../antcode-service/base';
import { COMMENT_FILTER_TYPE, THREAD_TYPE } from '.';
import { Commenting } from './components/Commenting';
import { ChangesTreeDecorationService } from '../merge-request/changes-tree/changes-tree-decoration.service';
import { IIconService, IconType } from '@ali/ide-theme';
import { MouseWheelBlock } from './components/MouseWheelBlock';
import { AnnotationService } from './annotation.service';
import * as styles from './index.module.less';
import { Portal } from '../../portal';
import { IAntcodeCommentThread } from './comment.interface';
import { getChangeRangeByDiff } from './utils';

@Domain(ClientAppContribution, CoreCommentsContribution)
export class CommentsContribution implements ClientAppContribution, CoreCommentsContribution {
  @Autowired(AnnotationService)
  private readonly annotationService: AnnotationService;

  @Autowired(AntcodeCommentsService)
  private readonly antcodeCommentsService: AntcodeCommentsService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(ChangesTreeDecorationService)
  public readonly decorationService: ChangesTreeDecorationService;

  @Autowired(IIconService)
  private readonly iconService: IIconService;

  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  async onStart() {
    // 初始化评论数据
    this.antcodeService.comments.forEach((comment) =>
      this.antcodeCommentsService.createComment(comment)
    );

    // @ts-ignore
    this.antcodeService.annotations.forEach((annotationData) =>
      this.annotationService.createAnnotation(annotationData)
    );

    this.antcodeService.onDidCommentsCreate((comments) => {
      comments.forEach((comment) => {
        this.antcodeCommentsService.createComment(comment);
        this.decorationService.triggerDecoration(new URI(comment.stDiff.newPath));
      });
    });

    this.antcodeService.onDidAnnotationsCreate((annotationDatas) => {
      // @ts-ignore
      annotationDatas.forEach((annotationData) => {
        this.annotationService.createAnnotation(annotationData);
      });
    });

    this.antcodeService.onDidCommentsDelete((commentIds) => {
      commentIds.forEach((id) => {
        const thread = this.antcodeCommentsService.getCommentsThread(id);
        if (thread) {
          this.antcodeCommentsService.deleteComment(id);
          this.decorationService.triggerDecoration(new URI(thread.uri.getParsedQuery().newPath));
        }
      });
    });

    this.antcodeService.onDidAnnotationsDelete((annotationIds) => {
      annotationIds.forEach((id) => {
        const thread = this.annotationService.getAnnotationThread(id);
        if (thread) {
          this.annotationService.deleteAnnotation(id);
        }
      });
    });
  }

  private isCodeReviewURI(uri: URI) {
    return uri.scheme === 'git' && uri.getParsedQuery().newPath;
  }

  /**
   * 设置可以被评论的行号
   * @param editor 当前打开的编辑器
   */
  provideCommentingRanges(documentModel: IEditorDocumentModel): MaybePromise<IRange[] | undefined> {
    // 只有 CR 打开的 URI 才能出现评论
    if (this.isCodeReviewURI(documentModel.uri)) {
      const change = this.antcodeService.getChangeByUri(documentModel.uri);
      return (
        change &&
        getChangeRangeByDiff(
          // @ts-ignore
          change.diff,
          documentModel.uri.getParsedQuery().ref === this.antcodeService.leftRef
        )
      );
    }
  }

  private applyThreadDecoration(editor: IEditor, range: IRange, ...extraClassNames: string[]) {
    const decorations = editor.monacoEditor.getLineDecorations(range.startLineNumber) || [];
    editor.monacoEditor.deltaDecorations(
      decorations.filter((d) => d.options.glyphMarginClassName).map((d) => d.id),
      extraClassNames.length
        ? [
            {
              range: range,
              options: {
                glyphMarginClassName: [
                  'comments-decoration',
                  'comments-thread',
                  styles.comment_glyph_icon,
                  ...extraClassNames,
                ].join(' '),
              },
            },
          ]
        : []
    );
    this.antcodeCommentsService.fireDidChangeFoldData();
  }

  private zoneWidgetRender(thread: ICommentsThread, widget: ICommentsZoneWidget) {
    const type = thread.data?.type;
    // 说明是新增评论
    if (!type) {
      return (
        <MouseWheelBlock>
          <Commenting thread={thread} widget={widget} />
        </MouseWheelBlock>
      );
    }

    if (type === THREAD_TYPE.COMMENT) {
      const DiscussionItem = this.antcodeService.DiscussionItem;
      const noteId = thread.data?.noteId;
      if (noteId) {
        const avatar = thread.comments[0].author.iconPath?.toString();
        const avatarClassName = this.iconService.fromIcon('', avatar, IconType.Background);
        const disposer = new Disposable();
        // 在初始化或者切换的时候设置 decoration 为收起状态的图标
        disposer.addDispose(
          this.eventBus.on(DidApplyEditorDecorationFromProvider, (e) => {
            if (e.payload.uri.isEqual(thread.uri)) {
              widget.isShow &&
                this.applyThreadDecoration(
                  widget.coreEditor,
                  thread.range,
                  getIcon('fold'),
                  styles.comment_fold
                );
            }
          })
        );
        disposer.addDispose(
          widget.onShow(() =>
            this.applyThreadDecoration(
              widget.coreEditor,
              thread.range,
              getIcon('fold'),
              styles.comment_fold
            )
          )
        );
        disposer.addDispose(
          widget.onHide(() =>
            this.applyThreadDecoration(
              widget.coreEditor,
              thread.range,
              // @ts-ignore
              avatarClassName,
              styles.comment_avatar
            )
          )
        );
        disposer.addDispose(
          toDisposable(() => {
            this.applyThreadDecoration(widget.coreEditor, thread.range);
          })
        );
        thread.onDispose(() => disposer.dispose());
        return (
          <MouseWheelBlock>
            <Portal component={DiscussionItem} componentProps={{ noteId }} />
          </MouseWheelBlock>
        );
      }
    } else if (type === THREAD_TYPE.ANNOTATION) {
      // Code Insight 代码扫描
      const AnnotationEntry = this.antcodeService.AnnotationEntry;
      const { annotation, checkSuite } = thread.data;
      return (
        <Portal
          component={AnnotationEntry}
          componentProps={{
            annotation,
            checkSuite,
          }}
        />
      );
    }
  }

  registerCommentsFeature(registry: ICommentsFeatureRegistry) {
    registry.registerZoneWidgetRender(this.zoneWidgetRender.bind(this));
    registry.registerConfig({
      // 支持对单行进行多个评论操作
      isMultiCommentsForSingleLine: true,
      // 存放当前用户的头像，用于新建一个评论默认显示的头像
      author: {
        avatar: this.antcodeService.user.avatarUrl,
      },
      filterThreadDecoration: (thread: IAntcodeCommentThread) => {
        const type = thread.data?.type as THREAD_TYPE;
        // 不显示 annotation 的头像
        if (type === THREAD_TYPE.ANNOTATION) {
          return false;
        }

        const { commentFilterType } = this.antcodeCommentsService;
        const isHideAll = commentFilterType === COMMENT_FILTER_TYPE.HIDE;
        const onlyShowProblem = commentFilterType === COMMENT_FILTER_TYPE.PROBLEM;
        const onlyShowChangeLineRelatedComment =
          commentFilterType === COMMENT_FILTER_TYPE.CHANGE_LINE_RELATED;

        // 隐藏全部评论 | 仅展示问题评论
        if (
          isHideAll ||
          (onlyShowProblem && !thread.data?.isProblem) ||
          (onlyShowChangeLineRelatedComment && !thread.data?.isChangeLineRelated)
        ) {
          thread.hideAll();
        } else {
          thread.show();
        }
        // 只有在已有评论才出现用户头像
        return !!thread?.data?.noteId;
      },
    });
  }
}
