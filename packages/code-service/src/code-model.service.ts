import { Injectable, Autowired } from '@ali/common-di';
import { Deferred } from '@ali/ide-core-common';
import { ICodeAPIService } from './types';

@Injectable()
export class CodeModelService {
  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

  private initialized = new Deferred();

  // 平台 eg. antcode | gitlab
  private _platform: string;
  private _project: string;
  private _projectId: number | string;
  private _branch: string;
  private _commit: string;

  // 当前指向的 commit
  private _head: string;

  get platform() {
    return this._platform;
  }

  get project() {
    return this._project;
  }

  get projectId() {
    return this._projectId;
  }

  get branch() {
    return this._branch;
  }

  get commit() {
    return this._commit;
  }

  async initProject(config: {
    platform: string;
    project: string;
    projectId?: number | string;
    commit?: string;
    branch?: string;
  }) {
    this._platform = config.platform;
    this._project = config.project;
    if (config.projectId) {
      this._projectId = config.projectId;
    }
    if (config.commit) {
      this._commit = config.commit;
    }
    if (config.branch) {
      this._branch = config.branch;
    }
    // 唯一确定一个项目
    if (this._projectId && this._commit) {
      return;
    }
    if (!this._projectId || !this._branch) {
      const projectInfo = await this.codeAPI.getProjectInfo();
      this._projectId = projectInfo.id;
      if (!this._branch) {
        this._branch = projectInfo.default_branch;
      }
    }
    if (!this._commit) {
      const commitInfo = await this.codeAPI.getCommit(this._branch);
      this._commit = commitInfo.id;
    }
    this.initialized.resolve();
  }

  get ready() {
    return this.initialized.promise;
  }
}
