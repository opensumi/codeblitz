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
  FileAction,
  FileActionHeader,
  FileActionResult,
  User,
} from '../common/types';
import { CodePlatform, CommitFileStatus } from '../common/types';
import { DEFAULT_SEARCH_IN_WORKSPACE_LIMIT } from '@opensumi/ide-search';

const toType = (t: number) => {
  switch (t) {
    case 1:
      return CommitFileStatus.Added;
    case 2:
      return CommitFileStatus.Modified;
    case 3:
      return CommitFileStatus.Deleted;
    case 4:
      return CommitFileStatus.Renamed;
    case 5:
      return CommitFileStatus.Added;
    default:
      return '';
  }
};

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
  async getUser(repo: IRepositoryModel) {
    const user = await this.request<API.User>(`/api/users/get_user_info.json`);
    return {
      id: user.user_id,
      name: user.login,
      email: user.email,
    };
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
    return `${this.config.origin}/repo/${this.getProjectPath(repo)}/${repo.commit}/${path}`;
    // return `${this.config.origin}/repo/${this.getProjectPath(repo)}/raw/branch/${ref}/${path}`;
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
    const branches = await this.getBranches(repo);
    const branch = branches.find((branch) => {
      return branch.name === ref;
    });
    if (branch) {
      return branch.commit.id;
    } else {
      throw new Error('[can not find branch]');
    }
  }

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
    const res = await this.request<API.ResponseFileContent>(
      `/api/v1/${this.getProjectPath(repo)}/git/blobs/${entry.sha}`
    );
    return new Uint8Array(Buffer.from(res.content, res.encoding));
  }

  async getBlobByCommitPath(repo: IRepositoryModel, commit: string, path: string) {
    const data = await this.request<API.ResponseGetSubTree>(
      `/api/${this.getProjectPath(repo)}/sub_entries.json`,
      {
        params: {
          filepath: path,
          ref: commit,
          type: 'file',
        },
      }
    );
    if (data.entries && typeof data.entries === 'object') {
      const sha = (data.entries as API.Entry).sha;
      const entry = {
        sha: sha,
      } as EntryParam;
      return await this.getBlob(repo, entry);
    } else {
      throw new Error('[can not find entries]');
    }
  }

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

  // TODO gitlink 暂时没有搜索内容接口
  async searchContent() {
    return [];
  }

  async searchFile(repo: IRepositoryModel, searchString: string, options: { limit: number }) {
    if (searchString === '') {
      const res = await this.request<API.files>(`/api/${this.getProjectPath(repo)}/files`, {
        params: {
          ref: repo.commit,
        },
      });
      // 默认做个限制，防止请求过多
      return res.map((r) => r.path).slice(0, DEFAULT_SEARCH_IN_WORKSPACE_LIMIT);
    }
    const reqRes = await this.request<API.files>(`/api/${this.getProjectPath(repo)}/files`, {
      params: {
        ref: repo.commit,
        limit: options.limit,
        search: searchString,
      },
    });
    return reqRes.map((r) => r.path).slice(0, DEFAULT_SEARCH_IN_WORKSPACE_LIMIT);
  }

  async getFileBlame(repo: IRepositoryModel, path: string) {
    const blames = await this.request<API.ResponseFileBlame>(
      `/api/v1/${this.getProjectPath(repo)}/blame?sha=${repo.commit}&filepath=${path}`,
      {
        responseType: 'json',
      }
    );
    const blameHash = {};
    const blamePart: API.gitlensBlame[] = [];

    blames.blame_parts.forEach((blame, index) => {
      const commit = blame.commit;
      if (blameHash[commit.sha]) {
        const bla = blamePart.find((b) => b.commit.id === blame.commit.sha) as API.gitlensBlame;
        bla.lines.push({
          current_number: blame.current_number,
          effect_line: blame.effect_line,
          previous_number: blame.previous_number,
        });
      } else {
        blameHash[commit.sha] = true;
        blamePart.push({
          commit: {
            id: commit.sha,
            author_name: commit.committer.name,
            // gitlink 接口无email信息
            author_email: commit.author.email || 'no_email',
            authored_date: commit.authored_time * 1000,
            committed_date: commit.committed_time * 1000,
            message: commit.commit_message.replace(/\n/, ''),
            author: {
              // gitlink 增加路径
              avatar_url: this.config.endpoint.endsWith('/')
                ? this.config.endpoint + commit.committer.image_url
                : this.config.endpoint + '/' + commit.committer.image_url,
            },
          },
          lines: [
            {
              current_number: blame.current_number,
              effect_line: blame.effect_line,
              previous_number: blame.previous_number,
            },
          ],
        });
      }
    });
    return new TextEncoder().encode(JSON.stringify(blamePart));
  }

  async getCommits(repo: IRepositoryModel, params: CommitParams) {
    const data = await this.request<API.ResponseGetCommits>(
      `/api/v1/${this.getProjectPath(repo)}/commits.json`,
      {
        params: {
          sha: params.ref,
          page: params.page,
          limit: params.pageSize,
        },
      }
    );
    if (data.commits) {
      // TODO 缺少 email信息
      return data.commits.map((c) => ({
        id: c.sha,
        parents: c.parent_shas,
        author: c.author.name,
        authorEmail: '',
        authorDate: c.commit_time,
        committer: c.committer.name,
        committerEmail: '',
        committerDate: c.commit_time,
        message: c.commit_message,
        title: c.commit_message,
      }));
    }
    return [];
  }

  async getCommitDiff(repo: IRepositoryModel, sha: string) {
    const data = await this.request<API.ResponseCommitFileChangeData>(
      `/api/v1/${this.getProjectPath(repo)}/commits/${sha}/diff`
    );
    return data.files.map((d) => ({
      oldFilePath: d.oldname,
      newFilePath: d.name,
      type: toType(d.type) as CommitFileStatus,
      additions: d.addition,
      deletions: d.deletion,
    }));
  }

  async getCommitCompare(repo: IRepositoryModel, from: string, to: string) {
    return [];
  }

  async bulkChangeFiles(repo: IRepositoryModel, actions: FileAction[], header: FileActionHeader) {
    const files = actions.map((action) => {
      return {
        ...action,
        encoding: 'text',
      };
    });
    const res = (await this.request(`/api/v1/${this.getProjectPath(repo)}/contents/batch`, {
      data: {
        files: files,
        branch: header.branch,
        message: header.commit_message,
        commit_email: header.author_email,
        commit_name: header.author_name,
      },
      method: 'post',
    })) as API.ResponsePush;

    if (res.contents) {
      return res.contents.map((content) => {
        return {
          ...content,
          commit_id: res.commit.sha,
        };
      });
    }
    return [];
  }

  async getFiles(repo: IRepositoryModel): Promise<string[]> {
    const files = await this.request<API.files>(`/api/${this.getProjectPath(repo)}/files`, {
      params: {
        ref: repo.commit,
      },
    });
    return files.map((file) => {
      return file.path;
    });
  }

  async createBranch(repo: IRepositoryModel, newBranch: string): Promise<any> {
    return this.request<API.BranchOrTag>(`/api/v1/${this.getProjectPath(repo)}/branches.json`, {
      data: {
        new_branch_name: newBranch,
        old_branch_name: repo.commit,
      },
      method: 'post',
    });
  }
}
