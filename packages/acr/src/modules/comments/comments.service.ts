import { Autowired, Injectable } from '@opensumi/di';
import { Emitter, Event, URI } from '@opensumi/ide-core-browser';
import { ICommentsService, toRange } from '@opensumi/ide-comments';
import { getSide, isProblem, isChangeLineRelated } from './utils';
import { toGitUri } from '../merge-request/changes-tree/util';
import { IAntcodeService, IComment } from '../antcode-service/base';
import { ICommentsThread } from '@opensumi/ide-comments';
import { COMMENT_FILTER_TYPE } from '.';

@Injectable()
export class AntcodeCommentsService {
  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private _commentFilterType: COMMENT_FILTER_TYPE = COMMENT_FILTER_TYPE.ALL;

  private _comments = new Map<number, ICommentsThread>();

  protected readonly _onDidChangeComments = new Emitter<void>();
  readonly onDidChangeComments: Event<void> = this._onDidChangeComments.event;

  public fireDidChangeFoldData(): void {
    this._onDidChangeComments.fire();
  }

  get commentFilterType() {
    return this._commentFilterType;
  }

  set commentFilterType(type: COMMENT_FILTER_TYPE) {
    this._commentFilterType = type;
    this.commentsService.forceUpdateDecoration();
  }

  public getCommentsThread(id: number) {
    return this._comments.get(id);
  }

  public getAllComments() {
    return this._comments;
  }

  /**
   * 创建一个评论
   * @param commentId noteId
   * @param data note data
   */
  public createComment(comment: IComment) {
    const [, leftLineNumberStr, rightLineNumberStr] = comment.lineCode.split('_');
    const [leftLineNumber, rightLineNumber] = [
      parseInt(leftLineNumberStr, 10),
      parseInt(rightLineNumberStr, 10),
    ];
    // 如果 diff 为空，则为重命名文件。重命名只显示右侧编辑器内容
    const compareSideRef = comment.stDiff.diff
      ? getSide(comment.stDiff.diff, leftLineNumber, rightLineNumber) < 0
        ? this.antcodeService.leftRef
        : this.antcodeService.rightRef
      : this.antcodeService.rightRef;

    // 生成 uri
    // 通过判断 ref 设置 path
    const uri = toGitUri(
      new URI(
        compareSideRef === this.antcodeService.leftRef
          ? comment.stDiff.oldPath
          : comment.stDiff.newPath
      ),
      compareSideRef,
      comment.stDiff.newPath
    );

    // 生成range
    const range = toRange(
      compareSideRef === this.antcodeService.leftRef ? leftLineNumber : rightLineNumber
    );
    const thread = this.commentsService.createThread(uri, range, {
      data: {
        type: 'comment',
        noteId: comment.noteId,
        isProblem: isProblem(comment),
        isChangeLineRelated: isChangeLineRelated(comment, leftLineNumber, rightLineNumber),
      },
      // 设置默认 comment 数据
      // 框架层判断是否为空的评论是更加是否有 comment 判断的
      comments: [
        {
          body: comment.note,
          author: {
            name: comment.author.name,
            iconPath: comment.author.avatarUrl,
          },
        },
      ],
    });
    this._comments.set(comment.noteId, thread);
  }

  /**
   * 删除一个 评论
   * @param commentId
   */
  public deleteComment(commentId: number) {
    const comment = this._comments.get(commentId);

    if (comment) {
      comment.dispose();
      this._comments.delete(commentId);
    }
  }
  public showAll() {
    for (let [, thread] of this._comments) {
      thread.show();
    }
  }
}
