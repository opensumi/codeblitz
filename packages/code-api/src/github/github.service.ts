import { Injectable, Autowired } from '@ali/common-di';
import { AppConfig } from '@ali/ide-core-browser';
import { localize, CommandService, memoize } from '@ali/ide-core-common';
import { CodeModelService, ICodeAPIService } from '@alipay/alex-code-service';
import type { TreeEntry, EntryParam, RefsParam } from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { request, isResponseError, RequestOptions } from '@alipay/alex-shared';
import { observable } from 'mobx';
import { GITHUB_OAUTH_TOKEN } from '../common/constant';
import { API } from './types';
import { HelperService } from '../common/service';
import { retry, RetryError } from '../common/utils';

@Injectable()
export class GitHubService implements ICodeAPIService {
  @Autowired()
  private readonly codeModel: CodeModelService;

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  @Autowired(HelperService)
  private readonly helper: HelperService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  /** 资源限制信息 */
  @observable
  public resources: API.ResponseGetRateLimit['resources'] = {
    core: { limit: 0, remaining: 0, reset: 0, used: 0 },
    graphql: { limit: 0, remaining: 0, reset: 0, used: 0 },
    integration_manifest: { limit: 0, remaining: 0, reset: 0, used: 0 },
    search: { limit: 0, remaining: 0, reset: 0, used: 0 },
  };

  shouldShowView = false;

  private _requestType: 'rest' | 'graphql' = 'rest';

  private _OAUTH_TOKEN: string | null;

  get OAUTH_TOKEN() {
    return this._OAUTH_TOKEN;
  }

  async initialize() {
    // 首次校验 token，并根据 remain 确定用 rest 还是 graphql
    const token = this.helper.GITHUB_TOKEN;
    await this.getRateLimit(token);
    if (!this.canRequest) {
      this.shouldShowView = true;
      this.showErrorRequestMessage(403);
    }
    if (!token) return;
    if (this.resources.core.remaining) {
      this._requestType = 'rest';
    } else if (this.resources.graphql.remaining) {
      this._requestType = 'graphql';
    }
    this._OAUTH_TOKEN = token;
  }

  get canRequest() {
    return this.resources.core.remaining > 0 || this.resources.graphql.remaining > 0;
  }

  transformStaticResource(path: string) {
    return `https://raw.githubusercontent.com/${this.codeModel.project}/${this.codeModel.HEAD}/${path}`;
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
    this.messageService.error(message);
    if (throwError !== false) {
      throw new Error(message);
    }
  }

  private async request(path: string, options?: RequestOptions): Promise<Response> {
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
        baseURL: this.codeModel.endpoint,
        ...rest,
      });
      return responseType ? response[responseType]() : response;
    } catch (err: unknown) {
      if (isResponseError(err)) {
        // 403 时切换为 graphql
        const { status } = err.response;
        if (status === 403 && this.resources.graphql.remaining > 0) {
          this.messageService.info(localize('github.toggle-graphql'));
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
    } catch (err) {
      this.showErrorRequestMessage(err?.response?.status, false);
      throw err;
    }
  }

  async requestObject(type: 'Commit' | 'Tree' | 'Blob', query: string, expression: string) {
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
          owner: this.codeModel.owner,
          name: this.codeModel.name,
          expression,
        },
      },
    });
    return data.repository.object;
  }

  async getRateLimit(token?: string | null) {
    try {
      const response = await this.request('/rate_limit', {
        baseURL: this.codeModel.endpoint,
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
      this.codeModel.reset();
      this.helper.revealView('explorer');
    } else {
      this.messageService.error(localize('request-rate-limit-with-token'));
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
    getCommit: async (ref: string) => {
      return this.requestByREST<string>(`/repos/${this.codeModel.project}/commits/${ref}`, {
        headers: {
          Accept: 'application/vnd.github.v3.sha',
        },
        responseType: 'text',
      });
    },

    getTree: async (path: string) => {
      const data = await this.requestByREST<API.ResponseGetTree>(
        `/repos/${this.codeModel.project}/git/trees/${this.codeModel.HEAD}:${path}`,
        {
          responseType: 'json',
        }
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

    getRecursiveTree: async () => {
      const data = await this.requestByREST<API.ResponseGetTree>(
        `/repos/${this.codeModel.project}/git/trees/${this.codeModel.HEAD}:`,
        {
          responseType: 'json',
          params: {
            recursive: 1,
          },
        }
      );
      return data.tree.filter((item) => item.type === 'blob').map((item) => item.path);
    },

    getBlob: async (entry: EntryParam) => {
      const buf = await this.requestByREST<ArrayBuffer>(
        `/repos/${this.codeModel.project}/git/blobs/${entry.id}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
          responseType: 'arrayBuffer',
        }
      );
      return Buffer.from(buf);
    },

    getRefs: async (): Promise<RefsParam> => {
      // TODO: 只获取 200 条数据
      const [branches, tags] = await Promise.all(
        ['branches', 'tags'].map(async (type) => {
          let data = await this.requestByREST<API.ResponseGetRefs>(
            `/repos/${this.codeModel.project}/${type}`,
            {
              responseType: 'json',
              params: {
                per_page: 100,
              },
            }
          );
          if (data.length === 100) {
            data = data.concat(
              await this.requestByREST<API.ResponseGetRefs>(
                `/repos/${this.codeModel.project}/${type}`,
                {
                  responseType: 'json',
                  params: {
                    per_page: 100,
                    page: 2,
                  },
                }
              )
            );
          }
          return data.map((item) => ({
            name: item.name,
            commit: {
              id: item.commit.sha,
            },
          }));
        })
      );
      return {
        branches,
        tags,
      };
    },
  };

  private graphql = {
    getCommit: async (ref: string) => {
      return (await this.requestObject('Commit', `oid`, ref)).oid;
    },

    getTree: async (path: string) => {
      const data = await this.requestObject(
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
        `${this.codeModel.HEAD}:${path}`
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

    getBlob: async (entry: EntryParam) => {
      const data = await this.requestObject(
        'Blob',
        `
          isBinary
          text
        `,
        `${this.codeModel.HEAD}:${entry.path}`
      );
      const text = data.text || '';
      return Buffer.from(text);
    },

    getRefs: async (): Promise<RefsParam> => {
      const genQuery = (type: 'branches' | 'tags', endCursor?: string) => {
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
          ${type}: refs(refPrefix: "${map[type].refPrefix}", first: 100, ${
          endCursor ? `after: "${endCursor}"` : ''
        }) {
            ${dataQuery}
          }
        `;
      };
      const data = await this.requestGraphQL({
        data: {
          query: `
            query($owner: String!, $name: String!) {
              repository(name: $name, owner: $owner) {
                ${genQuery('branches')}
                ${genQuery('tags')}
              }
            }
          `,
          variables: {
            owner: this.codeModel.owner,
            name: this.codeModel.name,
          },
        },
      });
      let nextPageQuery = '';
      if (data.repository.branches.pageInfo.hasNextPage) {
        nextPageQuery += genQuery('branches', data.repository.branches.pageInfo.endCursor);
      }
      if (data.repository.tags.pageInfo.hasNextPage) {
        nextPageQuery += genQuery('tags', data.repository.tags.pageInfo.endCursor);
      }
      if (nextPageQuery) {
        const nextData = await this.requestGraphQL({
          data: {
            query: `
              query($owner: String!, $name: String!) {
                repository(name: $name, owner: $owner) {
                  ${nextPageQuery}
                }
              }
            `,
            variables: {
              owner: this.codeModel.owner,
              name: this.codeModel.name,
            },
          },
        });
        if (nextData.repository.branches) {
          data.repository.branches.edges = data.repository.branches.edges.concat(
            nextData.repository.branches.edges
          );
        }
        if (nextData.repository.tags) {
          data.repository.tags.edges = data.repository.tags.edges.concat(
            nextData.repository.tags.edges
          );
        }
      }
      return {
        branches: data.repository.branches.edges.map((item) => ({
          name: item.node.name,
          commit: { id: item.node.target.oid },
        })),
        tags: data.repository.tags.edges.map((item) => ({
          name: item.node.name,
          commit: { id: item.node.target.oid },
        })),
      };
    },
  };

  @retry
  async getCommit(ref: string) {
    if (this._requestType === 'rest') {
      return this.rest.getCommit(ref);
    }
    return this.graphql.getCommit(ref);
  }

  @retry
  async getTree(path: string) {
    await this.codeModel.headInitialized;
    if (this._requestType === 'rest') {
      return this.rest.getTree(path);
    }
    return this.graphql.getTree(path);
  }

  @retry
  async getBlob(entry: EntryParam) {
    await this.codeModel.headInitialized;
    if (this._requestType === 'rest') {
      return this.rest.getBlob(entry);
    }
    return this.graphql.getBlob(entry);
  }

  @retry
  async getRefs(): Promise<RefsParam> {
    if (this._requestType === 'rest') {
      return this.rest.getRefs();
    }
    return this.graphql.getRefs();
  }

  /**
   * github 内容搜索只支持主分支，切返回内容不行内容，故不提供
   * 后续可考虑在有后台支持情况下用 [sourcegraph](https://docs.sourcegraph.com/api/graphql) 接口
   */
  async searchContent() {
    return [];
  }

  /**
   * github 接口只支持默认分支，这里查询一次所有文件来过滤
   */
  @memoize
  async searchFile() {
    return this.rest.getRecursiveTree();
  }
}
