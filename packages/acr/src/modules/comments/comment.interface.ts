import { ICommentsThread } from '@opensumi/ide-comments';
import { IAnnotationData } from '../antcode-service/base';

export interface ICommentsThreadData {
  type: 'comment';
  noteId: number;
  isProblem: boolean;
  isChangeLineRelated: boolean;
}

export interface IAnnotationThreadData extends IAnnotationData {
  type: 'annotation';
}

export interface IAntcodeCommentThread extends ICommentsThread {
  data: ICommentsThreadData | IAnnotationThreadData;
}
