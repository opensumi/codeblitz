import { Injectable, Autowired } from '@opensumi/di';
import { localize, IReporterService, formatLocalize, MessageType } from '@opensumi/ide-core-common';
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
  Branch,
  Project,
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
/*
 *  为保证生产测试一致 暂时使用的是gitlink的生产区接口 https://www.gitlink.org.cn/docs/api
 *  TODO 待后续测试区接口上线  https://testgitea2.trustie.net/api/swagger#/
 */

@Injectable()
export class GitLinkAPIService implements ICodeAPIService {
  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired()
  helper: HelperService;

  private config = CODE_PLATFORM_CONFIG[CodePlatform.gitlink];

  private _PRIVATE_TOKEN: string | null;

  shouldShowView = false;

  get PRIVATE_TOKEN() {
    return this._PRIVATE_TOKEN;
  }

  constructor() {
    this._PRIVATE_TOKEN = this.config.token || '';
  }
  getUser(repo: IRepositoryModel): Promise<Branch> {
    throw new Error('Method not implemented.');
  }

  async available() {
    return true;
  }

  private showErrorMessage(symbol: string, message?: string, status?: number) {
    this.helper.showMessage(CodePlatform.gitlink, {
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

  // TODO 静态资源路径  gitlink 静态资源好像无法用commit获取
  transformStaticResource(repo: IRepositoryModel, path: string) {
    return `${this.config.origin}/repo/${this.getProjectPath(repo)}/raw/${repo.commit}/${path}`;
  }

  protected async request<T>(path: string, options?: RequestOptions): Promise<T> {
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
        messageKey = 'gitlink.unauthorized';
      } else if (status === 404) {
        messageKey = 'error.resource-not-found';
      }
      this.showErrorMessage(messageKey, status);
      throw err;
    }
  }

  async getProject(repo: IRepositoryModel) {
    const data = await this.request<API.Project>(`/api/${this.getProjectPath(repo)}/detail.json`);
    if (!data?.identifier) {
      const message = formatLocalize('api.response.project-not-found', this.getProjectPath(repo));
      this.showErrorMessage('', message, 404);
      throw new Error(message);
    }
    return {
      ...data,
      id: data.identifier,
    };
  }

  async getCommit(repo: IRepositoryModel, ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/${this.getProjectPath(repo)}/commits/${encodeURIComponent(ref)}`
      )
    ).commit.sha;
  }

  // getTree getBlob getBlobByCommitPath 暂时都使用同一接口
  async getTree(repo: IRepositoryModel, path: string) {
    const data = await this.request<API.ResponseGetTree>(
      `/api/${this.getProjectPath(repo)}/sub_entries.json`,
      {
        params: {
          ref: repo.commit,
          filepath: path,
          type: 'dir',
        },
      }
    );
    if (data.entries) {
      return data.entries.map<TreeEntry>((item) => {
        const entry: TreeEntry = {
          ...item,
          // gitlink 文件类型暂时只有 dir 和 file
          type: item.type === 'dir' ? 'tree' : 'blob',
        };
        return entry;
      });
    } else {
      throw new Error('[can not find entries]');
    }
  }

  async getBlob(repo: IRepositoryModel, entry: EntryParam) {
    const buf = await this.request<API.ResponseGetSubTree>(
      `/api/${this.getProjectPath(repo)}/sub_entries.json`,
      {
        params: {
          filepath: entry.path,
          ref: repo.commit,
          type: 'file',
        },
      }
    );
    let content = (buf.entries as API.Entry).content;
    return Buffer.from(content);
  }

  async getBlobByCommitPath(repo: IRepositoryModel, commit: string, path: string) {
    const buf = await this.request<API.ResponseGetSubTree>(
      `/api/${this.getProjectPath(repo)}/sub_entries.json`,
      {
        params: {
          filepath: path,
          ref: commit,
          type: 'file',
        },
      }
    );
    let content = (buf.entries as API.Entry).content;
    return Buffer.from(content);
  }

  // 此处应该使用后续的api/v1 里的branch接口
  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    const branchSlice = await this.request<API.BranchSlice>(
      `/api/${this.getProjectPath(repo)}/branches_slice.json`
    );
    const branches: BranchOrTag[] = [];
    branchSlice.forEach((slices) => {
      slices.list.forEach((branch) => {
        branches.push({
          commit: {
            id: branch.last_commit.sha,
          },
          name: branch.name,
        });
      });
    });
    return branches;
  }

  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    const tags = await this.request<API.ResponseGetRefs>(
      `/api/${this.getProjectPath(repo)}/tags.json`
    );
    return tags.map((tag) => ({
      commit: {
        id: tag.id,
      },
      name: tag.name,
    }));
  }

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

  async getCommits(repo: IRepositoryModel, params: CommitParams) {
    return [];
  }

  async getCommitDiff(repo: IRepositoryModel, sha: string) {
    return [];
  }

  async getCommitCompare(repo: IRepositoryModel, from: string, to: string) {
    return [];
  }

  async bulkChangeFiles() {
    return [];
  }

  async getFiles(repo: IRepositoryModel): Promise<string[]> {
    return await this.request(`/api/v1/repos/${this.getProjectPath(repo)}/contents`, {
      params: {
        ref: repo.commit,
      },
    });
  }
  createBranch(repo: IRepositoryModel, newBranch: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}