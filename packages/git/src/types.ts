import { API } from './request';

export const IGitAPIService = Symbol('IGitAPIService');

export interface IGitAPIService {
  project: string;
  projectId: number;
  commit: string;
  branch: string;
  initProject(config: {
    projectId?: number;
    project: string;
    commit?: string;
    branch?: string;
  }): Promise<void>;
  getProjectInfo(): Promise<API.ResponseGetProjectById>;
  getCommit(ref: string): Promise<API.ResponseGetCommit>;
  getTreeEntry(path: string): Promise<API.ResponseGetTreeEntry>;
  getTree(path: string): Promise<API.ResponseGetTree>;
  getBlob(path: string): Promise<Buffer>;
  getBlobSize(path: string): Promise<number>;
}
