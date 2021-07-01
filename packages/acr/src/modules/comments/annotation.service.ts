import { Injectable, Autowired } from '@ali/common-di';
import { IAnnotationData, IAntcodeService } from '../antcode-service/base';
import { ICommentsService, toRange, ICommentsThread } from '@ali/ide-comments';
import { toGitUri } from '../merge-request/changes-tree/util';
import { URI } from '@ali/ide-core-browser';
import { THREAD_TYPE } from './index';

@Injectable()
export class AnnotationService {
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  private _annotations = new Map<number, ICommentsThread>();

  createAnnotation(data: IAnnotationData) {
    const { annotation, checkSuite } = data;
    // 生成 uri
    // anitation path 就是 newPath
    const uri = toGitUri(new URI(annotation.path), this.antcodeService.rightRef, annotation.path);
    const range = toRange(annotation.endLine);

    const thread = this.commentsService.createThread(uri, range, {
      data: {
        type: 'annotation',
        annotation,
        checkSuite,
      },
      // 设置默认 comment 数据
      // 框架层判断是否为空的评论是更加是否有 comment 判断的
      comments: [
        {
          body: annotation.message,
          author: {
            name: annotation.title,
          },
        },
      ],
    });

    this._annotations.set(annotation.id, thread);
  }

  /**
   * 删除一个 评论
   * @param commentId
   */
  public deleteAnnotation(annotationId: number) {
    const annotation = this._annotations.get(annotationId);

    if (annotation) {
      annotation.dispose();
      this._annotations.delete(annotationId);
    }
  }

  public getAnnotationThread(id: number) {
    return this._annotations.get(id);
  }

  public getAnnotationCountByUri(uri: URI) {
    // annotation 只检测左侧的面板
    const annotationUri = uri.scheme === 'diff' ? new URI(uri.getParsedQuery().modified) : uri;
    return this.commentsService.commentsThreads.filter(
      (thread) => thread.data?.type === THREAD_TYPE.ANNOTATION && thread.uri.isEqual(annotationUri)
    ).length;
  }
}
