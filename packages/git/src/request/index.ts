import { isDevelopment } from '@ali/ide-core-common';
import { umiRequest } from '@alipay/spacex-shared';
import { API } from './type';

// TODO: 适配 gitlab 接口

const request = umiRequest.extend({
  prefix: isDevelopment() ? 'http://code.test.alipay.net:9009' : 'https://code.alipay.com',
});

request.use(async (ctx, next) => {
  if (!ctx) return next();
  const {
    req: { options },
  } = ctx;
  options.credentials = 'include';
  return next();
});

// 根据 group/repository 获取 projectId 等信息
export const getProjectInfo = (pathWithNamespace: string) => {
  return request<API.ResponseGetProjectById>(
    `/webapi/projects/${encodeURIComponent(pathWithNamespace)}`
  );
};

// 获取文件节点
export const getTreeEntry = (projectId: number, sha: string, path?: string) => {
  return request<API.ResponseGetTreeEntry>(`/api/v3/projects/${projectId}/repository/tree_entry`, {
    params: {
      ref_name: sha,
      path,
    },
  });
};

// 根据分支获取最新的 commit
export const getCommit = (projectId: number, ref: string) => {
  return request<API.ResponseGetCommit>(`/webapi/projects/${projectId}/repository/commits/${ref}`);
};

// 根据 commit 和 path 获取 tree
export const getTree = (projectId: number, sha: string, path?: string) => {
  return request<API.ResponseGetTree>(`/webapi/projects/${projectId}/repository/tree`, {
    params: {
      ref_name: sha,
      path,
    },
  });
};

// 根据 commit 和 path 获取 blob
export const getBlob = (projectId: number, sha: string, path: string) => {
  return request<API.ResponseGetBlob>(`/api/v3/projects/${projectId}/repository/blobs/${sha}`, {
    params: {
      filepath: path,
    },
    responseType: 'text',
  });
};
