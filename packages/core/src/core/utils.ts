import { IAppOpts } from '@codeblitzjs/ide-sumi-core';
import { ModuleConstructor } from '@opensumi/ide-core-browser';
import { URI } from '@opensumi/ide-core-common';

import { IAppConfig } from '../api/types';

export const flatModules = (modules: Record<string, ModuleConstructor | ModuleConstructor[]>) => {
  return Object.keys(modules).reduce<ModuleConstructor[]>(
    (arr, key) => arr.concat(modules[key]),
    [],
  );
};

export const mergeConfig = (target: IAppOpts, source: IAppConfig) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    switch (key) {
      case 'modules':
      case 'extensionMetadata':
        if (Array.isArray(sourceValue)) {
          if (!target[key]) {
            target[key] = [];
          }
          const targetValue = target[key] as any[];
          sourceValue.forEach((value) => {
            if (targetValue.indexOf(value) < 0) {
              targetValue.push(value);
            }
          });
        }
        break;
      case 'defaultPreferences':
      case 'defaultPanels':
        if (!target[key]) {
          target[key] = {};
        }
        Object.assign(target[key]!, sourceValue);
        break;
      default:
        target[key] = sourceValue;
    }
  });
  return target;
};

export function createHook(obj: any, targetFunction: string, options: {
  before: (args: any[]) => void;
  // after?: (value: any, args: any[]) => void;
}) {
  let temp = obj[targetFunction];
  const beforeHook = options.before;
  // const afterHook = options.after;
  obj[targetFunction] = function(...args) {
    beforeHook(args);
    let ret = temp.apply(this, args);
    if (ret && typeof ret.then === 'function') {
      return ret.then((value) => {
        // afterHook(value, args);
        return value;
      });
    } else {
      // afterHook(ret, args);
      return ret;
    }
  };
}

interface SCMUriQueryParams {
  ref: string; // commitId
  branch?: string; // 分支名
}

interface SCMUriParams extends SCMUriQueryParams {
  platform: string; // 例如 gitlab/gitlab 等
  repo: string; // groupName/repoName 项目名称
  path: string; // 文件路径
}

export function fromSCMUri(uri: URI): SCMUriParams {
  const query = uri.getParsedQuery();

  const result: SCMUriParams = {
    platform: query.scheme,
    repo: query.authority,
    path: query.path,
    ref: query.ref,
  };

  if (query.branch) {
    result.branch = query.branch;
  }

  return result;
}

export function toSCMUri(uriParams: SCMUriParams) {
  const query: SCMUriQueryParams = {
    ref: uriParams.ref,
  };

  if (uriParams.branch) {
    query.branch = uriParams.branch;
  }

  return URI.from({
    scheme: uriParams.platform,
    authority: uriParams.repo,
    path: uriParams.path,
    query: JSON.stringify(query),
  });
}
