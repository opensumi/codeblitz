import { Annotation } from './annotation';
import { BasicService } from './basic-service';
import { User } from './user';
import { Commit } from './commit';

export interface CheckSuite {
  id: number;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  headSha: string;
  headBranch: string;
  status: CheckSuiteStatus;
  conclusion: string;
  beforeSha: string;
  afterSha: string;
  pullRequestId: number;
  projectId: number;
  eventType: CheckSuiteEventType;
  serviceId: number;
  service: BasicService;
  checkRuns?: CheckRun[];
  authorId?: number;
  author?: User;
  commit?: Commit;
  sourceUrl?: string;
  lastest?: boolean;
}

export interface CheckRun {
  id: number;
  title: string;
  summary: string;
  context: string;
  status: CheckSuiteStatus;
  conclusion: ConclusionType;
  detailUrl: string;
  externalId: string;
  suiteId: number;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  startedAt: string; // [date]
  completedAt: string; // [date]
  annotations?: Annotation[];
}

export enum ConclusionType {
  ActionRequired = 'ActionRequired',
  Canceled = 'Canceled',
  TimeOut = 'TimeOut',
  Failed = 'Failed',
  Neutral = 'Neutral',
  Success = 'Success',
}

export enum CheckSuiteStatus {
  pending = 'pending',
  running = 'running',
  success = 'success',
  successWarning = 'successWarning',
  fail = 'fail',
  cancel = 'cancel',
}

export enum CheckSuiteEventType {
  Push = 'Push',
  PullRequest = 'PullRequest',
  TagPush = 'TagPush',
}
