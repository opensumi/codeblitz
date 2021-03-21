import { Injectable, Autowired } from '@ali/common-di';
import { localize, IReporterService } from '@ali/ide-core-common';
import { LRUCache } from '@ali/ide-core-common/lib/map';
import { REPORT_NAME } from '@alipay/alex-core';
import { CodeModelService, ICodeAPIService, ISearchResults } from '@alipay/alex-code-service';
import type { EntryParam, RefsParam } from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { request, RequestOptions, isResponseError } from '@alipay/alex-shared';
import { API } from './types';

@Injectable()
export class AntCodeService implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  // 只保留上一次的缓存，用于匹配过滤
  private readonly searchContentLRU = new LRUCache<string, ISearchResults>(1);

  initialize() {
    return Promise.resolve();
  }

  transformStaticResource(path: string) {
    const { codeModel } = this;
    return `${codeModel.origin}/${codeModel.project}/raw/${codeModel.HEAD}/${path}`;
  }

  private async request<T>(path: string, options?: RequestOptions): Promise<T> {
    try {
      const data = await request(path, {
        baseURL: this.codeModel.endpoint,
        credentials: 'include',
        responseType: 'json',
        ...options,
      });
      return data;
    } catch (err: unknown) {
      if (isResponseError(err)) {
        const { status } = err.response;
        this.reporter.point(REPORT_NAME.CODE_SERVICE_REQUEST_ERROR, err.message, {
          path,
          status,
          platform: this.codeModel.platform,
        });
        if (status === 401) {
          const goto = localize('api.login.goto');
          this.messageService
            .error(localize('api.response.no-login-antcode'), [goto])
            .then((value) => {
              if (value === goto) {
                window.open(this.codeModel.origin);
              }
            });
        } else if (status === 403) {
          this.messageService.error(localize('api.response.project-no-access'));
        } else if (status === 404) {
          // TODO 更精细化的错误提示
          this.messageService.error(localize('error.resource-not-found'));
        } else {
          this.messageService.error(`${status} - ${localize('error.request')}`);
        }
      } else {
        this.messageService.error(localize('api.response.unknown-error'));
      }
      throw err;
    }
  }

  async getCommit(ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.codeModel.projectId}/repository/commits/${encodeURIComponent(ref)}`
      )
    ).id;
  }

  async getTree(path: string) {
    await this.codeModel.headInitialized;
    return this.request<API.ResponseGetTree>(
      `/api/v3/projects/${this.codeModel.projectId}/repository/tree`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
          path,
        },
      }
    );
  }

  async getBlob(entry: EntryParam) {
    await this.codeModel.headInitialized;
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${this.codeModel.projectId}/repository/blobs/${this.codeModel.HEAD}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: entry.path,
        },
      }
    );
    return Buffer.from(buf);
  }

  async getEntryInfo(entry: EntryParam) {
    await this.codeModel.headInitialized;
    const data = await this.request<API.ResponseGetEntry>(
      `/api/v3/projects/${this.codeModel.projectId}/repository/tree_entry`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
          path: entry.path,
        },
      }
    );
    return {
      size: data.size,
      fileType: data.render === 'download' ? 'binary' : data.render,
    } as const;
  }

  async getRefs(): Promise<RefsParam> {
    const [branches, tags] = await Promise.all([
      this.request<API.ResponseGetRefs>(
        `/api/v3/projects/${this.codeModel.projectId}/repository/branches`
      ),
      this.request<API.ResponseGetRefs>(
        `/api/v3/projects/${this.codeModel.projectId}/repository/tags`
      ),
    ]);
    return {
      branches,
      tags,
    };
  }

  async searchContent(searchString: string, options: { limit: number }) {
    let results = this.searchContentLRU.get(searchString);
    if (results) {
      return results;
    }
    const reqRes = await this.request<API.ResponseContentSearch>(
      `/api/v3/projects/${this.codeModel.projectId}/repository/contents_search`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
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

  async searchFile(searchString: string, options: { limit: number }) {
    const reqRes = await this.request<string[]>(
      `/api/v3/projects/${this.codeModel.projectId}/repository/files_search`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
          limit: options.limit,
          query: searchString,
        },
      }
    );
    return reqRes;
  }
}
