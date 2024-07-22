import { isResponseError, request, RequestOptions } from '@codeblitzjs/ide-common';
import { REPORT_NAME } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable } from '@opensumi/di';
import { IReporterService, localize, LRUCache, MessageType } from '@opensumi/ide-core-common';
import { DEFAULT_SEARCH_IN_WORKSPACE_LIMIT } from '@opensumi/ide-search';
import { CodePlatformRegistry } from '../common/config';
import { HelperService } from '../common/service';
import { Branch, FileAction, FileActionHeader, FileActionResult, Project } from '../common/types';
import {
  BranchOrTag,
  CodePlatform,
  CommitFileStatus,
  CommitParams,
  EntryParam,
  ICodeAPIService,
  IRepositoryModel,
  ISearchResults,
} from '../common/types';
import { API } from './types';
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
    { additions: 0, deletions: 0 },
  );
};

@Injectable()
export class CodeUPAPIService implements ICodeAPIService {
  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(HelperService)
  helper: HelperService;

  config = CodePlatformRegistry.instance().getPlatformConfig(CodePlatform.codeup);

  // 只保留上一次的缓存，用于匹配过滤
  private readonly searchContentLRU = new LRUCache<string, ISearchResults>(1);

  constructor() {
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
    responseOptions?: API.RequestResponseOptions,
  ): Promise<T> {
    const { platform, origin, endpoint } = this.config;
    try {
      const data = await request(path, {
        baseURL: endpoint,
        credentials: 'include',
        responseType: 'json',
        ...options,
        headers: {
          ...options?.headers,
        },
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
              CodePlatform.codeup,
              {
                type: MessageType.Error,
                symbol: 'api.response.no-login-codeup',
                status: 401,
              },
              {
                buttons: [goto],
              },
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
          this.helper.showMessage(CodePlatform.codeup, {
            type: MessageType.Error,
            status: status,
            symbol: err?.message ? '' : 'error.request',
            message: err?.message,
          });
        }
      } else {
        this.helper.showMessage(CodePlatform.codeup, {
          type: MessageType.Error,
          symbol: 'api.response.unknown-error',
        });
      }
      throw err;
    }
  }

  getProjectId(repo: IRepositoryModel) {
    // return `${repo.owner}%2F${repo.name}`;
    return repo!.projectId;
  }
  async getCommit(repo: IRepositoryModel, ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.getProjectId(repo)}/repository/commits/${encodeURIComponent(ref)}`,
      )
    ).id;
  }

  async getTree(repo: IRepositoryModel, path: string) {
    return this.request<API.ResponseGetTree>(
      `/api/v4/projects/${this.getProjectId(repo)}/repository/tree`,
      {
        params: {
          type: 'DIRECT',
          ref_name: repo.commit,
          path,
        },
      },
    );
  }

  async getBlob(repo: IRepositoryModel, entry: EntryParam) {
    const res = await this.request<API.ResponseBlobs>(
      `/api/v4/projects/${
        this.getProjectId(
          repo,
        )
      }/repository/blobs`,
      {
        params: {
          filepath: entry.path,
          ref: repo.commit,
        },
      },
    );
    return new Uint8Array(new TextEncoder().encode(res.content));
  }

  async getBlobByCommitPath(
    repo: IRepositoryModel,
    commit: string,
    path: string,
    options?: API.RequestResponseOptions,
  ) {
    const infoAndBlobs = await this.request<API.ResponseInfoAndBlobs>(
      `/api/v4/projects/${
        this.getProjectId(
          repo,
        )
      }/repository/blobs/${commit}/general_info_and_blobs`,
      {
        params: {
          file_path: path,
        },
      },
      options,
    );
    return new Uint8Array(new TextEncoder().encode(infoAndBlobs?.content || ''));
  }

  // async getEntryInfo(repo: IRepositoryModel, entry: EntryParam) {
  //   const data = await this.request<API.ResponseGetEntry>(
  //     `/api/v3/projects/${this.getProjectId(repo)}/repository/tree_entry`,
  //     {
  //       params: {
  //         ref_name: repo.commit,
  //         path: entry.path,
  //       },
  //     }
  //   );
  //   return {
  //     size: data.size,
  //     fileType: data.render === 'download' ? 'binary' : data.render,
  //   } as const;
  // }

  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v3/projects/${this.getProjectId(repo)}/repository/branches`,
      {
        params: {
          page: 1,
          per_page: 1000,
        },
      },
    );
  }

  // async getBranchNames(repo: IRepositoryModel): Promise<string[]> {
  //   return this.request<string[]>(
  //     `/api/v3/projects/${this.getProjectId(repo)}/repository/branches_names`
  //   );
  // }
  async getTags(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return this.request<API.ResponseGetRefs>(
      `/api/v4/projects/${this.getProjectId(repo)}/repository/tags`,
      {
        params: {
          page: 1,
          per_page: 1000,
        },
      },
    );
  }

  async searchContent(repo: IRepositoryModel, searchString: string) {
    let results = this.searchContentLRU.get(searchString);
    if (results) {
      return results;
    }
    const reqRes = await this.request<API.ResponseContentObject>(
      `/api/v4/projects/${this.getProjectId(repo)}/search`,
      {
        params: {
          branch: repo.commit,
          keyword: searchString,
          page_num: 1,
          page_size: 1000,
          type: 'sha',
        },
      },
    );
    const res = reqRes.matched_file_list.reduce<ISearchResults>((list, item) => {
      item.block_list.forEach((line) => {
        list.push({
          path: item.file_path,
          line: line.begin_line,
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
      const res = await this.request<API.ResponseFileNames[]>(
        `/api/v4/projects/${this.getProjectId(repo)}/repository/filenames`,
        {
          params: {
            ref_name: repo.commit,
            search: searchString,
          },
        },
      );
      // 默认做个限制，防止请求过多
      return res.map(r => r.path).slice(0, DEFAULT_SEARCH_IN_WORKSPACE_LIMIT);
    }
    const reqRes = await this.request<API.ResponseFileNames[]>(
      `/api/v4/projects/${this.getProjectId(repo)}/repository/filenames`,
      {
        params: {
          ref_name: repo.commit,
          search: searchString,
        },
      },
    );
    return reqRes.map(r => r.path);
  }

  async getFileBlame(repo: IRepositoryModel, path: string) {
    return new Uint8Array(
      await this.request(
        `/api/v3/projects/${this.getProjectId(repo)}/repository/files/blame`,
        {
          responseType: 'arrayBuffer',
          params: {
            ref: repo.commit,
            file_path: path,
          },
        },
      ),
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
      },
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
      `/api/v3/projects/${this.getProjectId(repo)}/repository/commits/${sha}/diff`,
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
      `/api/v4/projects/${this.getProjectId(repo)}/repository/commits/compare`,
      {
        params: { from, to },
      },
    );
    return (data.diffs || []).map((d) => ({
      oldFilePath: d.old_path,
      newFilePath: d.new_path,
      type: toType(d),
      ...toChangeLines(d.diff),
    }));
  }

  async bulkChangeFiles(
    repo: IRepositoryModel,
    actions: FileAction[],
    header: FileActionHeader,
  ): Promise<FileActionResult[]> {
    const res = await this.request<API.ResponseCommit>(
      `/api/v4/projects/${this.getProjectId(repo)}/repository/commit/files`,
      {
        data: {
          actions: actions.map((action) => ({
            action: action.action_type.toLocaleLowerCase(),
            file_path: action.file_path,
            content: action.content,
            previous_path: action.file_path,
          })),
          projectId: this.getProjectId(repo),
          // codeup 分支为当前分支
          branch: header.branch,
          commit_message: header.commit_message,
        },
        method: 'post',
      },
    );
    const resCommit = {
      branch_created: false,
      branch: header.branch,
      commit_id: res.id,
      file_name: '',
      ...res,
    };
    // 没有提交ID 说明提交失败
    if (res.id) {
      return [resCommit] as FileActionResult[];
    }
    return [];
  }

  async getFiles(repo: IRepositoryModel): Promise<string[]> {
    const fileList = await this.request<API.ResponseFileNames[]>(
      `/api/v4/projects/${this.getProjectId(repo)}/repository/filenames`,
      {
        params: {
          ref_name: repo.commit,
          search: '*',
        },
      },
    );
    return fileList.map((f) => f.path);
  }

  async createBranch(repo: IRepositoryModel, branchName: string, target: string) {
    return this.request<Branch>(`/portal/api/v1/tbtask/create_branch`, {
      method: 'post',
      data: {
        project_id: this.getProjectId(repo),
        branch_name: branchName,
        ref: target,
      },
    });
  }

  async getUser(): Promise<API.User> {
    return {} as API.User;
  }
  async getProject(repo: IRepositoryModel): Promise<Project> {
    return await this.request<Project>(
      `/api/v3/projects/info?identity=${this.getProjectId(repo)}`,
    );
  }

  async canResolveConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    prId?: string,
  ): Promise<API.CanResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }

  async resolveConflict(
    repo: IRepositoryModel,
    content: API.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string,
  ): Promise<API.ResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }

  async getConflict(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
  ): Promise<API.ConflictResponse> {
    throw new Error('Method not implemented.');
  }

  /*
   * 获取两个分支 的共同祖先
   * 类似于 git merge-base branch1 branch2
   * 接口暂时只支持查询两个分支
   */
  async mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string,
  ): Promise<API.ResponseCommit> {
    throw new Error('Method not implemented.');
  }

  async createPullRequest(
    repo: IRepositoryModel,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    autoMerge?: boolean,
  ): Promise<API.ResponseCreatePR> {
    throw new Error('Method not implemented.');
  }
}
