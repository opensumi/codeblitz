import { Injectable, Autowired } from '@ali/common-di';
import { localize, IReporterService, formatLocalize, MessageType } from '@ali/ide-core-common';
import { request, RequestOptions } from '@alipay/alex-shared';
import { API } from './types';
import { HelperService } from '../common/service';
import { CODE_PLATFORM_CONFIG } from '../common/config';
import type {
  TreeEntry,
  EntryParam,
  ICodeAPIService,
  IRepositoryModel,
  BranchOrTag,
} from '../common/types';
import { CodePlatform } from '../common/types';

/**
 * 目前 aone 不支持通过 private token 跨域调用，需要后台转发
 * 这里使用 gitlab 的 v3 接口，projectId 需使用数据库的 id，不支持 owner/name 的形式
 */

@Injectable()
export class GitLabAPIService implements ICodeAPIService {
  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired()
  helper: HelperService;

  private config = CODE_PLATFORM_CONFIG[CodePlatform.gitlab];

  private _PRIVATE_TOKEN: string | null;

  shouldShowView = false;

  get PRIVATE_TOKEN() {
    return this._PRIVATE_TOKEN;
  }

  constructor() {
    this._PRIVATE_TOKEN = this.helper.GITLAB_TOKEN;
  }

  async available() {
    const token = this._PRIVATE_TOKEN;
    if (!token) {
      this.showErrorMessage('gitlab.unauthorized');
      this.helper.revealView(CodePlatform.gitlab);
      return false;
    }
    const valid = await this.checkPrivateToken(token);
    if (!valid) {
      this.showErrorMessage('gitlab.invalid-token');
      this._PRIVATE_TOKEN = null;
      this.helper.revealView(CodePlatform.gitlab);
      return false;
    }
    return true;
  }

  private showErrorMessage(symbol: string, message?: string, status?: number) {
    this.helper.showMessage(CodePlatform.gitlab, {
      type: MessageType.Error,
      status,
      symbol,
      message,
    });
  }

  private projectIdMap = new Map<string, Promise<string>>();

  async getProjectId(repo: IRepositoryModel) {
    const projectPath = this.getProjectPath(repo);
    if (!this.projectIdMap.has(projectPath)) {
      this.projectIdMap.set(
        projectPath,
        this.getProject(repo).then(({ id }) => id)
      );
    }
    return this.projectIdMap.get(projectPath)!;
  }

  private getProjectPath(repo: IRepositoryModel) {
    return `${repo.owner}/${repo.name}`;
  }

  transformStaticResource(repo: IRepositoryModel, path: string) {
    return `${this.config.origin}/${this.getProjectPath(repo)}/raw/${
      repo.commit
    }/${path}?private_token=${this.PRIVATE_TOKEN}`;
  }

  async validateToken(token: string) {
    const valid = await this.checkPrivateToken(token);
    if (valid) {
      this._PRIVATE_TOKEN = token;
      this.helper.GITLAB_TOKEN = token;
      this.helper.reinitializeCodeService();
      this.helper.revealView('explorer');
    } else {
      this.showErrorMessage('gitlab.invalid-token');
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
        baseURL: this.config.endpoint,
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
      this.showErrorMessage(messageKey, status);
      throw err;
    }
  }

  async checkPrivateToken(token: string) {
    try {
      const response = await request.head<Response>(`/api/v3/user`, {
        baseURL: this.config.endpoint,
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

  async getProject(repo: IRepositoryModel) {
    const data = await this.request<API.ResponseGetProject>(
      `/api/v3/projects/find_with_namespace`,
      {
        params: {
          path: this.getProjectPath(repo),
        },
      }
    );
    if (!data?.id) {
      const message = formatLocalize('api.response.project-not-found', this.getProjectPath(repo));
      this.showErrorMessage('', message, 404);
      throw new Error(message);
    }
    return data;
  }

  async getCommit(repo: IRepositoryModel, ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${await this.getProjectId(repo)}/repository/commits/${encodeURIComponent(
          ref
        )}`
      )
    ).id;
  }

  async getTree(repo: IRepositoryModel, path: string) {
    const data = await this.request<API.ResponseGetTree>(
      `/api/v3/projects/${await this.getProjectId(repo)}/repository/tree`,
      {
        params: {
          ref_name: repo.commit,
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

  async getBlob(repo: IRepositoryModel, entry: EntryParam) {
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${await this.getProjectId(repo)}/repository/blobs/${repo.commit}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: entry.path,
        },
      }
    );
    return Buffer.from(buf);
  }

  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v3/projects/${await this.getProjectId(repo)}/repository/branches`
    );
  }

  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v3/projects/${await this.getProjectId(repo)}/repository/tags`
    );
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

  // 不支持
  async getFileBlame() {}
}
