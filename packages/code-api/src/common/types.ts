type ConstructorOf<T = any> = new (...args: any[]) => T;

export enum CodePlatform {
  antcode = 'antcode',
  github = 'github',
  gitlab = 'gitlab',
}

export type ICodePlatform = 'antcode' | 'github' | 'gitlab';

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
   * 获取 entry 相关信息
   */
  getEntryInfo?(repo: IRepositoryModel, entry: EntryParam): Promise<EntryInfo>;
  /**
   * 获取所有分支和标签
   */
  getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]>;
  /**
   * 获取所有分支和标签
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
    options: { limit: number }
  ): Promise<string[]>;
  /**
   * file blame
   */
  getFileBlame(repo: IRepositoryModel, filepath: string): Promise<Uint8Array | void>;
}

export interface ICodeAPIServiceProvider extends ICodeAPIService {
  initialize?(): void | Promise<void>;
}
