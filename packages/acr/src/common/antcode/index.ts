/* copied from antcode */
export interface Diff {
  aMode: string;
  bMode: string;
  binaryFile: boolean;
  deletedFile: boolean;
  diff: string;
  newFile: boolean;
  newPath: string;
  oldPath: string;
  renamedFile: boolean;
  tooLarge: boolean;
  addLineNum?: number;
  delLineNum?: number;
}

export type DiffOverview = Omit<Diff, 'diff'> & {
  id: number;
  markAsRead: boolean;
  updatedAfterRead: boolean;
};

export function isDiffOverview(d: Diff | DiffOverview): d is DiffOverview {
  return !!(d as Diff & DiffOverview).id && !(d as Diff & DiffOverview).diff;
}

/* copied from antcode */

/* convert antcode type to our own types */
export type IPullRequestChange = Diff;
export type IPullRequestChangeOverview = DiffOverview;
export type IPullRequestChangeList = Diff[] | DiffOverview[];
// type trick for union array
export type IPullRequestChangeItem = IPullRequestChange | IPullRequestChangeOverview;

export function isPullRequestChangeOverview(
  d: IPullRequestChange | IPullRequestChangeOverview
): d is IPullRequestChangeOverview {
  return (
    !!(d as IPullRequestChange & IPullRequestChangeOverview).id &&
    !(d as IPullRequestChange & IPullRequestChangeOverview).diff
  );
}

export interface CreatePullRequestParameters {
  assignee_id?: number;
  auto_merge?: boolean;
  description?: string;
  issues?: string[];
  labels?: string[];
  review_required?: boolean;
  review_rules?: {
    [key: string]: number[];
  };
  reviewer_ids?: number[];
  should_remove_source_branch?: boolean;
  source_branch: string;
  target_branch: string;
  squash_merge?: boolean;
  threshold?: number;
  title: string;
}

export interface AntcodeCommit {
  id: string;
  short_id: string;
  title: string;
  author_name: string;
  author_email: string;
  created_at: string;
  message: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  parents_ids: string[];
}

export interface PostCommentParameters {
  // comment body
  diff_id: number;
  note: string;
  /**
   * sha1(filePath)_left_right
   */
  line_code?: string;
  /**
   * filePath
   */
  path?: string;
  /**
   * comment type
   */
  type?: 'Problem' | 'Comment';
}

export interface PutCommentParameters {
  /**
   * project id
   */
  id: string;
  /**
   * pr id
   */
  pullRequestId: number;
  /**
   * note id
   */
  noteId: string;
  /**
   * comment body
   */
  note?: string;
  /**
   * comment status
   */
  state?: 'opened' | 'resolved';
}

export interface DeleteCommentParameters {
  /**
   * project id
   */
  id: string;
  /**
   * pr id
   */
  pullRequestId: number;
  /**
   * note id
   */
  noteId: string;
}

export interface DeleteCommentResponse {
  status: boolean;
  message: string;
}

export interface AntCodeUser {
  avatar_url: string;
  created_at: string;
  email: string;
  extern_uid: string;
  id: number;
  name: string;
  state: string;
  updated_at: string;
  username: string;
  web_url: string;
  access_level?: AntCodeUserAccessLevel;
}

export interface PullRequestComment {
  author: AntCodeUser;
  commit_id?: string;
  created_at: string;
  discussion_id?: number;
  id: number;
  is_award: boolean;
  line_code?: string;
  line_type?: string;
  note: string;
  noteable_id: number;
  noteable_type: 'PullRequest' | 'ReviewComment';
  outdated: boolean;
  path?: string;
  resolved_at?: string;
  resolved_by?: string;
  st_diff?: {
    diff: string;
    old_path?: string;
    new_path?: string;
  };
  state?: string;
  system?: string;
  type: 'Comment' | 'Problem';
  updated_at: string;
  discussions?: PullRequestComment[];
}

export interface PullRequestLabel {
  id: number;
  name: string;
  source_type: string;
  color: string;
  descrition?: string;
}

export interface PrReviewTask {
  state: ReviewState;
  reviewer: AntCodeUser;
  id: number;
}

export interface RuleItem {
  file_path: string;
  glob_pattern: string;
  threshold: number;
  wildcard: string;
  tasks: PrReviewTask[];
  reviewers: AntCodeUser[];
}

export interface PullRequest {
  active_time: string;
  assignee?: AntCodeUser;
  author: AntCodeUser;
  created_at: string;
  description?: string;
  id: number;
  iid: number;
  issues?: any[];
  labels?: string[];
  merge_commit_message?: string;
  merge_commit_sha?: string;
  merge_error?: string;
  merge_status?: string;
  mergeable?: boolean;
  merged_at?: string;
  merged_by?: string;
  review?: {
    id?: number;
    reviewers?: AntCodeUser[];
    rule?: {
      threshold: number;
      tasks: PrReviewTask[];
      rules?: RuleItem[];
    };
    state?: ReviewState;
    rules_type?: ReviewRulesTypeEnum;
  };
  reviewed?: boolean;
  should_be_rebased?: boolean;
  should_remove_source_branch?: boolean;
  source_branch: string;
  source_project_id?: number;
  squash_merge?: boolean;
  state?: PullRequestStateEnum;
  target_branch: string;
  target_project_id?: number;
  title: string;
  updated_at: string;
  updated_by?: AntCodeUser;
  url: string;
  web_url: string;
  work_in_progress: boolean;
}

export interface PullRequestDiff {
  add_line_num: number;
  base_commit_sha: string;
  commits_count: number;
  created_at: Date;
  del_line_num: number;
  files_count: number;
  head_commit_sha: string;
  id: number;
  overflow: boolean;
  start_commit_sha: string;
  updated_at: Date;
}

export interface CiCheckService {
  access_level: AntCodeUserAccessLevel;
  avatar_url: string;
  checks_depend_on: string;
  description: string;
  homepage: string;
  id: number;
  name: string;
}
export interface CheckRuns {
  annotations: any;
  completed_at: Date;
  conclusion: string;
  context: string;
  created_at: Date;
  detail_url: string;
  external_id: string;
  id: number;
  started_at: Date;
  status: string;
  suite_id: number;
  summary: string;
  title: string;
  update_at: Date;
}
export interface CheckSuite {
  after_sha: string;
  before_sha: string;
  check_runs: CheckRuns[];
  conclusion: any;
  created_at: Date;
  event_type: string;
  head_branch: string;
  head_sha: string;
  id: number;
  project_id: number;
  pull_request_id: number;
  service: CiCheckService;
  service_id: number;
  status: CheckStatusEnum;
  updated_at: Date;
}

export interface BranchInfo {
  commit: AntcodeCommit;
  merge_access_level: AntCodeUserAccessLevel;
  name: string;
  protect_rule: string;
  protect_rule_exact_matched: boolean;
  protected: boolean;
  push_access_level: number;
  ref: string;
}

export interface AntCodeProject {
  id: number;
  description: string;
  default_branch: string;
  public: boolean;
  visibility_level: number;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  tag_list: string[];
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  last_activity_at: string;
  owner: AntCodeUser;
  archived: boolean;
  artifacts: boolean;
  avatar_url: string;
  check_email: boolean;
  creator_id: number;
  encoding: string;
  except_branch: string;
  homepage: string;
  import_status: string;
  is_gray: boolean;
  is_review: boolean;
  namespace: any;
  repository_size: number;
  visibility: string;
  permission: {
    project_access: {
      access_level: AntCodeUserAccessLevel;
    };
  };
}

export interface AntCodeProjectPrSettings {
  created_at: Date;
  ff_only_enabled: boolean;
  id: number;
  only_all_checks_succeed: boolean;
  only_all_discussions_resolved: boolean;
  projectId: number;
  rebase_enabled: boolean;
  review_required: boolean;
  should_remove_source_branch: boolean;
  squash_merge: boolean;
  updated_at: Date;
  workitem_finish_when_merge: boolean;
  workitem_required: boolean;
}

export interface ReviewTaskDetail {
  created_at: Date;
  glob_pattern: string;
  id: number;
  isOwner: true;
  reviewId: number;
  reviewer: AntCodeUser;
  role: string;
  score: number;
  state: string;
  updated_at: Date;
  weight: number;
}

export interface ConflictsBody {
  content: string;
  our_path: string;
  their_path: string;
}

export interface ProjectReviewSettings {
  created_at: Date;
  rules_type: ReviewRulesTypeEnum;
  submitter_can_review: boolean;
  threshold: number;
  threshold_clear: boolean;
  updated_at: Date;
}

export enum CheckStatusEnum {
  SUCCESS = 'success',
  FAIL = 'fail',
  RUNNING = 'running',
}

export enum PullRequestStateEnum {
  OPENED = 'opened',
  CLOSED = 'closed',
  MERGED = 'merged',
}

export enum PullRequestReviewStateEnum {
  OPENED = 'opened',
  REVIEWED = 'reviewed',
}

export enum ReviewState {
  OPENED = 'opened',
  ACCEPTED = 'accepted',
}

export enum AntCodeUserAccessLevel {
  // no one
  NOONE = 0,
  GUEST = 10,
  REPORTER = 20,
  DEVELOPER = 30,
  MASTER = 40,
  OWNER = 50,
}

export enum ReviewRulesTypeEnum {
  // OWNERS 文件模式
  OWNERS = 'owners',
  // 投票模式
  THRESHOLD = 'threshold',
}

export enum MergeStatusEnum {
  // 因为冲突无法合并
  CONFLICT_AND_CANNOT_BE_MERGED = 'conflict_and_cannot_be_merged',
  // 分支被删除等原因无法合并
  CANNOT_BE_MERGED = 'cannot_be_merged',
  // pr 无变更内容，无法合并
  NOTHING_CAN_BE_MERGED = 'nothing_can_be_merged',
}

export interface Annotation {
  id: number;
  checkRunId: number;
  path: string;
  startLine: number;
  endLine: number;
  startCol: number;
  endCol: number;
  level: 'Failure' | 'Warning' | 'Notice';
  title: string;
  message: string;
  details: string;
}
