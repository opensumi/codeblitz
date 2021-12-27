import { User } from './user';

export interface ReviewCheck {
  id: number;
  iid: number;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  thresholdClear: boolean; // 有更新时重置已有的评定
  rulesType: string;
  rule: ReviewRule;
  reviewers: User[];
  state: 'opened' | 'reviewed' | 'closed';
  stateDetail: '0' | '10' | '20' | '30'; // int (enum: PRE_REVIEW, REVIEW_ING, PRE_MODIFY, MODIFY_ING) // Reveiw状态详情, 状态只能单向流转
}

export interface ReviewRule {
  rules?: ReviewRuleRule[];
  tasks?: ReviewTask[];
  threshold: number;
}

export interface ReviewRuleRule {
  filePath: string;
  globPattern: string;
  reviewers: User[];
  tasks: ReviewTask[];
  threshold: number;
}

export interface ReviewTask {
  createdAt: string;
  globPattern: string;
  id: number;
  isOwner: boolean;
  reviewId: number;
  reviewer: User;
  state: ReviewState;
  updatedAt: string;
}

export enum ReviewState {
  opened = 'opened',
  accepted = 'accepted',
  closed = 'closed',
  reject = 'reject',
}
