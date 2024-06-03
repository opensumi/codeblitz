export namespace CodeAPI {
  interface Entry {
    id: string;
    type: 'commit' | 'blob' | 'tree';
    name: string;
    path: string;
    mode: string;
  }

  export interface ResponseGetCommit {
    id: string;
  }

  export type ResponseGetTree = Entry[];

  export interface ResponseGetEntry extends Entry {
    size: number;
    render: 'download' | 'image' | 'text';
  }

  export type ResponseGetRefs = Array<{
    name: string;
    commit: {
      id: string;
    };
  }>;

  export type ResponseContentSearch = Array<{
    lines: Array<{
      content: string;
      number: number;
    }>;
    path: string;
    ref: string;
  }>;

  export interface ResponseCommit {
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

  export interface ResponseCommitFileChange {
    a_mode: string;
    b_mode: string;
    binary_file: boolean;
    charset_name: string;
    deleted_file: boolean;
    diff: string;
    new_file: boolean;
    new_path: string;
    old_path: string;
    renamed_file: boolean;
    too_large: boolean;
  }

  export interface ResponseCommitCompare extends ResponseCommit {
    commits: ResponseCommit[];
    diffs: ResponseCommitFileChange[];
    compare_overflow: boolean;
    compare_same_ref: boolean;
    compare_timeout: boolean;
  }
  export interface User {
    name: string;
    email: string;
    id: number;
    username: string;
    avatar_url: string;
    bio: string;
    department: string;
    extern_uid: string;
    identities: any;
    is_admin: boolean;
    private_token: string;
    projects_limit: number;
    role: number;
    state: 'blocked' | 'active';
    web_url: string;
    website_url: string;
  }

  export interface RequestResponseOptions {
    errorOption?: boolean;
  }

  export interface CanResolveConflictResponse {
    online_resolve: boolean;
    unsupport_type: string;
  }

  export interface ResolveConflict {
    commit_message: string;
    files: {
      content: string;
      our_path: string;
      their_path: string;
    }[];
    head_sha: string;
    start_sha: string;
  }

  export interface ResolveConflictResponse {
    body: any;
    statusCode: string;
    statusCodeValue: number;
  }

  export type ConflictResponse = Conflict[];

  export interface Conflict {
    content: string;
    our_path: string;
    their_path: string;
  }
  export interface ResponseCreatePR {
    id: number;
  }
}

type ConstructorOf<T = any> = new(...args: any[]) => T;

export enum CodePlatform {
  github = 'github',
  gitlab = 'gitlab',
  gitlink = 'gitlink',
  atomgit = 'atomgit',
  codeup = 'codeup',
  gitee = 'gitee',
}

export type ICodePlatform = keyof typeof CodePlatform;

export type EntryFileType = 'commit' | 'tree' | 'blob';

export interface TreeEntry extends Partial<EntryInfo> {
  /**
   * file mode
   * 100644: 表示文件（blob）
   * 100755: 表示可执行文件（blob）
   * 040000: 表示子目录（树）
   * 160000: 表示子模块（提交）
   * 120000: 表示指定符号链接路径的 blob。
   */
  mode: '100644' | '100755' | '040000' | '160000' | '120000' | string;
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
  sha?: string | null;
}

/**
 * 额外的请求获取 size 和 file type
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
  ref?: string;
  projectId?: string;
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
  ref: string;
  commit: {
    id: string;
  };
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
export enum IterationPlatform {}

export const ICodeAPIProvider = Symbol('ICodeAPIProvider');

export interface ICodeAPIProvider {
  registerPlatformProvider(
    platform: ICodePlatform,
    provider: { provider: ConstructorOf<ICodeAPIService>; onView?: () => void },
  ): void;
  asPlatform(platform: ICodePlatform): ICodeAPIService;
}

export interface RequestFailed {
  message: string;
  status?: number;
  error?: string;
}

export interface FileOperateResult {
  branch?: string;
  branch_created?: boolean;
  commit_id?: string;
  file_path?: string;
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
    options?: any,
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
    options: { limit: number },
  ): Promise<ISearchResults>;
  /**
   * 文件搜索
   */
  searchFile(
    repo: IRepositoryModel,
    searchString: string,
    options: { limit?: number },
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
    header: FileActionHeader,
  ): Promise<FileOperateResult[]>;
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
    prId: string,
  ): Promise<CodeAPI.CanResolveConflictResponse>;
  /**
   * 解决冲突提交
   */
  resolveConflict(
    repo: IRepositoryModel,
    content: CodeAPI.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string,
  ): Promise<CodeAPI.ResolveConflictResponse>;
  /**
   * 获取解决冲突信息
   */
  getConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
  ): Promise<CodeAPI.ConflictResponse>;

  mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string,
  ): Promise<CodeAPI.ResponseCommit>;

  createPullRequest(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    autoMerge?: boolean,
  ): Promise<CodeAPI.ResponseCreatePR>;
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
    effect_line?: number;
    previous_number?: number;
  }>;
}
