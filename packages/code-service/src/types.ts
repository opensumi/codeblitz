import { API } from './request';

export const ICodeAPIService = Symbol('ICodeAPIService');

export interface ICodeAPIService {
  /**
   * 获取仓库信息
   */
  getProjectInfo(): Promise<API.ResponseGetProjectById>;
  /**
   * 根据分支获取最新的 commit
   */
  getCommit(ref: string): Promise<API.ResponseGetCommit>;
  /**
   * 获取文件节点
   */
  getTreeEntry(path: string): Promise<API.ResponseGetTreeEntry>;
  /**
   * 获取文件树
   */
  getTree(path: string): Promise<API.ResponseGetTree>;
  /**
   * 根据 commit 和 path 获取 blob
   */
  getBlob(path: string): Promise<Buffer>;
  /**
   * HEAD 获取 blob size
   */
  getBlobSize(path: string): Promise<number>;
}
