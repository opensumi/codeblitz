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
  CommitParams,
} from '../common/types';
import { CodePlatform, CommitFileStatus } from '../common/types';

const toType = (d: API.ResponseCommitFileChange) => {
  if (d.new_file) return CommitFileStatus.Added;
  else if (d.deleted_file) return CommitFileStatus.Deleted;
  else if (d.renamed_file) return CommitFileStatus.Renamed;
  return CommitFileStatus.Modified;
};
const toChangeLines = (diff: string) => {
  const diffLines = diff ? diff.split('\n') : [];
  return diffLines.reduce(
    (obj, line) => {
      // +++,--- 在首行为文件名
      if (line.startsWith('+') && !line.startsWith('+++')) {
        obj.additions += 1;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        obj.deletions += 1;
      }
      return obj;
    },
    { additions: 0, deletions: 0 }
  );
};

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

  async getBlobByCommitPath(repo: IRepositoryModel, commit: string, path: string) {
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${await this.getProjectId(repo)}/repository/blobs/${commit}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: path,
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
  async getFileBlame() {
    return Uint8Array.from([]);
  }

  // TODO: 接口数据略有问题，先返回空
  async getCommits(repo: IRepositoryModel, params: CommitParams) {
    // const data = await this.request<API.ResponseCommit[]>(
    //   `/api/v3/projects/${await this.getProjectId(repo)}/repository/commits`,
    //   {
    //     params: {
    //       ref_name: params.ref,
    //       path: params.path,
    //       page: params.page,
    //       per_page: params.pageSize,
    //     },
    //   }
    // );
    // return data.map((c) => ({
    //   id: c.id,
    //   parents: [],
    //   author: c.author_name,
    //   authorEmail: c.author_email,
    //   authorDate: c.created_at,
    //   committer: c.author_name,
    //   committerEmail: c.author_email,
    //   committerDate: c.created_at,
    //   message: c.message,
    //   title: c.title,
    // }));
    return [];
  }

  async getCommitDiff(repo: IRepositoryModel, sha: string) {
    const data = await this.request<API.ResponseCommitFileChange[]>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/commits/${sha}/diff`
    );

    return data.map((d) => ({
      oldFilePath: d.old_path,
      newFilePath: d.new_path,
      type: toType(d),
      ...toChangeLines(d.diff),
    }));
  }

  async getCommitCompare(repo: IRepositoryModel, from: string, to: string) {
    const data = await this.request<API.ResponseCommitFileChange[]>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/compare`,
      {
        params: { from, to },
      }
    );

    return data.map((d) => ({
      oldFilePath: d.old_path,
      newFilePath: d.new_path,
      type: toType(d),
      ...toChangeLines(d.diff),
    }));
  }
}
