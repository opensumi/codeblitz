import { Injectable, Autowired } from '@ali/common-di';
import { localize, IReporterService, formatLocalize } from '@ali/ide-core-common';
import { REPORT_NAME } from '@alipay/alex-core';
import { CodeModelService, ICodeAPIService, EntryParam } from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { request, RequestOptions } from '@alipay/alex-shared';
import { createUrl } from '../common/utils';
import { API } from './types';

@Injectable()
export class AntCodeService implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  initialize() {
    return Promise.resolve();
  }

  transformStaticResource(path: string) {
    const { codeModel } = this;
    return `${codeModel.origin}/${codeModel.project}/raw/${codeModel.HEAD}/${path}`;
  }

  private async request<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = createUrl(this.codeModel.endpoint, path);

    try {
      const data = await request(url, {
        credentials: 'include',
        responseType: 'json',
        ...options,
      });
      return data;
    } catch (err: any) {
      const status = err.response?.status;
      this.reporter.point(REPORT_NAME.CODE_SERVICE_REQUEST_ERROR, err.message, {
        url,
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
        this.messageService.error(
          formatLocalize('api.response.project-not-found', this.codeModel.project)
        );
      } else {
        this.messageService.error(localize('api.response.unknown-error'));
      }
      throw err;
    }
  }

  async getCommit(ref: string) {
    return (
      await this.request<API.ResponseGetCommit>(
        `/api/v3/projects/${this.codeModel.projectId}/repository/commits/${ref}`
      )
    ).id;
  }

  async getTree(path: string) {
    await this.codeModel.isInitialized;
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
    await this.codeModel.isInitialized;
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
    await this.codeModel.isInitialized;
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
}
