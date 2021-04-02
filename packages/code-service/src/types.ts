import { CodeHostType } from '@alipay/alex-core';

export type TreeEntry = CodeHostType.TreeEntry;

export type EntryFileType = CodeHostType.EntryFileType;

export type EntryInfo = CodeHostType.EntryInfo;

export type EntryParam = CodeHostType.EntryParam;

export const ICodeAPIService = Symbol('ICodeAPIService');

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

export interface ICodeAPIService {
  /**
   * 初始化
   */
  initialize(): Promise<void>;
  /**
   * 根据分支获取最新的 commit
   */
  getCommit(ref: string): Promise<string>;
  /**
   * 获取 tree
   */
  getTree(path: string): Promise<TreeEntry[]>;
  /**
   * 获取 blob
   */
  getBlob(entry: EntryParam): Promise<Buffer>;
  /**
   * 获取 entry 相关信息
   */
  getEntryInfo?(entry: EntryParam): Promise<EntryInfo>;
  /**
   * 获取所有分支和标签
   */
  getRefs(): Promise<{ branches: BranchOrTag[]; tags: BranchOrTag[] }>;
  /**
   * 静态资源路径
   */
  transformStaticResource(path: string): string;
  /**
   * 内容搜索
   */
  searchContent(searchString: string, options: { limit: number }): Promise<ISearchResults>;
  /**
   * 文件搜索
   */
  searchFile(searchString: string, options: { limit: number }): Promise<string[]>;
}

export type State =
  | 'Uninitialized'
  | 'Failed' // 初始化失败
  | 'Initialized'; // HEAD 初始化，此时可基于 commit 获取数据

/**
 * 无需 Remote
 */
export const enum RefType {
  Head,
  Tag,
}

export interface Ref {
  readonly type: RefType;
  readonly name: string;
  readonly commit: string;
}

export interface Refs {
  readonly branches: Ref[];
  readonly tags: Ref[];
}

export interface Submodule {
  name: string;
  path: string;
  url: string;
}
