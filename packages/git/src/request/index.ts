import { isDevelopment } from '@ali/ide-core-common';
import { umiRequest } from '@alipay/spacex-shared';

// TODO: 适配 gitlab 接口

const request = umiRequest.extend({
  prefix: isDevelopment() ? 'http://code.test.alipay.net' : 'https://code.alipay.com',
});

request.use(async (ctx, next) => {
  if (!ctx) return next();
  const {
    req: { options },
  } = ctx;
  options.credentials = 'include';
  return next();
});

// 根据分支获取最新的 commit
export const getCommit = (projectId: string, ref: string) => {
  return request(`/webapi/projects/${projectId}/repository/commits/${ref}`);
};

// 根据 commit 和 path 获取 tree
export const getTree = (projectId: string, sha: string, path: string) => {
  return request(`/webapi/projects/${projectId}/repository/tree`, {
    params: {
      ref_name: sha,
      path,
    },
  });
};

// 根据 commit 和 path 获取 blob
export const getBlob = (projectId: string, sha: string, path: string) => {
  return request(`/api/v3/projects/${projectId}/repository/blobs/${sha}`, {
    params: {
      filepath: path,
    },
    responseType: 'text',
  });
};
