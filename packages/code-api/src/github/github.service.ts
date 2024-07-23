import { isResponseError, request, RequestOptions } from '@codeblitzjs/ide-common';
import { Autowired, Injectable } from '@opensumi/di';
import { AppConfig } from '@opensumi/ide-core-browser';
import { localize, MessageType } from '@opensumi/ide-core-common';
import { CommandService } from '@opensumi/ide-core-common';
import { observable } from 'mobx';
import { CodePlatformRegistry } from '../common/config';
import { HelperService } from '../common/service';
import {
  Branch,
  BranchOrTag,
  CommitFileChange,
  CommitParams,
  EntryInfo,
  FileAction,
  FileActionHeader,
  FileActionType,
  FileOperateResult,
  ICodeAPIService,
  Project,
  TreeEntry,
  User,
} from '../common/types';
import type { EntryParam, IRepositoryModel } from '../common/types';
import { CodeAPI as ConflictAPI, CodePlatform, CommitFileStatus } from '../common/types';
import { retry, RetryError } from '../common/utils';
import { API } from './types';

const toType = (status: string) => {
  switch (status) {
    case 'added':
      return CommitFileStatus.Added;
    case 'deleted':
      return CommitFileStatus.Deleted;
    case 'renamed':
      return CommitFileStatus.Renamed;
    case 'modified':
      return CommitFileStatus.Modified;
    default:
      return CommitFileStatus.Modified;
  }
};

@Injectable()
export class GitHubAPIService implements ICodeAPIService {
  @Autowired(HelperService)
  private readonly helper: HelperService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(CommandService)
  commandService: CommandService;

  private config = CodePlatformRegistry.instance().getPlatformConfig(CodePlatform.github);

  /** 资源限制信息 */
  @observable
  public resources: API.ResponseGetRateLimit['resources'] = {
    core: { limit: 0, remaining: 0, reset: 0, used: 0 },
    graphql: { limit: 0, remaining: 0, reset: 0, used: 0 },
    integration_manifest: { limit: 0, remaining: 0, reset: 0, used: 0 },
    search: { limit: 0, remaining: 0, reset: 0, used: 0 },
  };

  private _requestType: 'rest' | 'graphql' = 'rest';

  private _OAUTH_TOKEN: string | null;

  private recursiveTreeMap = new Map<string, Promise<string[]>>();

  get OAUTH_TOKEN() {
    return this._OAUTH_TOKEN;
  }

  constructor() {
    this._OAUTH_TOKEN = this.config.token || this.helper.GITHUB_TOKEN;
  }
  createPullRequest(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    autoMerge?: boolean | undefined,
  ): Promise<ConflictAPI.ResponseCreatePR> {
    throw new Error('Method not implemented.');
  }
  mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string,
  ): Promise<ConflictAPI.ResponseCommit> {
    throw new Error('Method not implemented.');
  }
  getEntryInfo?(repo: IRepositoryModel, entry: EntryParam): Promise<EntryInfo> {
    throw new Error('Method not implemented.');
  }
  getBranchNames?(repo: IRepositoryModel): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  canResolveConflict(
    repo: IRepositoryModel,
    prId: string,
  ): Promise<ConflictAPI.CanResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  resolveConflict(): Promise<ConflictAPI.ResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  getConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
  ): Promise<ConflictAPI.ConflictResponse> {
    throw new Error('Method not implemented.');
  }
  async getProject(repo: IRepositoryModel): Promise<Project> {
    const data = await this.requestByREST<Project>(`/repos/${this.getProjectPath(repo)}`, {
      responseType: 'json',
    });
    return data;
  }
  async getUser(repo: IRepositoryModel): Promise<User> {
    const user = await this.requestByREST<API.ResponseUser>('/user', {
      responseType: 'json',
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  async createBranch(repo: IRepositoryModel, newBranch: string, ref: string): Promise<Branch> {
    const data = await this.rest.createReference(repo, newBranch, ref);

    return {
      name: newBranch,
      ref: data.ref,
      commit: {
        id: data.object.sha,
      },
    };
  }
  async available() {
    const token = this._OAUTH_TOKEN;
    await this.getRateLimit(token);
    if (!this.canRequest) {
      this.helper.revealView(CodePlatform.github);
      this.showErrorRequestMessage(403, false);
      return false;
    }
    if (token) {
      if (this.resources.core.remaining) {
        this._requestType = 'rest';
      } else if (this.resources.graphql.remaining) {
        this._requestType = 'graphql';
      }
    }
    return true;
  }

  get canRequest() {
    return this.resources.core.remaining > 0 || this.resources.graphql.remaining > 0;
  }

  private getProjectPath(project: IRepositoryModel) {
    return `${project.owner}/${project.name}`;
  }

  transformStaticResource(repo: IRepositoryModel, path: string) {
    return `https://raw.githubusercontent.com/${this.getProjectPath(repo)}/${repo.commit}/${path}`;
  }

  private showErrorRequestMessage(status: number): never;
  private showErrorRequestMessage(status: number, throwError: false): void;
  private showErrorRequestMessage(status: number, throwError?: boolean): any {
    let messageKey = 'error.request';
    if (status === 401) {
      messageKey = 'github.invalid-token';
    } else if (status === 403) {
      messageKey = 'github.request-rate-limit';
    } else if (status === 404) {
      messageKey = 'github.resource-not-found';
    }
    const message = `${status ? `${status} - ` : ''}${localize(messageKey)}`;
    this.helper.showMessage(CodePlatform.github, { type: MessageType.Error, status, message });

    if (throwError !== false) {
      throw new Error(message);
    }
  }

  protected async request(path: string, options?: RequestOptions): Promise<Response> {
    const { responseType, headers, ...rest } = options || {};

    const token = this.OAUTH_TOKEN;
    const response = await request<Response>(path, {
      headers: {
        ...(token
          ? {
            Authorization: `token ${token}`,
          }
          : {}),
        Accept: 'application/vnd.github.v3+json',
        ...headers,
      },
      ...rest,
    });

    return response;
  }

  private async requestByREST<T = any>(path: string, options?: RequestOptions): Promise<T> {
    const { responseType, ...rest } = options || {};
    try {
      const response = await this.request(path, {
        baseURL: this.config.endpoint,
        ...rest,
      });
      return responseType ? response[responseType]() : response;
    } catch (err: unknown) {
      if (isResponseError(err)) {
        // 403 时切换为 graphql
        const { status } = err.response;
        if (status === 403 && this.resources.graphql.remaining > 0) {
          this.helper.showMessage(CodePlatform.github, {
            type: MessageType.Info,
            symbol: 'github.toggle-graphql',
          });
          this._requestType = 'graphql';
          throw new RetryError();
        }
        this.showErrorRequestMessage(status);
      }
      this.showErrorRequestMessage(0);
    }
  }

  private async requestGraphQL<T = any>(options?: RequestOptions): Promise<T> {
    const endpoint = 'https://api.github.com/graphql';
    try {
      const response = await this.request(endpoint, {
        method: 'post',
        ...options,
      });
      const data: { data: any; errors?: any } = (await response.json()) || {};
      if (data.errors) {
        throw Error(`Graphql Error\n${data.errors.map((item) => item.message).join('\n')}`);
      }
      return data.data;
    } catch (err: any) {
      this.showErrorRequestMessage(err?.response?.status, false);
      throw err;
    }
  }

  async requestObject(
    repo: IRepositoryModel,
    type: 'Commit' | 'Tree' | 'Blob',
    query: string,
    expression: string,
  ) {
    const data = await this.requestGraphQL({
      data: {
        query: `
          query($owner: String!, $name: String!, $expression: String!) {
            repository(name: $name, owner: $owner) {
              object(expression: $expression) {
                ... on ${type} {
                  ${query}
                }
              }
            }
          }
        `,
        variables: {
          owner: repo.owner,
          name: repo.name,
          expression,
        },
      },
    });
    return data.repository.object;
  }

  async getRateLimit(token?: string | null) {
    try {
      const response = await this.request('/rate_limit', {
        baseURL: this.config.endpoint,
        ...(token
          ? {
            headers: {
              Authorization: `token ${token}`,
            },
          }
          : {}),
      });
      const data: API.ResponseGetRateLimit = await response.json();
      if (data?.resources) {
        this.resources = data.resources;
      }
    } catch (err: unknown) {
      if (isResponseError(err)) {
        if (err.response.status === 401) {
          this._OAUTH_TOKEN = null;
          this.showErrorRequestMessage(401);
        }
      }
      this.showErrorRequestMessage(0);
    }
  }

  async validateToken(token: string) {
    await this.getRateLimit(token);
    if (this.canRequest) {
      this._OAUTH_TOKEN = token;
      this.helper.GITHUB_TOKEN = token;
      this.helper.reinitializeCodeService();
      this.helper.revealView('explorer');
    } else {
      this.helper.showMessage(CodePlatform.github, {
        type: MessageType.Error,
        symbol: 'request-rate-limit-with-token',
      });
    }
  }

  clearToken() {
    this._OAUTH_TOKEN = null;
    this.helper.GITHUB_TOKEN = null;
    this.getRateLimit(null);
  }

  refresh() {
    return this.getRateLimit(this.OAUTH_TOKEN);
  }

  private rest = {
    getCommit: async (repo: IRepositoryModel, ref: string) => {
      return this.requestByREST<string>(`/repos/${this.getProjectPath(repo)}/commits/${ref}`, {
        headers: {
          Accept: 'application/vnd.github.v3.sha',
        },
        responseType: 'text',
      });
    },

    createTree: async (
      repo: IRepositoryModel,
      trees: API.RequestCreateTree[],
      base_tree?: string,
    ) => {
      const data = await this.requestByREST<API.ResponseGetTree>(
        `/repos/${this.getProjectPath(repo)}/git/trees`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
          responseType: 'json',
          method: 'post',
          data: {
            base_tree,
            tree: trees,
          },
        },
      );

      return data;
    },

    getTree: async (repo: IRepositoryModel, path: string) => {
      const data = await this.requestByREST<API.ResponseGetTree>(
        `/repos/${this.getProjectPath(repo)}/git/trees/${repo.commit}:${path}`,
        {
          responseType: 'json',
        },
      );
      return data.tree.map((item) => {
        const entry: TreeEntry = {
          ...item,
          name: item.path,
          path: `${path ? `${path}/` : ''}${item.path}`,
          id: item.sha,
        };
        return entry;
      });
    },

    getRecursiveTree: async (repo: IRepositoryModel) => {
      const data = await this.requestByREST<API.ResponseGetTree>(
        `/repos/${this.getProjectPath(repo)}/git/trees/${repo.commit}:`,
        {
          responseType: 'json',
          params: {
            recursive: 1,
          },
        },
      );
      return data.tree.filter((item) => item.type === 'blob').map((item) => item.path);
    },

    createBlob: async (
      repo: IRepositoryModel,
      blob: { content: string; encoding?: 'utf-8' | 'base64' },
    ) => {
      const data = await this.requestByREST<API.ResponseCreateBlob>(
        `/repos/${this.getProjectPath(repo)}/git/blobs`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
          responseType: 'json',
          method: 'post',
          data: {
            content: blob.content,
            encoding: blob.encoding || 'utf-8',
          },
        },
      );

      return data;
    },

    getBlob: async (repo: IRepositoryModel, entry: EntryParam) => {
      const buf = await this.requestByREST<ArrayBuffer>(
        `/repos/${this.getProjectPath(repo)}/git/blobs/${entry.id}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
          responseType: 'arrayBuffer',
        },
      );
      return Buffer.from(buf);
    },

    getBlobByCommitPath: async (
      repo: IRepositoryModel,
      commit: string,
      path: string,
    ): Promise<Uint8Array> => {
      const data = await this.requestByREST<API.ResponseBlobCommitPath>(
        `/repos/${this.getProjectPath(repo)}/contents/${path}?ref=${commit}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.json',
          },
          responseType: 'json',
        },
      );
      // Buffer toJSON 为 { type: 'Buffer', data: [] }，通过 rpc 传输后无法自动恢复，ArrayBufferView 额外处理了，可以恢复
      return new Uint8Array(Buffer.from(data.content, data.encoding));
    },

    createReference: async (repo: IRepositoryModel, ref: string, sha: string) => {
      const data = await this.requestByREST<API.ResponseReference>(
        `/repos/${this.getProjectPath(repo)}/git/refs`,
        {
          responseType: 'json',
          method: 'post',
          data: {
            ref: `refs/heads/${ref}`,
            sha,
          },
        },
      );

      return data;
    },

    updateReference: async (
      repo: IRepositoryModel,
      ref: string,
      sha: string,
      force: boolean = false,
    ) => {
      // 去掉开头的 refs/
      ref = ref.replace(/^refs\//, '');
      ref = ref.startsWith('heads') ? ref : `heads/${ref}`;

      const data = await this.requestByREST<API.ResponseReference>(
        `/repos/${this.getProjectPath(repo)}/git/refs/${ref}`,
        {
          responseType: 'json',
          method: 'post',
          data: {
            sha,
            force,
          },
        },
      );

      return data;
    },

    getReference: async (repo: IRepositoryModel, ref: string) => {
      const data = await this.requestByREST<API.ResponseReference>(
        `/repos/${this.getProjectPath(repo)}/git/ref/${ref}`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          responseType: 'json',
          method: 'get',
        },
      );

      return data;
    },

    getBranches: async (repo: IRepositoryModel): Promise<BranchOrTag[]> => {
      let data = await this.requestByREST<API.ResponseMatchingRefs>(
        `/repos/${this.getProjectPath(repo)}/git/matching-refs/heads`,
        {
          responseType: 'json',
        },
      );
      return data.map((item) => ({
        name: item.ref.slice(11),
        commit: {
          id: item.object.sha,
        },
      }));
    },

    getTags: async (repo: IRepositoryModel): Promise<BranchOrTag[]> => {
      // TODO: 只获取 200 条数据
      // 这里不用 matching ref 是因为 tags 返回的 sha 是 tag 本身的 sha，而不是 commit sha，和预期不符
      let data = await this.requestByREST<API.ResponseGetRefs>(
        `/repos/${this.getProjectPath(repo)}/tags`,
        {
          responseType: 'json',
          params: {
            per_page: 100,
          },
        },
      );
      if (data.length === 100) {
        data = data.concat(
          await this.requestByREST<API.ResponseGetRefs>(
            `/repos/${this.getProjectPath(repo)}/tags`,
            {
              responseType: 'json',
              params: {
                per_page: 100,
                page: 2,
              },
            },
          ),
        );
      }
      return data.map((item) => ({
        name: item.name,
        commit: {
          id: item.commit.sha,
        },
      }));
    },

    getCommits: async (repo: IRepositoryModel, params: CommitParams) => {
      const data = await this.requestByREST<API.ResponseCommit[]>(
        `/repos/${this.getProjectPath(repo)}/commits`,
        {
          responseType: 'json',
          params: {
            sha: params.ref,
            path: params.path,
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
        committerEmail: c.commit.committer.name,
        committerDate: c.commit.committer.name,
        message: c.commit.message,
      }));
    },

    getCommitDiff: async (repo: IRepositoryModel, sha: string): Promise<CommitFileChange[]> => {
      const data = await this.requestByREST<API.ResponseCommitDetail>(
        `/repos/${this.getProjectPath(repo)}/commits/${sha}`,
        {
          responseType: 'json',
        },
      );

      return data.files.map((f) => ({
        oldFilePath: f.previous_filename || f.filename,
        newFilePath: f.filename,
        type: toType(f.status),
        additions: f.additions,
        deletions: f.deletions,
      }));
    },

    getCommitCompare: async (
      repo: IRepositoryModel,
      from: string,
      to: string,
    ): Promise<CommitFileChange[]> => {
      const data = await this.requestByREST<API.ResponseCommitDetail>(
        `/repos/${this.getProjectPath(repo)}/compare/${from}...${to}`,
        {
          responseType: 'json',
        },
      );

      return data.files.map((f) => ({
        oldFilePath: f.previous_filename || f.filename,
        newFilePath: f.filename,
        type: toType(f.status),
        additions: f.additions,
        deletions: f.deletions,
      }));
    },
  };

  private graphql = {
    getCommit: async (repo: IRepositoryModel, ref: string) => {
      return (await this.requestObject(repo, 'Commit', `oid`, ref)).oid;
    },

    getTree: async (repo: IRepositoryModel, path: string) => {
      const data = await this.requestObject(
        repo,
        'Tree',
        `
          entries {
            type
            mode
            path
            name
            sha: oid
            object {
              ... on Blob {
                byteSize,
                isBinary
              }
            }
          }
        `,
        `${repo.commit}:${path}`,
      );
      return data.entries.map((item: any) => {
        const entry: TreeEntry = {
          id: item.sha,
          path: item.path,
          name: item.name,
          type: item.type,
          mode: item.mode,
          size: item.object?.size,
          fileType: item.object?.isBinary ? 'binary' : 'text',
        };
        return entry;
      });
    },

    getBlob: async (repo: IRepositoryModel, entry: EntryParam) => {
      const data = await this.requestObject(
        repo,
        'Blob',
        `
          isBinary
          text
        `,
        `${repo.commit}:${entry.path}`,
      );
      const text = data.text || '';
      return Buffer.from(text);
    },

    getRefs: async (repo: IRepositoryModel, type: 'branches' | 'tags'): Promise<BranchOrTag[]> => {
      const genQuery = (endCursor?: string) => {
        const map = {
          branches: {
            refPrefix: 'refs/heads/',
          },
          tags: {
            refPrefix: 'refs/tags/',
          },
        };
        const dataQuery = `
          edges {
            node {
              name
              target {
                oid
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        `;
        return `
          refs(refPrefix: "${map[type].refPrefix}", first: 100, ${endCursor ? `after: "${endCursor}"` : ''}) {
            ${dataQuery}
          }
        `;
      };
      const req = async (refQuery: string) => {
        return await this.requestGraphQL({
          data: {
            query: `
              query($owner: String!, $name: String!) {
                repository(name: $name, owner: $owner) {
                  ${refQuery}
                }
              }
            `,
            variables: {
              owner: repo.owner,
              name: repo.name,
            },
          },
        });
      };
      const res: BranchOrTag[] = [];
      const collect = (data: any) => {
        data.repository.refs.edges.forEach((item) => {
          res.push({
            name: item.node.name,
            commit: { id: item.node.target.oid },
          });
        });
      };

      const data = await req(genQuery());
      collect(data);
      if (data.repository.refs.pageInfo.hasNextPage) {
        collect(await req(genQuery(data.repository.refs.pageInfo.endCursor)));
      }

      return res;
    },

    getBranches: async (repo: IRepositoryModel) => {
      return this.graphql.getRefs(repo, 'branches');
    },

    getTags: async (repo: IRepositoryModel) => {
      return this.graphql.getRefs(repo, 'tags');
    },
  };

  @retry
  async getCommit(repo: IRepositoryModel, ref: string) {
    if (this._requestType === 'rest') {
      return this.rest.getCommit(repo, ref);
    }
    return this.graphql.getCommit(repo, ref);
  }

  @retry
  async getTree(repo: IRepositoryModel, path: string) {
    if (this._requestType === 'rest') {
      return this.rest.getTree(repo, path);
    }
    return this.graphql.getTree(repo, path);
  }

  @retry
  async getBlob(repo: IRepositoryModel, entry: EntryParam) {
    if (this._requestType === 'rest') {
      return this.rest.getBlob(repo, entry);
    }
    return this.graphql.getBlob(repo, entry);
  }

  async getBlobByCommitPath(repo: IRepositoryModel, commit: string, path: string) {
    return this.rest.getBlobByCommitPath(repo, commit, path);
  }

  @retry
  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    if (this._requestType === 'rest') {
      return this.rest.getBranches(repo);
    }
    return this.graphql.getBranches(repo);
  }

  @retry
  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    if (this._requestType === 'rest') {
      return this.rest.getTags(repo);
    }
    return this.graphql.getTags(repo);
  }

  /**
   * github 内容搜索只支持主分支，切返回内容不行内容，故不提供
   * 后续可考虑在有后台支持情况下用 [sourcegraph](https://docs.sourcegraph.com/api/graphql) 接口
   */
  async searchContent() {
    return [];
  }

  async searchFile(repo: IRepositoryModel) {
    return this.getAllFiles(repo);
  }

  /**
   * github 接口只支持默认分支，这里查询一次所有文件来过滤
   */
  async getAllFiles(repo: IRepositoryModel) {
    const key = `${repo.owner}-${repo.name}-${repo.commit}`;
    if (!this.recursiveTreeMap.has(key)) {
      this.recursiveTreeMap.set(key, this.rest.getRecursiveTree(repo));
    }
    return this.recursiveTreeMap.get(key)!;
  }

  async getFileBlame(repo: IRepositoryModel, path: string): Promise<Uint8Array> {
    return this.requestGraphQL({
      data: {
        query: `query($owner: String!, $name: String!, $expression: String!, $path: String!) {
          repository(owner: $owner, name: $name) {
            object(expression: $expression) {
              ... on Commit {
                blame(path: $path) {
                  ranges {
                    commit {
                      author {
                        name
                        date
                        email
                        avatarUrl
                      }
                      committedDate
                      message
                      oid
                    }
                    startingLine
                    endingLine
                  }
                }
              }
            }
          }
        }`,
        variables: {
          owner: repo.owner,
          name: repo.name,
          expression: repo.commit,
          path,
        },
      },
    })
      .then((res) => {
        const graphQLBlames = res.repository.object.blame.ranges.map((item: any) => {
          return {
            commit: {
              author_email: item.commit.author.email,
              author_name: item.commit.author.name,
              authored_date: item.commit.author.date,
              message: item.commit.message,
              author: {
                avatar_url: item.commit.author.avatarUrl,
              },
              id: item.commit.oid,
              committed_date: item.commit.committedDate,
            },
            lines: [
              {
                current_number: item.startingLine,
                previous_number: item.endingLine,
                effect_line: item.endingLine - item.startingLine + 1,
              },
            ],
          };
        });
        return new TextEncoder().encode(JSON.stringify(graphQLBlames));
      })
      .catch((err) => {
        console.error(err);
        return new TextEncoder().encode('');
      });
  }

  // TODO: graphql
  getCommits(repo: IRepositoryModel, params: CommitParams) {
    return this.rest.getCommits(repo, params);
  }

  // TODO: graphql
  getCommitDiff(repo: IRepositoryModel, sha: string) {
    return this.rest.getCommitDiff(repo, sha);
  }

  // TODO: graphql
  async getCommitCompare(repo: IRepositoryModel, from: string, to: string) {
    return this.rest.getCommitCompare(repo, from, to);
  }

  // 只支持主分支获取所有文件列表
  async getFiles(repo: IRepositoryModel) {
    return await this.getAllFiles(repo);
  }

  async bulkChangeFiles(repo: IRepositoryModel, actions: FileAction[], header: FileActionHeader) {
    const { commit_message } = header;
    if (!commit_message) {
      return [];
    }

    // 先获取分支名
    // by CODE_SERVICE_COMMANDS
    const repositoryInfo: IRepositoryModel | undefined = await this.commandService.executeCommand(
      'code-service.repository',
    );
    if (!repositoryInfo || !repositoryInfo.ref) {
      return [];
    }

    const { ref: branchName } = repositoryInfo;

    const paramTree: API.RequestCreateTree[] = [];

    for await (const action of actions) {
      // 先创建 blob 对象
      const blob = await this.rest.createBlob(repo, { content: action.content });

      // 然后将 sha 传递给 tree 数据源
      paramTree.push({
        path: action.file_path,
        mode: '100644',
        type: 'blob',
        sha: action.action_type === FileActionType.delete ? null : blob.sha,
      });
    }

    // 创建树
    const treeData = await this.rest.createTree(repo, paramTree, repo.commit);

    // 获取当前分支最新的 commit
    const latestCommit = await this.rest.getCommit(repo, branchName);

    // 创建 commit
    const commitData = await this.requestByREST<API.ResponseCreateCommit>(
      `/repos/${this.getProjectPath(repo)}/git/commits`,
      {
        responseType: 'json',
        method: 'post',
        data: {
          message: commit_message,
          tree: treeData.sha,
          parents: [latestCommit],
        },
      },
    );

    // 将其关联分支的引用，此时才成功 push
    const referenceData = await this.rest.updateReference(repo, branchName, commitData.sha);

    return [
      {
        commit_id: referenceData.object.sha,
      },
    ] as FileOperateResult[];
  }
}
