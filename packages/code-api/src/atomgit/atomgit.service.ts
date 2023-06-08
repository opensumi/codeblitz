import { Autowired, Injectable } from '@opensumi/di';
import {
  TreeEntry,
  EntryParam,
  ICodeAPIService,
  IRepositoryModel,
  BranchOrTag,
  CommitParams,
  Branch,
  Project,
  CommitFileChange,
  CommitRecord,
  FileAction,
  FileActionHeader,
  ISearchResults,
  CodePlatform,
  GitlensBlame,
} from '../common/types';
import { API as ConflictAPI } from '../antcode/types';
import { request, RequestOptions } from '@alipay/alex-shared';
import { CODE_PLATFORM_CONFIG, HelperService } from '../common';
import { URI, MessageType, isObject } from '@opensumi/ide-core-common';
import { API } from './types';

@Injectable()
export class AtomGitAPIService implements ICodeAPIService {
  @Autowired(HelperService)
  helper: HelperService;

  private config = CODE_PLATFORM_CONFIG[CodePlatform.atomgit];

  private _PRIVATE_TOKEN: string | null;

  get PRIVATE_TOKEN() {
    return this._PRIVATE_TOKEN || this.helper.ATOMGIT_TOKEN;
  }

  constructor() {
    this._PRIVATE_TOKEN = this.config.token || this.helper.ATOMGIT_TOKEN || '';
  }

  private async checkAccessToken(): Promise<boolean> {
    const popupWindow = window.open(`${this.config.origin}login/oauth/authorize?client_id=9d8b531661f441d1`, '_blank', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=520,top=150,left=150');
    return new Promise<boolean>((resolve, reject) => {
      const handleMessage = async (event: MessageEvent) => {
        try {
          const { data } = event;
          if (isObject(data) && data.type === 'atomgit') {
            const { data: { code } } = data;
            popupWindow?.close();
            if (!code) {
              resolve(false);
              return;
            }
            const tokenResult: any = await this.request('https://twebgwnet.alipay.com/tcloudideweb/openapi/atomgit-auth-callback', {
              baseURL: '',
              method: 'post',
              credentials: 'omit',
              data: {
                code
              }
            });
            if (tokenResult && tokenResult.access_token) {
              this.helper.ATOMGIT_TOKEN = tokenResult.access_token;
              resolve(true);
              return;
            }
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      };
      window.addEventListener('message', handleMessage);
    });
  }

  public async available(): Promise<boolean> {
    const token = this._PRIVATE_TOKEN;
    if (!token) {
      return await this.checkAccessToken();
    }
    return true;
  }

  private showErrorMessage(symbol: string, message?: string, status?: number) {
    this.helper.showMessage(CodePlatform.atomgit, {
      type: MessageType.Error,
      status,
      symbol,
      message,
    });
  }

  protected async request<T>(path: string, options?: RequestOptions): Promise<T> {
    try {
      const { headers, ...rest } = options || {};
      const privateToken = this.PRIVATE_TOKEN;
      return await request(path, {
        baseURL: options?.baseURL ?? this.config.endpoint,
        responseType: 'json',
        headers: {
          ...(privateToken
            ? {
                'Authorization': `Bearer ${privateToken}`,
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
        messageKey = 'atomgit.unauthorized';
        // 401 的情况再登陆一次
        await this.checkAccessToken();
      } else if (status === 404) {
        messageKey = 'error.resource-not-found';
      }
      this.showErrorMessage(messageKey, status);
      throw err;
    }
  }

  private getProjectPath(repo: IRepositoryModel) {
    return `${repo.owner}/${repo.name}`;
  }

  async getCommit(repo: IRepositoryModel, ref: string): Promise<string> {
    const commitInfo = await this.request<API.ResponseCommit>(`/repos/${this.getProjectPath(repo)}/branches/${encodeURIComponent(ref)}`);
    return commitInfo.commit.sha;
  }
  async getTree(repo: IRepositoryModel, path: string): Promise<TreeEntry[]> {
    const { owner, name, commit } = repo;
    const res = await this.request<API.ResponseFileTree[]>(`/repos/${owner}/${name}/trees/${commit}`, {
      params: {
        file_path: path
      },
    });
    
    return Array.isArray(res) ? res.map(data => {
      const name = URI.parse(data.path).displayName;

      return {
        ...data,
        name
      } as TreeEntry
    }) : [];
  }
  async getBlob(repo: IRepositoryModel, entry: EntryParam): Promise<Uint8Array> {
    const { path } = entry;
    const { ref } = repo;
    const res = await this.request<API.ResponseContentBlob>(
      `/repos/${this.getProjectPath(repo)}/contents`,
      {
        params: {
          ref,
          path
        }
      }
    );

    const { content, encoding, type } = res;

    if (type !== 'file') {
      throw new Error(`${path} is not a file.`);
    }
    
    if (encoding === 'base64') {
      return Buffer.from(decodeURIComponent(escape(atob(content))));
    }

    return Buffer.from(content);
  }
  getBlobByCommitPath(_repo: IRepositoryModel, _commit: string, _path: string, _options?: any): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }
  async getBranches(repo: IRepositoryModel): Promise<BranchOrTag[]> {
    if (!this._PRIVATE_TOKEN) {
      return [];
    }

    const branches = await this.request<API.ResponseBranchesInfo[]>(`/repos/${this.getProjectPath(repo)}/branches`);
    if (!Array.isArray(branches)) {
      throw new Error('[can not find branch list]');
    }

    return branches.map((data) => ({
      name: data.name,
      commit: {
        id: data.commit.sha
      },
      protected: data.protected
    }));
  }
  async getTags(_repo: IRepositoryModel): Promise<BranchOrTag[]> {
    return [];
  }
  transformStaticResource(_repo: IRepositoryModel, _path: string): string {
    throw new Error('Method not implemented.');
  }
  async searchContent(_repo: IRepositoryModel, _searchString: string, _options: { limit: number; }): Promise<ISearchResults> {
    return [];
  }
  async searchFile(_repo: IRepositoryModel, _searchString: string, _options: { limit?: number | undefined; }): Promise<string[]> {
    return [];
  }
  async getFileBlame(repo: IRepositoryModel, filepath: string): Promise<Uint8Array> {
    const res = await this.request<API.ResponseFileBlame[]>(`/repos/${this.getProjectPath(repo)}/files/blame`, {
      params: {
        file_path: filepath,
        sha: repo.commit
      }
    });

    const blameHash = {};
    const blamePart: GitlensBlame[] = [];

    res.forEach((blame, _index) => {
      const commit = blame.commit;
      if (blameHash[commit.id]) {
        const bla = blamePart.find((b) => b.commit.id === blame.commit.id);
        if (!bla) {
          return;
        }

        bla.lines.push({
          current_number: blame.start,
          effect_line: blame.contents.length,
          previous_number: blame.start,
        });
      } else {
        blameHash[commit.id] = true;
        blamePart.push({
          commit: {
            id: commit.id,
            author_name: commit.author_name,
            author_email: commit.author_email || 'no_email',
            authored_date: new Date(commit.created_at).getTime(),
            committed_date: new Date(commit.created_at).getTime(),
            message: commit.title,
            author: {
              avatar_url: commit?.user?.avatar_url || ''
            }
          },
          lines: [
            {
              current_number: blame.start,
              effect_line: blame.contents.length,
              previous_number: blame.start,
            },
          ],
        });
      }
    });

    return new TextEncoder().encode(JSON.stringify(blamePart));
  }
  getCommits(_repo: IRepositoryModel, _params: CommitParams): Promise<CommitRecord[]> {
    throw new Error('Method not implemented.');
  }
  getCommitDiff(_repo: IRepositoryModel, _sha: string): Promise<CommitFileChange[]> {
    throw new Error('Method not implemented.');
  }
  getCommitCompare(_repo: IRepositoryModel, _from: string, _to: string): Promise<CommitFileChange[]> {
    throw new Error('Method not implemented.');
  }
  async getFiles(_repo: IRepositoryModel): Promise<string[]> {
    return [];
  }
  bulkChangeFiles(_repo: IRepositoryModel, _actions: FileAction[], _header: FileActionHeader): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createBranch(_repo: IRepositoryModel, _newBranch: string, _ref: string): Promise<Branch> {
    throw new Error('Method not implemented.');
  }
  getUser(_repo: IRepositoryModel): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  public async getProject(repo: IRepositoryModel): Promise<Project> {
    const repoInfo = await this.request<API.ResponseRepoInfo>(`/repos/${this.getProjectPath(repo)}`);
    return {
      id: repoInfo.name,
      default_branch: repoInfo.default_branch
    };
  }
  canResolveConflict(_repo: IRepositoryModel, _sourceBranch: string, _targetBranch: string, _prId: string): Promise<ConflictAPI.CanResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  resolveConflict(_repo: IRepositoryModel, _content: ConflictAPI.ResolveConflict, _sourceBranch: string, _targetBranch: string, _prId?: string | undefined): Promise<ConflictAPI.ResolveConflictResponse> {
    throw new Error('Method not implemented.');
  }
  getConflict(_repo: IRepositoryModel, _sourceBranch: string, _targetBranch: string): Promise<ConflictAPI.ConflictResponse> {
    throw new Error('Method not implemented.');
  }
  mergeBase(_repo: IRepositoryModel, _target: string, _source: string): Promise<ConflictAPI.ResponseCommit> {
    throw new Error('Method not implemented.');
  }

  clearToken() {
    this._PRIVATE_TOKEN = null;
    this.helper.ATOMGIT_TOKEN = null;
  }

}
