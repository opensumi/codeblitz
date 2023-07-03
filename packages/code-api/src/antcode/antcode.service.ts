import { Injectable, Autowired } from '@opensumi/di';
import { localize, IReporterService, MessageType, LRUCache } from '@opensumi/ide-core-common';
import { REPORT_NAME } from '@alipay/alex-core';
import { request, RequestOptions, isResponseError, createUrl } from '@alipay/alex-shared';
import { API } from './types';
import { Branch, FileAction, FileActionHeader, FileActionResult, Project } from '../common/types';
import {
  ICodeAPIService,
  ISearchResults,
  EntryParam,
  CodePlatform,
  IRepositoryModel,
  BranchOrTag,
  CommitParams,
  CommitFileStatus,
} from '../common/types';
import { CODE_PLATFORM_CONFIG } from '../common/config';
import { HelperService } from '../common/service';
import { DEFAULT_SEARCH_IN_WORKSPACE_LIMIT } from '@opensumi/ide-search';

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
      if (line.startsWith('+')) {
        obj.additions += 1;
      } else if (line.startsWith('-')) {
        obj.deletions += 1;
      }
      return obj;
    },
    { additions: 0, deletions: 0 }
  );
};

@Injectable()
export class AntCodeAPIService implements ICodeAPIService {
  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(HelperService)
  helper: HelperService;

  private config = CODE_PLATFORM_CONFIG[CodePlatform.antcode];

  private _PRIVATE_TOKEN: string | null;

  get PRIVATE_TOKEN() {
    return this._PRIVATE_TOKEN;
  }

  // 只保留上一次的缓存，用于匹配过滤
  private readonly searchContentLRU = new LRUCache<string, ISearchResults>(1);

  constructor() {
    this._PRIVATE_TOKEN = this.config.token || null;
  }

  available() {
    return Promise.resolve(true);
  }

  transformStaticResource(repo: IRepositoryModel, path: string) {
    return `${this.config.origin}/${repo.owner}/${repo.name}/raw/${repo.commit}/${path}`;
  }

  protected async request<T>(
    path: string,
    options?: RequestOptions,
    responseOptions?: API.RequestResponseOptions
  ): Promise<T> {
    const { platform, origin, endpoint } = this.config;
    let privateToken = this.PRIVATE_TOKEN;
    if (path.startsWith('/webapi/')) {
      privateToken = '';
    }
    try {
      const data = await request(path, {
        baseURL: endpoint,
        credentials: 'include',
        responseType: 'json',
        ...(privateToken
          ? {
              ...options,
              headers: {
                'PRIVATE-TOKEN': privateToken,
                ...options?.headers,
              },
            }
          : options),
      });
      return data;
    } catch (err: any) {
      if (isResponseError(err)) {
        const { status } = err.response;
        this.reporter.point(REPORT_NAME.CODE_SERVICE_REQUEST_ERROR, err.message, {
          path,
          status,
          platform,
        });
        if (status === 401) {
          const goto = localize('api.login.goto');
          this.helper
            .showMessage(
              CodePlatform.antcode,
              {
                type: MessageType.Error,
                symbol: 'api.response.no-login-antcode',
                status: 401,
              },
              {
                buttons: [goto],
              }
            )
            .then((value) => {
              if (value === goto) {
                window.open(origin);
              }
            });
        } else {
          if (responseOptions?.errorOption === false) {
            // 此处为了web-scm查询 新增文件无需提示
            console.log(err);
            return undefined as any;
          }
          this.helper.showMessage(CodePlatform.antcode, {
            type: MessageType.Error,
            status: status,
            symbol: err?.message ? '' : 'error.request',
            message: err?.message,
          });
        }
      } else {
        this.helper.showMessage(CodePlatform.antcode, {
          type: MessageType.Error,
          symbol: 'api.response.unknown-error',
        });
      }
      throw err;
    }
  }

  private getProjectId(repo: IRepositoryModel) {
    return `${repo.owner}%2F${repo.name}`;
  }

  async getCommit(repo: IRepositoryModel, ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.getProjectId(repo)}/repository/commits/${encodeURIComponent(ref)}`
      )
    ).id;
  }

  async getTree(repo: IRepositoryModel, path: string) {
    return this.request<API.ResponseGetTree>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/tree`,
      {
        params: {
          ref_name: repo.commit,
          path,
        },
      }
    );
  }

  async getBlob(repo: IRepositoryModel, entry: EntryParam) {
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/blobs/${repo.commit}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: entry.path,
        },
      }
    );
    return new Uint8Array(buf);
  }

  async getBlobByCommitPath(
    repo: IRepositoryModel,
    commit: string,
    path: string,
    options?: API.RequestResponseOptions
  ) {
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/blobs/${commit}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: path,
        },
      },
      options
    );
    return new Uint8Array(buf);
  }

  async getEntryInfo(repo: IRepositoryModel, entry: EntryParam) {
    const data = await this.request<API.ResponseGetEntry>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/tree_entry`,
      {
        params: {
          ref_name: repo.commit,
          path: entry.path,
        },
      }
    );
    return {
      size: data.size,
      fileType: data.render === 'download' ? 'binary' : data.render,
    } as const;
  }

  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/branches`
    );
  }

  async getBranchNames(repo: IRepositoryModel): Promise<string[]> {
    return this.request<string[]>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/branches_names`
    );
  }

  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/tags`
    );
  }

  async searchContent(repo: IRepositoryModel, searchString: string, options: { limit: number }) {
    let results = this.searchContentLRU.get(searchString);
    if (results) {
      return results;
    }
    const reqRes = await this.request<API.ResponseContentSearch>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/contents_search`,
      {
        params: {
          ref_name: repo.commit,
          limit: options.limit,
          query: searchString,
        },
      }
    );
    const res = reqRes.reduce<ISearchResults>((list, item) => {
      item.lines.forEach((line) => {
        list.push({
          path: item.path,
          line: line.number,
          content: line.content,
        });
      });
      return list;
    }, []);
    this.searchContentLRU.set(searchString, res);
    return res;
  }

  async searchFile(repo: IRepositoryModel, searchString: string, options: { limit: number }) {
    // TODO：目前 OpenSumi 默认为 ''，后续得实现 queryBuilder 逻辑
    if (searchString === '') {
      const res = await this.request<string[]>(
        `/api/v3/projects/${this.getProjectId(repo)}/repository/files_list`,
        {
          params: {
            ref_name: repo.commit,
          },
        }
      );
      // 默认做个限制，防止请求过多
      return res.slice(0, DEFAULT_SEARCH_IN_WORKSPACE_LIMIT);
    }
    const reqRes = await this.request<string[]>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/files_search`,
      {
        params: {
          ref_name: repo.commit,
          limit: options.limit,
          query: searchString,
        },
      }
    );
    return reqRes;
  }

  async getFileBlame(repo: IRepositoryModel, path: string) {
    return new Uint8Array(
      await this.request(
        `/api/v3/projects/${this.getProjectId(repo)}/repository/blame?sha=${
          repo.commit
        }&file_path=${path}`,
        {
          responseType: 'arrayBuffer',
        }
      )
    );
  }

  async getCommits(repo: IRepositoryModel, params: CommitParams) {
    const data = await this.request<API.ResponseCommit[]>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/commits`,
      {
        params: {
          ref_name: params.ref,
          path: params.path,
          page: params.page,
          per_page: params.pageSize,
        },
      }
    );
    return data.map((c) => ({
      id: c.id,
      parents: c.parent_ids,
      author: c.author_name,
      authorEmail: c.author_email,
      authorDate: c.authored_date,
      committer: c.committer_name,
      committerEmail: c.committer_email,
      committerDate: c.committed_date,
      message: c.message,
      title: c.title,
    }));
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
    const data = await this.request<API.ResponseCommitCompare>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/compare`,
      {
        params: { from, to },
      }
    );
    return (data.diffs || []).map((d) => ({
      oldFilePath: d.old_path,
      newFilePath: d.new_path,
      type: toType(d),
      ...toChangeLines(d.diff),
    }));
  }

  async bulkChangeFiles(repo: IRepositoryModel, actions: FileAction[], header: FileActionHeader) {
    return (await this.request(`/api/v4/projects/${this.getProjectId(repo)}/repository/files`, {
      data: {
        actions: actions,
        header: header,
      },
      method: 'post',
    })) as FileActionResult[];
  }

  async getFiles(repo: IRepositoryModel): Promise<string[]> {
    return await this.request(`/api/v3/projects/${this.getProjectId(repo)}/repository/files_list`, {
      params: {
        ref_name: repo.commit,
      },
    });
  }

  async createBranch(repo: IRepositoryModel, branchName: string, target: string) {
    return this.request<Branch>(
      `/api/v3/projects/${this.getProjectId(
        repo
      )}/repository/branches?branch_name=${branchName}&ref=${target}`,
      {
        method: 'post',
      }
    );
  }

  async getUser(): Promise<API.User> {
    return await this.request(`/api/v3/user`);
  }

  async getProject(repo: IRepositoryModel): Promise<Project> {
    return await this.request<Project>(`/api/v3/projects/${this.getProjectId(repo)}`);
  }

  async canResolveConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    prId?: string
  ): Promise<API.CanResolveConflictResponse> {
    if (prId) {
      return await this.request<API.CanResolveConflictResponse>(
        `/api/v3/projects/${this.getProjectId(
          repo
        )}/pull_requests/${prId}/can_resolve_conflicts_inweb`
      );
    }
    return await this.request<API.CanResolveConflictResponse>(
      `/webapi/projects/${this.getProjectId(repo)}/repository/can_resolve_conflicts_inweb`,
      {
        params: {
          source_branch: sourceBranch,
          target_branch: targetBranch,
        },
      }
    );
  }

  async resolveConflict(
    repo: IRepositoryModel,
    content: API.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string
  ): Promise<API.ResolveConflictResponse> {
    if (prId) {
      return await this.request<API.ResolveConflictResponse>(
        `/api/v3/projects/${this.getProjectId(repo)}/pull_requests/${prId}/resolve_conflicts`,
        {
          method: 'put',
          data: content,
          responseType: undefined,
        }
      );
    } else {
      return await this.request<API.ResolveConflictResponse>(
        `/webapi/projects/${this.getProjectId(
          repo
        )}/repository/resolve_conflicts?source_branch=${sourceBranch}&target_branch=${targetBranch}`,
        {
          method: 'put',
          data: content,
          responseType: undefined,
        }
      );
    }
  }

  async getConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string
  ): Promise<API.ConflictResponse> {
    return await this.request<API.ConflictResponse>(
      `/api/v3/projects/${this.getProjectId(
        repo
      )}/merge/conflicts?source_branch=${sourceBranch}&target_branch=${targetBranch}`
    );
  }

  /*
   * 获取两个分支 的共同祖先
   * 类似于 git merge-base branch1 branch2
   * 接口暂时只支持查询两个分支
   */
  async mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string
  ): Promise<API.ResponseCommit> {
    let url = `/api/v4/projects/${this.getProjectId(
      repo
    )}/repository/merge_base?refs[]=${target}&refs[]=${source}`;
    if (this.config.endpoint) {
      url = createUrl(this.config.endpoint, url);
    }
    const urlInstance = new URL(url, location.origin);
    const privateToken = this.PRIVATE_TOKEN;
    return (
      await fetch(urlInstance.toString(), {
        method: 'GET',
        ...(privateToken
          ? {
              headers: {
                'PRIVATE-TOKEN': privateToken,
                'Content-Type': 'application/json',
              },
            }
          : {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
      })
    ).json();
  }

  // TODO 轻量PR接口？
  async createPullRequest(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    autoMerge?: boolean,
  ): Promise<API.ResponseCreatePR> {
    return await this.request<API.ResponseCreatePR>(
      `/api/v3/projects/${this.getProjectId(
        repo
      )}/pull_requests?source_branch=${sourceBranch}&target_branch=${targetBranch}&title=${title}&auto_merge=${autoMerge || true}`,
      {
        method: 'post',
      }
    );
  }
}
