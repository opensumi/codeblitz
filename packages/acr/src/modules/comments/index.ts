export enum THREAD_TYPE {
  COMMENT = 'comment',
  ANNOTATION = 'annotation',
}

export enum COMMENT_FILTER_TYPE {
  ALL = 'ALL',
  PROBLEM = 'PROBLEM', // 需要回应的评论给
  HIDE = 'HIDE',
  CHANGE_LINE_RELATED = 'CHANGE_LINE_RELATED', // 变更行关联的评论
}

export const FILTER_COMMENT_MENU_ID = 'comments/filter_comment';
export const ALL_COMMENT_COMMAND = 'codereview.comment.allComment';
export const PROBLEM_COMMENT_COMMAND = 'codereview.comment.problemComment';
export const HIDE_COMMENT_COMMAND = 'codereview.comment.hideComment';
export const CHANGE_LINE_RELATED_COMMENT_COMMAND = 'codereview.comment.prContentRelatedComment';
