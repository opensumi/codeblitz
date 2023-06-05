import type { API as AntCodeAPI } from '../antcode/types';
export { AntCodeAPI };
type ConstructorOf<T = any> = new (...args: any[]) => T;

export enum CodePlatform {
  antcode = 'antcode',
  github = 'github',
  gitlab = 'gitlab',
  gitlink = 'gitlink',
  atomgit = 'atomgit',
}

export type ICodePlatform = keyof typeof CodePlatform;

export type EntryFileType = 'commit' | 'tree' | 'blob';

export interface TreeEntry extends Partial<EntryInfo> {
  /**
   * file mode
   */
  mode: string;
  /**
   * file type
   */
  type: EntryFileType;
  /**
   * object id
   */
  id: string;
  /**
   * file name
   */
  name: string;
  /**
   * full path
   */
  path: string;

  // file sha
  sha?: string;
}

/**
 * antcode, aone 用额外的请求获取 size 和 file type
 */
export interface EntryInfo {
  /**
   * file size
   */
  size: number;
  /**
   * file type
   */
  fileType: 'binary' | 'text' | 'image';
}

export type EntryParam = Pick<TreeEntry, 'id' | 'path' | 'sha'>;

export interface BranchOrTag {
  name: string;
  commit: {
    id: string;
  };
  protected?: boolean;
}

export interface RefsParam {
  branches: BranchOrTag[];
  tags: BranchOrTag[];
}

export type ISearchResults = Array<{
  path: string;
  line: number;
  content: string;
}>;

export interface IRepositoryModel {
  platform: ICodePlatform;
  owner: string;
  name: string;
  commit: string;
}

export interface CommitParams {
  ref?: string;
  path?: string;
  page: number;
  pageSize: number;
}

export interface CommitRecord {
  id: string;
  parents: ReadonlyArray<string>;
  author: string;
  authorEmail: string;
  authorDate: string;
  committer: string;
  committerEmail: string;
  committerDate: string;
  // signature: null; // GPA 签名
  message: string;
  title?: string;
}

export interface CommitFileChange {
  oldFilePath: string;
  newFilePath: string;
  type: CommitFileStatus;
  additions: number | null;
  deletions: number | null;
}

export const enum CommitFileStatus {
  Added = 'A',
  Modified = 'M',
  Deleted = 'D',
  Renamed = 'R',
}

export interface FileAction {
  action_type: FileActionType;
  content: string;
  file_path: string;
  encoding?: FileActionEncoding;
  charset?: string;
}

export enum FileActionType {
  create = 'CREATE',
  update = 'UPDATE',
  delete = 'DELETE',
}

export enum FileActionEncoding {
  text = 'text',
  base64 = 'base64',
}

export interface FileActionHeader {
  author_email: string;
  author_name: string;
  branch: string;
  commit_message: string;
  last_commit_id?: string;
  start_branch?: string;
}

export interface FileActionResult {
  branch_created: boolean;
  branch: string;
  commit_id: string;
  file_name: string;
}

export interface RepositoryFileModel {
  content: string;
  commit_id: string;
  file_name: string;
  filepath: string;
  ref: string;
}

export interface Branch {
  name: string;
  protect: boolean;
  protected: boolean;
  protectRuleExactMatched: boolean; // 是否通过名字精准匹配
  protectRule: string; // 保护分支规则
  mergeAccessLevel: string | number; // TODO: 后端接口转成字符串了，后面需要改成 number
  pushAccessLevel: string | number; // TODO: 后端接口转成字符串了，后面需要改成 number
  ref: string;
  commit: Commit;
  branchIterations?: Iteration[];
  isCooperate?: boolean;
}

export interface User {
  email: string;
  name: string;
  id: number;
}
export interface Project {
  id: string;
  default_branch: string | null;
}

export interface Commit {
  author_email: string;
  author_name: string;
  authored_date: string;
  committed_date: string;
  committer_email: string;
  committer_name: string;
  created_at: string;
  id: string;
  message: string;
  parent_ids: string[];
  short_id: string;
  title: string;
}
export interface Iteration {
  id: number;
  projectId: number;
  branch: string;
  platform?: IterationPlatform;
  iterationMark: string;
  msgId: string;
  releaseMode: string;
  state: string;
  title: string;
  url: string;
  crateAt: string;
  updateAt: string;
}
export enum IterationPlatform {
  linke = 'LINKE',
  yuyan = 'YUYAN',
  huoban = 'HUOBAN',
}

export const ICodeAPIProvider = Symbol('ICodeAPIProvider');

export interface ICodeAPIProvider {
  registerPlatformProvider(
    platform: ICodePlatform,
    provider: { provider: ConstructorOf<ICodeAPIService>; onView?: () => void }
  ): void;
  asPlatform(platform: ICodePlatform): ICodeAPIService;
}

export interface RequestFailed {
  message: string;
  status?: number;
  error?: string;
}

export interface ICodeAPIService {
  /**
   * 检查 API service 可用性
   */
  available(): Promise<boolean>;
  /**
   * 根据分支获取最新的 commit
   */
  getCommit(repo: IRepositoryModel, ref: string): Promise<string>;
  /**
   * 获取 tree
   */
  getTree(repo: IRepositoryModel, path: string): Promise<TreeEntry[]>;
  /**
   * 获取 blob
   */
  getBlob(repo: IRepositoryModel, entry: EntryParam): Promise<Uint8Array>;
  /**
   * 获取 blob
   * git graph 获取文件内容
   */
  getBlobByCommitPath(
    repo: IRepositoryModel,
    commit: string,
    path: string,
    options?: any
  ): Promise<Uint8Array>;
  /**
   * 获取 entry 相关信息
   */
  getEntryInfo?(repo: IRepositoryModel, entry: EntryParam): Promise<EntryInfo>;
  /**
   * 获取所有分支
   */
  getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]>;
  /**
   * 获取所有分支
   */
  getBranchNames?(repo: IRepositoryModel): Promise<string[]>;
  /**
   * 获取所有标签
   */
  getTags(repo: IRepositoryModel): Promise<BranchOrTag[]>;
  /**
   * 静态资源路径
   */
  transformStaticResource(repo: IRepositoryModel, path: string): string;
  /**
   * 内容搜索
   */
  searchContent(
    repo: IRepositoryModel,
    searchString: string,
    options: { limit: number }
  ): Promise<ISearchResults>;
  /**
   * 文件搜索
   */
  searchFile(
    repo: IRepositoryModel,
    searchString: string,
    options: { limit?: number }
  ): Promise<string[]>;
  /**
   * file blame
   */
  getFileBlame(repo: IRepositoryModel, filepath: string): Promise<Uint8Array>;
  /**
   * commits list
   * git graph插件使用
   */
  getCommits(repo: IRepositoryModel, params: CommitParams): Promise<CommitRecord[]>;
  /**
   * commit diff
   * git graph插件使用
   */
  getCommitDiff(repo: IRepositoryModel, sha: string): Promise<CommitFileChange[]>;
  /**
   * compare commit
   */
  getCommitCompare(repo: IRepositoryModel, from: string, to: string): Promise<CommitFileChange[]>;

  // antcode
  /**
   * 获取所有文件
   */
  getFiles(repo: IRepositoryModel): Promise<string[]>;
  /**
   * 更新文件
   */
  bulkChangeFiles(
    repo: IRepositoryModel,
    actions: FileAction[],
    header: FileActionHeader
  ): Promise<any>;
  /**
   * 创建分支
   */
  createBranch(repo: IRepositoryModel, newBranch: string, ref: string): Promise<Branch>;
  /**
   * 获取用户信息
   */
  getUser(repo: IRepositoryModel): Promise<User | any>;
  /**
   * 获取仓库信息
   */
  getProject(repo: IRepositoryModel): Promise<Project>;
  /* 解决冲突场景 */

  // 是否可以在线解决冲突
  canResolveConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    prId: string
  ): Promise<AntCodeAPI.CanResolveConflictResponse>;
  /**
   * 解决冲突提交
   */
  resolveConflict(
    repo: IRepositoryModel,
    content: AntCodeAPI.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string
  ): Promise<AntCodeAPI.ResolveConflictResponse>;
  /**
   * 获取解决冲突信息
   */
  getConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string
  ): Promise<AntCodeAPI.ConflictResponse>;

  mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string
  ): Promise<AntCodeAPI.ResponseCommit>;
}

export interface ICodeAPIServiceProvider extends ICodeAPIService {
  initialize?(): void | Promise<void>;
}

export interface GitlensBlame {
  commit: {
    author_email: string;
    author_name: string;
    authored_date: number;
    committed_date: number;
    id: string; // sha
    message: string;
    author: {
      avatar_url: string;
    };
  };
  lines: Array<{
    current_number: number;
    effect_line: number;
    previous_number: number;
  }>;
}