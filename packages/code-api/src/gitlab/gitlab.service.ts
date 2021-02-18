import { Injectable, Autowired } from '@ali/common-di';
import { localize, IReporterService, formatLocalize } from '@ali/ide-core-common';
import {
  CodeModelService,
  ICodeAPIService,
  TreeEntry,
  EntryParam,
} from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { request, RequestOptions } from '@alipay/alex-shared';
import { createUrl } from '../common/utils';
import { API } from './types';

/**
 * 目前 aone 不支持通过 private token 跨域调用，需要后台转发
 * 这里使用 gitlab 的 v3 接口，projectId 需使用数据库的 id，不支持 owner/name 的形式
 */

@Injectable()
export class GitLabService implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  private id: string;

  async initialize() {
    const { id } = await this.getProject();
    this.id = id;
  }

  transformStaticResource(path: string) {
    const { codeModel } = this;
    return `${codeModel.origin}/${codeModel.project}/raw/${codeModel.HEAD}/${path}`;
  }

  private async request<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = createUrl(this.codeModel.endpoint, path);

    try {
      return request(url, {
        responseType: 'json',
        headers: {
          'PRIVATE-TOKEN': 'rmeDjNMD2IwyZZSVFGiu',
        },
        ...options,
      });
    } catch (err: any) {
      const status = err.response?.status;
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
        this.messageService.error(
          formatLocalize('api.response.project-not-found', this.codeModel.project)
        );
      }
      this.messageService.error(localize('api.response.unknown-error'));
      throw err;
    }
  }

  async getProject() {
    return this.request<API.ResponseGetProject>(`/api/v3/projects/find_with_namespace`, {
      params: {
        path: this.codeModel.projectId,
      },
    });
  }

  async getCommit(ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.id}/repository/commits/${ref}`
      )
    ).id;
  }

  async getTree(path: string) {
    await this.codeModel.isInitialized;
    const data = await this.request<API.ResponseGetTree>(
      `/api/v3/projects/${this.id}/repository/tree`,
      {
        params: {
          ref_name: this.codeModel.HEAD,
          path,
        },
      }
    );
    return data.map<TreeEntry>((item) => {
      const entry: TreeEntry = {
        ...item,
        path: `${path ? `${path}/` : ''}/${item.name}`,
      };
      return entry;
    });
  }

  async getBlob(entry: EntryParam) {
    await this.codeModel.isInitialized;
    const buf = await this.request<ArrayBuffer>(
      `/api/v3/projects/${this.id}/repository/blobs/${this.codeModel.HEAD}`,
      {
        responseType: 'arrayBuffer',
        params: {
          filepath: entry.path,
        },
      }
    );
    return Buffer.from(buf);
  }
}
