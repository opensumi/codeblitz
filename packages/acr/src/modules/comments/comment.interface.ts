import { ICommentsThread } from '@ali/ide-comments';
import { INoteData } from '../antcode-service/base';

interface IExtendedNoteData extends INoteData {
  isProblem: boolean;
  isChangeLineRelated: boolean;
}

export interface IAntcodeCommentThread extends ICommentsThread {
  data: IExtendedNoteData;
}
