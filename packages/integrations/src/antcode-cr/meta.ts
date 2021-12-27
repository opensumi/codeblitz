import { AntcodeEncodingType } from '@alipay/alex-acr/lib/modules/antcode-service/base';

export const defaultEncoding = AntcodeEncodingType.utf8;

const matched = location.pathname.match(
  /^\/([A-Za-z0-9_\-.]+)\/([A-Za-z0-9_\-.]+)\/pull_requests\/(\d+)/
);

/**
 * 默认 PR 链接 http://code.test.alipay.net/ide-s/TypeScript-Node-Starter/pull_requests/2
 */

export const group = matched?.[1] ?? 'ide-s';
export const repo = matched?.[2] ?? 'TypeScript-Node-Starter';
export const prIid = matched?.[3] ?? '2';

export const project = `${group}/${repo}`;

// projectId = 42422
// prId = 13055
