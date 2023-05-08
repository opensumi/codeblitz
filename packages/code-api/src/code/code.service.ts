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
export default class CodeApiService extends AntCodeAPIService {
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
        ...(privateToken
          ? {
              ...options,
              headers: {
                'PRIVATE-TOKEN': privateToken,
                ...webgwRequestOpts,
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

  private getProjectIdByRepo(repo: IRepositoryModel) {
    return `${repo.owner}%2F${repo.name}`;
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
    let url = `/tcloudantcodeweb/api/v4/projects/${this.getProjectIdByRepo(
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
                ...webgwRequestOpts
              },
            }
          : {
              headers: {
                'Content-Type': 'application/json',
                ...webgwRequestOpts
              },
            }),
      })
    ).json();
  }
}