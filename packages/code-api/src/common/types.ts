type ConstructorOf<T = any> = new (...args: any[]) => T;

export enum CodePlatform {
  antcode = 'antcode',
  github = 'github',
  gitlab = 'gitlab',
  gitlink = 'gitlink',
}

export type ICodePlatform = 'antcode' | 'github' | 'gitlab' | 'gitlink';

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

export type EntryParam = Pick<TreeEntry, 'id' | 'path'>;

export interface BranchOrTag {
  name: string;
  commit: {
    id: string;
  };
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
  actionType: FileActionType;
  content: string;
  encoding?: FileActionEncoding;
  filePath: string;
  charse?: string;
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
  authorEmail: string;
  authorName: string;
  branch: string;
  commitMessage: string;
  lastCommitId?: string;
  startBranch?: string;
}

export interface FileActionResult {
  branchCreated: boolean;
  branch: string;
  commitId: string;
  fileName: string;
}

export interface RepositoryFileModel {
  content: string;
  commitId: string;
  fileName: string;
  filePath: string;
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
   */
  getBlobByCommitPath(repo: IRepositoryModel, commit: string, path: string): Promise<Uint8Array>;
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
   */
  getCommits(repo: IRepositoryModel, params: CommitParams): Promise<CommitRecord[]>;
  /**
   * commit diff
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
  getUser(repo: IRepositoryModel): Promise<any>;
  /**
   * 获取仓库信息
   */
  getProject(repo: IRepositoryModel): Promise<Project>;
}

export interface ICodeAPIServiceProvider extends ICodeAPIService {
  initialize?(): void | Promise<void>;
}
