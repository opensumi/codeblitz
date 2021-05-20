import { Uri, getDebugLogger } from '@ali/ide-core-common';
import { CODE_PLATFORM_CONFIG } from '@alipay/alex-code-api';
import { sep } from 'path';
import { ICodePlatform, Submodule, ProjectDesc } from './types';

export const HEAD = 'HEAD';

// copy from git extension
export function parseGitmodules(raw: string): Submodule[] {
  const regex = /\r?\n/g;
  let position = 0;
  let match: RegExpExecArray | null = null;

  const result: Submodule[] = [];
  let submodule: Partial<Submodule> = {};

  function parseLine(line: string): void {
    const sectionMatch = /^\s*\[submodule "([^"]+)"\]\s*$/.exec(line);

    if (sectionMatch) {
      if (submodule.name && submodule.path && submodule.url) {
        result.push(submodule as Submodule);
      }

      const name = sectionMatch[1];

      if (name) {
        submodule = { name };
        return;
      }
    }

    if (!submodule) {
      return;
    }

    const propertyMatch = /^\s*(\w+)\s*=\s*(.*)$/.exec(line);

    if (!propertyMatch) {
      return;
    }

    const [, key, value] = propertyMatch;

    switch (key) {
      case 'path':
        submodule.path = value;
        break;
      case 'url':
        submodule.url = value;
        break;
    }
  }

  while ((match = regex.exec(raw))) {
    parseLine(raw.substring(position, match.index));
    position = match.index + match[0].length;
  }

  parseLine(raw.substring(position));

  if (submodule.name && submodule.path && submodule.url) {
    result.push(submodule as Submodule);
  }

  return result;
}

export const parseSubmoduleUrl = (url: string): ProjectDesc | null => {
  let authority = '';
  let path = '';
  if (url.startsWith('git@')) {
    const colonIndex = url.indexOf(':');
    authority = url.slice(0, colonIndex);
    path = url.slice(colonIndex + 1);
  } else {
    const submoduleUri = Uri.parse(url);
    authority = submoduleUri.authority;
    path = submoduleUri.path;
  }
  const targetPlatform = Object.keys(CODE_PLATFORM_CONFIG).find((platform: ICodePlatform) => {
    const config = CODE_PLATFORM_CONFIG[platform];
    return config.hostname.some((item) => new RegExp(`\\b${item}$`).test(authority));
  });
  if (!targetPlatform) {
    return null;
  }
  if (path.endsWith('.git')) {
    path = path.slice(0, -4);
  }
  const [owner, name] = path.split('/').filter(Boolean);

  return {
    platform: targetPlatform as ICodePlatform,
    owner,
    name,
  };
};

export const stripLeadingSlash = (path: string) => (path.charAt(0) === '/' ? path.substr(1) : path);

export const logger = getDebugLogger('code-service');

export function isDescendant(parent: string, descendant: string): boolean {
  if (parent === descendant) {
    return true;
  }

  if (parent.charAt(parent.length - 1) !== sep) {
    parent += sep;
  }

  return descendant.startsWith(parent);
}

export const findRef = (refs: string[], path: string): string => {
  const addSlash = (str: string) => (str[str.length - 1] !== '/' ? `${str}/` : str);
  const countSlash = (str: string) => (str.match(/\//g) || []).length;

  path = addSlash(path);

  const candidateRefs = refs.filter((ref) => path.startsWith(addSlash(ref)));
  // 或许这里不需要，理论 ref 路径互不包含
  candidateRefs.sort((a, b) => countSlash(a) - countSlash(b));

  return candidateRefs[0] || '';
};
