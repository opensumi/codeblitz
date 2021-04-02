import { Injectable, Autowired } from '@ali/common-di';
import { localize, IReporterService, formatLocalize } from '@ali/ide-core-common';
import { CodeModelService, ICodeAPIService } from '@alipay/alex-code-service';
import type { TreeEntry, EntryParam, RefsParam } from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { isResponseError, request, RequestOptions } from '@alipay/alex-shared';
import { API } from './types';
import { HelperService } from '../common/service';

/**
 * 目前 aone 不支持通过 private token 跨域调用，需要后台转发
 * 这里使用 gitlab 的 v3 接口，projectId 需使用数据库的 id，不支持 owner/name 的形式
 */

@Injectable()
export class GitLabService implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired()
  helper: HelperService;

  private id: string;

  private _PRIVATE_TOKEN: string | null;

  shouldShowView = false;

  get PRIVATE_TOKEN() {
    return this._PRIVATE_TOKEN;
  }

  async initialize() {
    const token = this.helper.GITLAB_TOKEN;
    if (!token) {
      this.throwWhenInitializeFailed('gitlab.unauthorized');
    }
    const valid = await this.checkPrivateToken(token);
    if (!valid) {
      this.throwWhenInitializeFailed('gitlab.invalid-token');
    }
    this._PRIVATE_TOKEN = token;
    await this.setProjectId();
  }

  async setProjectId() {
    const { id } = await this.getProject();
    this.id = id;
  }

  throwWhenInitializeFailed(msgKey: string): never {
    const message = localize(msgKey);
    this.messageService.error(message);
    this.shouldShowView = true;
    throw new Error(message);
  }

  transformStaticResource(path: string) {
    const { codeModel } = this;
    return `${codeModel.origin}/${codeModel.project}/raw/${codeModel.HEAD}/${path}?private_token=${this.PRIVATE_TOKEN}`;
  }

  async validateToken(token: string) {
    const valid = await this.checkPrivateToken(token);
    if (valid) {
      this._PRIVATE_TOKEN = token;
      this.helper.GITLAB_TOKEN = token;
      await this.setProjectId();
      this.codeModel.reset();
      this.helper.revealView('explorer');
    } else {
      this.messageService.error(localize('gitlab.invalid-token'));
    }
    return valid;
  }

  clearToken() {
    this._PRIVATE_TOKEN = null;
    this.helper.GITLAB_TOKEN = null;
  }

  private async request<T>(path: string, options?: RequestOptions): Promise<T> {
    try {
      const { headers, ...rest } = options || {};
      const privateToken = this.PRIVATE_TOKEN;
      return await request(path, {
        baseURL: this.codeModel.endpoint,
        responseType: 'json',
        headers: {
          ...(privateToken
            ? {
                'PRIVATE-TOKEN': privateToken,
              }
            : {}),
          ...headers,
        },
        ...rest,
      });
    } catch (err: any) {
      const status = err.response?.status;
      let messageKey = 'error.request';
      if (status === 401) {
        messageKey = 'gitlab.unauthorized';
      } else if (status === 404) {
        messageKey = 'error.resource-not-found';
      }
      this.messageService.error(`${status} - ${localize(messageKey)}`);
      throw err;
    }
  }

  async checkPrivateToken(token: string) {
    try {
      const response = await request.head<Response>(`/api/v3/user`, {
        baseURL: this.codeModel.endpoint,
        headers: {
          'PRIVATE-TOKEN': token,
        },
        validateStatus: () => true,
      });
      if (response.status === 401) {
        return false;
      }
    } catch (err) {
      return false;
    }
    return true;
  }

  async getProject() {
    const data = await this.request<API.ResponseGetProject>(
      `/api/v3/projects/find_with_namespace`,
      {
        params: {
          path: this.codeModel.project,
        },
      }
    );
    if (!data?.id) {
      const message = formatLocalize('api.response.project-not-found', this.codeModel.project);
      this.messageService.error(`404 - ${message}`);
      throw new Error(message);
    }
    return data;
  }

  async getCommit(ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.id}/repository/commits/${encodeURIComponent(ref)}`
      )
    ).id;
  }

  async getTree(path: string) {
    await this.codeModel.headInitialized;
    const data = await this.request<API.ResponseGetTree>(
      `/api/v3/projects/${this.id}/repository/tree`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
          path,
        },
      }
    );
    return data.map<TreeEntry>((item) => {
      const entry: TreeEntry = {
        ...item,
        path: `${path ? `${path}/` : ''}${item.name}`,
      };
      return entry;
    });
  }

  async getBlob(entry: EntryParam) {
    await this.codeModel.headInitialized;
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${this.id}/repository/blobs/${this.codeModel.HEAD}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: entry.path,
        },
      }
    );
    return Buffer.from(buf);
  }

  async getRefs(): Promise<RefsParam> {
    const [branches, tags] = await Promise.all([
      this.request<API.ResponseGetRefs>(`/api/v3/projects/${this.id}/repository/branches`),
      this.request<API.ResponseGetRefs>(`/api/v3/projects/${this.id}/repository/tags`),
    ]);
    return {
      branches,
      tags,
    };
  }

  /**
   * gitlab 接口不支持搜索
   */
  async searchContent() {
    return [];
  }

  async searchFile() {
    return [];
  }
}
