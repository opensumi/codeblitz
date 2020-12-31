import { Injectable } from '@ali/common-di';
import { Deferred } from '@ali/ide-core-common';
import { getBlob, getCommit, getProjectInfo, getTree } from './request';

export interface ProjectInfo {
  id: string;
  default_branch: string;
}

@Injectable()
export class GitAPIService {
  private initialized = new Deferred();
  public project: string;
  public projectId: number;
  public commit: string;
  public branch: string;

  async init(config: { project: string; commit?: string; branch?: string }) {
    this.project = config.project;
    if (config.commit) {
      this.commit = config.commit;
    }
    if (config.branch) {
      this.branch = config.branch;
    }
    const projectInfo = await getProjectInfo(this.project);
    this.projectId = projectInfo.id;
    if (!this.branch) {
      this.branch = projectInfo.default_branch;
    }
    if (!this.commit) {
      const commitInfo = await getCommit(this.projectId, this.branch);
      this.commit = commitInfo.id;
    }
    this.initialized.resolve();
  }

  get ready() {
    return this.initialized.promise;
  }

  async getTree(path?: string) {
    await this.ready;
    return getTree(this.projectId, this.commit, path);
  }

  async getBlob(path: string) {
    await this.ready;
    return getBlob(this.projectId, this.commit, path);
  }
}
