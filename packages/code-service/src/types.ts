import { CodeHostType } from '@alipay/alex-core';

export type TreeEntry = CodeHostType.TreeEntry;

export type EntryFileType = CodeHostType.EntryFileType;

export type EntryInfo = CodeHostType.EntryInfo;

export type EntryParam = CodeHostType.EntryParam;

export const ICodeAPIService = Symbol('ICodeAPIService');

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
   * 静态资源路径
   */
  transformStaticResource(path: string): string;
}

export type State =
  | 'Uninitialized'
  | 'Failed' // 初始化失败
  | 'Initialized' // HEAD 初始化，此时可基于 commit 获取数据
  | 'FullInitialized'; // 完全初始化，此时可获取所有关于 repository 的信息，包括 branches 和 tags

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
