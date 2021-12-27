import { User } from './user';
import { CheckSuite } from './check-suite';
import { ListIssue } from './issue';
import { ReviewCheck } from './review-check';
import { PRSubscription } from './reviews';
import { MergeMethod } from './merge-method';
import { Iteration } from './iteration';

export enum PRState {
  opened = 'opened',
  closed = 'closed',
  merged = 'merged',
}

export enum StateEvent {
  open = 'open',
  close = 'close',
  merge = 'merge',
  reopen = 'reopen',
}

export enum MergeStatus {
  canBeMerged = 'can_be_merged', // 可合并
  nothingCanBeMerged = 'nothing_can_be_merged', // 无内容可合并
  conflictAndCannotBeMerged = 'conflict_and_cannot_be_merged', // 有冲突
  cannotBeMerged = 'cannot_be_merged', // 未合并
  unchecked = 'unchecked', // 未检查，后端暂时没有对应的实现，可以忽略
}

export interface PR {
  id: number; // 主键
  iid: number; // 工程内唯一id
  title: string;
  description: string;
  state: PRState;
  mergeError: string; // 合并错误信息
  sourceProjectId: number; // 来源工程ID
  sourceBranch: string; // 来源分支
  targetProjectId: number; // 目标工程ID
  targetBranch: string;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  author: User;
  assignee?: User;
  updatedBy: User;
  mergedBy: User;
  mergedAt: string; // [date]
  review?: ReviewCheck;
  checkSuites: CheckSuite[];
  shouldBeRebased: boolean;
  mergeStatus: MergeStatus;
  mergeCommitMessage: string;
  mergeCommitSha: string;
  workInProgress: boolean;
  source: PRTargetSource;
  target: PRTargetSource;
  diff: DiffVersion;
  labels: PRLabel[];
  commentsTotal?: number;
  shouldRemoveSourceBranch: boolean;
  issues: ListIssue[]; // TODO: add PR Issue
  subscription: PRSubscription;
  mergeMethod?: MergeMethod;
  squashMerge: boolean;
  mergeRequestId?: number;
  branchIteration?: Iteration;
  isCooperate?: boolean; // 来源分支是否为共建分支
  autoMerge?: boolean;
}

export interface PRLabel {
  id: number;
  title: string;
  color: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  template: boolean;
  groupId: number;
  tenantId: number;
  description: number;
  name: string;
}

interface PRTargetSource {
  // TODO: 更合适的命名
  id: number;
  path: string;
  name: string;
  pathWithNamespace: string;
  nameWithNamespace: string;
  sshUrlToRepo: string;
  httpUrlToRepo: string;
  webUrl: string;
  visibilityLevel: number;
}

export interface DiffVersion {
  id: number;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  compareId: number;
  equalsDiffId: number;
  commitsCount: number;
  filesCount: number;
  addLineNum: number;
  delLineNum: number;
  headCommitSha: string;
  startCommitSha: string;
  baseCommitSha: string;
  overflow: boolean;
}
