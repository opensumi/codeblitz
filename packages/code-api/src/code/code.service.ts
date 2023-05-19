import { request, RequestOptions, isResponseError, createUrl } from '@alipay/alex-shared';
import { localize, MessageType } from '@opensumi/ide-core-common';
import { REPORT_NAME } from '@alipay/alex-core';
import { CODE_PLATFORM_CONFIG } from '../common/config';

import { API } from '../antcode/types';
import { AntCodeAPIService } from '../antcode/antcode.service';
import {
  CodePlatform,
  IRepositoryModel
} from '../common/types';
const webgwRequestOpts = {
  'x-webgw-appId': '180020010001252942',
  'x-webgw-version': '2.0',
};
/**
 * 小程序云Code
 */
export default class CodeAPIService extends AntCodeAPIService {
  config = CODE_PLATFORM_CONFIG[CodePlatform.code];

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
      const data = await request(`/tcloudantcodeweb${path}`, {
        baseURL: endpoint,
        credentials: 'include',
        responseType: 'json',
        ...options,
        ...({
          headers: {
            ...(privateToken ? { 'PRIVATE-TOKEN': privateToken } : {}),
            ...options?.headers,
            ...webgwRequestOpts,
          },
        }),
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
              CodePlatform.code,
              {
                type: MessageType.Error,
                symbol: 'api.response.no-login-code',
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
          this.helper.showMessage(CodePlatform.code, {
            type: MessageType.Error,
            status: status,
            symbol: err?.message ? '' : 'error.request',
            message: err?.message,
          });
        }
      } else {
        this.helper.showMessage(CodePlatform.code, {
          type: MessageType.Error,
          symbol: 'api.response.unknown-error',
        });
      }
      throw err;
    }
  }

  mergeBase(
    repo: IRepositoryModel,
    target: string,
    source: string
  ): Promise<API.ResponseCommit> {
    throw new Error('Method not implemented.');
  }
}