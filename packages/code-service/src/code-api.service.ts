import { Injectable, Autowired } from '@ali/common-di';
import { CodeModelService } from './code-model.service';
import { request, API } from './request';
import { ICodeAPIService } from './types';

@Injectable()
export class CodeAPIService implements ICodeAPIService {
  @Autowired()
  gitModel: CodeModelService;

  getProjectInfo() {
    return request<API.ResponseGetProjectById>(
      `/api/v3/projects/${encodeURIComponent(this.gitModel.project)}`
    );
  }

  async getCommit(ref: string) {
    return request<API.ResponseGetCommit>(
      `/api/v3/projects/${this.gitModel.projectId}/repository/commits/${ref}`
    );
  }

  async getTreeEntry(path: string) {
    await this.gitModel.ready;
    return request<API.ResponseGetTreeEntry>(
      `/api/v3/projects/${this.gitModel.projectId}/repository/tree_entry`,
      {
        params: {
          ref_name: this.gitModel.commit,
          path,
        },
      }
    );
  }

  /**
   * 根据 commit 和 path 获取 tree
   */
  async getTree(path: string = '') {
    await this.gitModel.ready;
    return request<API.ResponseGetTree>(
      `/api/v3/projects/${this.gitModel.projectId}/repository/tree`,
      {
        params: {
          ref_name: this.gitModel.commit,
          path,
        },
      }
    );
  }

  async getBlobSize(path: string) {
    await this.gitModel.ready;
    const res: Response = await request(
      `/api/v3/projects/${this.gitModel.projectId}/repository/blobs/${this.gitModel.commit}`,
      {
        params: {
          filepath: path,
        },
        method: 'HEAD',
        parseResponse: false,
      }
    );
    return parseInt(res.headers.get('Content-Length') || '-1', 10);
  }

  async getBlob(path: string = '') {
    await this.gitModel.ready;
    const buf = await request<ArrayBuffer>(
      `/api/v3/projects/${this.gitModel.projectId}/repository/blobs/${this.gitModel.commit}`,
      {
        params: {
          filepath: path,
        },
        responseType: 'arrayBuffer',
      }
    );
    return Buffer.from(buf);
  }
}
