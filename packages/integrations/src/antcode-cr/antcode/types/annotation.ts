import { User } from './user';
export interface Annotation {
  id: number;
  checkRunId: number;
  path: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  level: AnnotationType;
  title: string;
  message: string;
  details: string;
  feedBackUser: User; // 反馈人
  feedBackUserId: number; // 反馈人用户 ID
  bugId?: string; // 服务方的唯一 ID
  bugType?: string; // 服务方归类的 bug 类型
  bugTypeName?: string; // 服务方归类的 bug 类型描述
  feedBackStatus: AnnotationStatus; // 反馈状态
}

export enum AnnotationType {
  Failure = 'Failure',
  Warning = 'Warning',
  Notice = 'Notice',
}

export enum AnnotationStatus {
  Init = 'Init',
  Ignore = 'Ignore',
  Confirm = 'Confirm',
  FalsePositive = 'FalsePositive',
}
