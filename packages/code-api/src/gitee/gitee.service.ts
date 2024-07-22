import { request, RequestOptions } from '@codeblitzjs/ide-common';
import { Autowired, Injectable } from '@opensumi/di';
import { isObject, MessageType, URI } from '@opensumi/ide-core-common';
import { CodePlatformRegistry, HelperService } from '../common';
import {
  Branch,
  BranchOrTag,
  CodeAPI,
  CodePlatform,
  CommitFileChange,
  CommitFileStatus,
  CommitParams,
  CommitRecord,
  EntryInfo,
  EntryParam,
  FileAction,
  FileActionHeader,
  FileActionResult,
  GitlensBlame,
  ICodeAPIService,
  IRepositoryModel,
  ISearchResults,
  Project,
  TreeEntry,
} from '../common/types';
import { API } from './types';

const toType = (d: API.ResponseCommitFileChange) => {
  switch (d.status) {
    case 'modified':
      return CommitFileStatus.Modified;
    case 'removed':
      return CommitFileStatus.Deleted;
    case 'added':
      return CommitFileStatus.Added;
    default:
      return CommitFileStatus.Modified;
  }
};

@Injectable()
export class GiteeAPIService implements ICodeAPIService {
  @Autowired(HelperService)
  helper: HelperService;

  private config = CodePlatformRegistry.instance().getPlatformConfig(CodePlatform.gitee);

  private _PRIVATE_TOKEN: string | null;

  private treeMap = new Map<string, string[]>();

  private redirectUrl = this.config.redirectUrl;

  private client_id = '';

  get PRIVATE_TOKEN() {
    if (!this._PRIVATE_TOKEN) {
      this._PRIVATE_TOKEN = this.helper.GITEE_TOKEN;
    }
    return this._PRIVATE_TOKEN;
  }

  constructor() {
    this._PRIVATE_TOKEN = this.config.token || this.helper.GITEE_TOKEN || '';
  }

  getEntryInfo?(repo: IRepositoryModel, entry: EntryParam): Promise<EntryInfo> {
    throw new Error('Method not implemented.');
  }
  getBranchNames?(repo: IRepositoryModel): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  canResolveConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    prId: string,
  ): Promise<CodeAPI.CanResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  resolveConflict(
    repo: IRepositoryModel,
    content: CodeAPI.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string | undefined,
  ): Promise<CodeAPI.ResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  getConflict(repo: IRepositoryModel, sourceBranch: string, targetBranch: string): Promise<CodeAPI.ConflictResponse> {
    throw new Error('Method not implemented.');
  }
  mergeBase(repo: IRepositoryModel, target: string, source: string): Promise<CodeAPI.ResponseCommit> {
    throw new Error('Method not implemented.');
  }
  createPullRequest(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    autoMerge?: boolean | undefined,
  ): Promise<CodeAPI.ResponseCreatePR> {
    throw new Error('Method not implemented.');
  }

  private async checkAccessToken(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      resolve(true);
    });
  }

  public async available(): Promise<boolean> {
    const token = this.PRIVATE_TOKEN;
    if (!token) {
      return await this.checkAccessToken();
    }
    return true;
  }

  protected async request<T>(
    path: string,
    options?: RequestOptions,
    responseOptions?: API.RequestResponseOptions,
  ): Promise<T> {
    try {
      const { headers, ...rest } = options || {};
      const privateToken = this.PRIVATE_TOKEN;
      return await request(path, {
        baseURL: options?.baseURL ?? this.config.endpoint,
        responseType: 'json',
        ...rest,
        params: {
          ...rest?.params,
        },
        headers: {
          Authorization: `Bearer ${privateToken}`,
          ...headers,
        },
      });
    } catch (err: any) {
      const status = err.response?.status;
      let messageKey = 'error.request';

      if (responseOptions?.errorOption === false) {
        console.log(err);
        return undefined as any;
      }

      if (status === 401 || !this.PRIVATE_TOKEN) {
        messageKey = 'gitee.unauthorized';
        // 401 的情况再登陆一次
        await this.checkAccessToken();
      } else if (status === 404) {
        messageKey = 'error.resource-not-found';
      }

      this.helper.showMessage(CodePlatform.gitee, {
        type: MessageType.Error,
        status: status,
        symbol: err?.message ? '' : messageKey,
        message: err?.message,
      });

      throw err;
    }
  }

  private getProjectPath(repo: IRepositoryModel, encode?: boolean) {
    if (encode) {
      return encodeURIComponent(`${repo.owner}/${repo.name}`);
    }
    return `${repo.owner}/${repo.name}`;
  }

  async getCommit(repo: IRepositoryModel, ref: string): Promise<string> {
    const commitInfo = await this.request<API.ResponseCommit>(
      `/api/v5/repos/${this.getProjectPath(repo)}/commits/${encodeURIComponent(ref)}`,
    );
    return commitInfo.sha;
  }
  async getTree(repo: IRepositoryModel, path: string): Promise<TreeEntry[]> {
    const res = await this.request<API.ResponseFileTreeObject>(
      `/api/v5/repos/${this.getProjectPath(repo)}/git/trees/${repo.commit}`,
      {
        params: {
          recursive: 1,
          // file_path: path,
        },
      },
    );

    return Array.isArray(res.tree)
      ? res.tree.map((data) => {
        const name = URI.parse(data.path).displayName;
        return {
          ...data,
          name,
        } as TreeEntry;
      })
      : [];
  }
  async getBlob(repo: IRepositoryModel, entry: EntryParam): Promise<Uint8Array> {
    const { path } = entry;
    const { ref, commit } = repo;
    const res = await this.request<API.ResponseContentBlob>(
      `/api/v5/repos/${this.getProjectPath(repo)}/contents/${path}`,
      {
        params: {
          ref: ref || commit,
        },
      },
    );

    const { content, encoding, type } = res;

    if (type !== 'file') {
      throw new Error(`${path} is not a file.`);
    }

    if (encoding === 'base64') {
      return Buffer.from(decodeURIComponent(escape(atob(content))));
    }
    return Buffer.from(content || '');
  }
  async getBlobByCommitPath(
    repo: IRepositoryModel,
    commit: string,
    path: string,
  ): Promise<Uint8Array> {
    const res = await this.request<API.ResponseContentBlob>(
      `/api/v5/repos/${this.getProjectPath(repo)}/contents/${path}`,
      {
        params: {
          ref: commit,
        },
      },
    );

    const { content, encoding, type } = res;

    if (type !== 'file') {
      throw new Error(`${path} is not a file.`);
    }

    if (encoding === 'base64') {
      return Buffer.from(decodeURIComponent(escape(atob(content))));
    }
    return Buffer.from(content || '');
  }
  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    if (!this.PRIVATE_TOKEN) {
      return [];
    }

    const branches = await this.request<API.ResponseBranchesInfo[]>(
      `/api/v5/repos/${this.getProjectPath(repo)}/branches`,
    );
    if (!Array.isArray(branches)) {
      throw new Error('[can not find branch list]');
    }

    return branches.map((data) => ({
      name: data.name,
      commit: {
        id: data.commit.sha,
      },
      protected: data.protected,
    }));
  }
  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    if (!this.PRIVATE_TOKEN) {
      return [];
    }

    const tags = await this.request<API.ResponseBranchesInfo[]>(
      `/api/v5/repos/${this.getProjectPath(repo)}/tags`,
    );
    if (!Array.isArray(tags)) {
      throw new Error('[can not find tag list]');
    }

    return tags.map((data) => ({
      name: data.name,
      commit: {
        id: data.commit.sha,
      },
      protected: data.protected,
    }));
  }
  transformStaticResource(repo: IRepositoryModel, path: string) {
    return `${this.config.origin}/${repo.owner}/${repo.name}/raw/${repo.commit}/${path}`;
  }

  // TODO 搜索功能
  async searchContent(
    repo: IRepositoryModel,
    searchString: string,
    options: { limit: number },
  ): Promise<ISearchResults> {
    return [];
  }

  // TODO 搜索文件功能 展示所有文件
  async searchFile(
    repo: IRepositoryModel,
    searchString: string,
    options: { limit?: number | undefined },
  ): Promise<string[]> {
    const key = `${repo.owner}-${repo.name}-${repo.commit}`;
    if (!this.treeMap.has(key)) {
      this.treeMap.set(key, await this.getFiles(repo));
    }
    return this.treeMap.get(key)!;
  }
  // TODO blame
  async getFileBlame(repo: IRepositoryModel, filepath: string): Promise<Uint8Array> {
    return Uint8Array.from([]);

    // return new Uint8Array(
    //   await this.request(
    //     `/api/v5/repos/${this.getProjectPath(repo)}/blame/${filepath}`,
    //     {
    //       responseType: 'arrayBuffer',
    //       params: {
    //         ref: repo.commit,
    //       },
    //     },
    //     {
    //       errorOption: false,
    //     }
    //   )
    // );
  }
  async getCommits(repo: IRepositoryModel, params: CommitParams): Promise<CommitRecord[]> {
    const data = await this.request<API.ResponseCommit[]>(
      `/api/v5/repos/${this.getProjectPath(repo)}/commits`,
      {
        params: {
          sha: params.ref,
          // path: params.path,
          page: params.page,
          per_page: params.pageSize,
        },
      },
    );
    return data.map((c) => ({
      id: c.sha,
      parents: c.parents.map((p) => p.sha),
      author: c.commit.author.name,
      authorEmail: c.commit.author.email,
      authorDate: c.commit.author.date,
      committer: c.commit.committer.name,
      committerEmail: c.commit.committer.email,
      committerDate: c.commit.committer.date,
      message: c.commit.message,
      title: c.commit.message,
    }));
  }
  async getCommitDiff(repo: IRepositoryModel, sha: string): Promise<CommitFileChange[]> {
    const data = await this.request<API.ResponseCommit>(
      `/api/v5/repos/${this.getProjectPath(repo)}/commits/${sha}`,
    );
    return data.files.map((d) => ({
      oldFilePath: d.filename,
      newFilePath: d.filename,
      type: toType(d),
      additions: d.additions,
      deletions: d.deletions,
      changes: d.changes,
    }));
  }
  async getCommitCompare(
    repo: IRepositoryModel,
    from: string,
    to: string,
  ): Promise<CommitFileChange[]> {
    const data = await this.request<API.ResponseCommitCompare>(
      `/api/v5/repos/${this.getProjectPath(repo)}/compare/${from}...${to}`,
    );
    return (data.files || []).map((d) => ({
      oldFilePath: d.filename,
      newFilePath: d.filename,
      type: toType(d),
      additions: d.additions,
      deletions: d.deletions,
      changes: d.changes,
    }));
  }
  async getFiles(repo: IRepositoryModel): Promise<string[]> {
    const res = await this.request<API.ResponseFileTreeObject>(
      `/api/v5/repos/${this.getProjectPath(repo)}/git/trees/${repo.commit}`,
      {
        params: {
          recursive: 1,
        },
      },
    );
    return res.tree.map((t) => t.path);
  }

  async bulkChangeFiles(repo: IRepositoryModel, actions: FileAction[], header: FileActionHeader) {
    const actionResult = await this.request<API.FileActionResult>(
      `/api/v5/repos/${this.getProjectPath(repo)}/commits`,
      {
        data: {
          actions: actions.map((action) => ({
            path: action.file_path,
            content: action.content,
            action: action.action_type.toLowerCase(),
            encoding: 'text',
          })),
          start_branch: header.start_branch,
          branch: header.branch,
          message: header.commit_message,
          author: {
            name: header.author_name,
            email: header.author_email,
          },
        },
        method: 'post',
      },
    );

    let branchCreated = header.start_branch === header.branch ? false : true;
    let branch = header.branch;

    return actionResult.files.map((d) => {
      return {
        branch_created: branchCreated,
        branch: branch,
        commit_id: actionResult.sha,
        file_name: d.filename,
      } as FileActionResult;
    });
  }
  async createBranch(repo: IRepositoryModel, newBranch: string, ref: string): Promise<Branch> {
    const res = await this.request<API.ResponseBranch>(
      `/api/v5/repos/${this.getProjectPath(repo)}/branches`,
      {
        method: 'post',
        data: {
          branch_name: newBranch,
          refs: ref,
        },
      },
    );
    return {
      name: res.name,
      commit: {
        id: res.commit.sha,
        message: res.commit.commit.message,
      },
      protected: res.protected,
    } as unknown as Branch;
  }
  getUser(repo: IRepositoryModel): Promise<any> {
    return {} as any;
  }

  public async getProject(repo: IRepositoryModel): Promise<Project> {
    const repoInfo = await this.request<API.ResponseRepoInfo>(
      `/api/v5/repos/${this.getProjectPath(repo)}`,
    );
    return {
      id: repoInfo.full_name,
      default_branch: repoInfo.default_branch,
    };
  }

  clearToken() {
    this._PRIVATE_TOKEN = null;
    this.helper.ATOMGIT_TOKEN = null;
  }
}
