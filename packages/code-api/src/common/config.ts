import { CodePlatform, ICodePlatform } from './types';

export interface ICodePlatformConfig {
  platform: CodePlatform;
  origin: string;
  hostname: string[];
  endpoint: string;
  brand: string;
  token?: string;
  // hash line
  line: {
    parse(hash: string): [number, number] | null;
    format(lineNumbers: [number, number]): string;
  };
  createBranchAble?: boolean;
}

// 代码托管平台配置
export const CODE_PLATFORM_CONFIG: Record<ICodePlatform, ICodePlatformConfig> = {
  [CodePlatform.antcode]: {
    platform: CodePlatform.antcode,
    hostname: ['code.alipay.com', 'gitlab.alipay-inc.com', 'gitlab.antfin-inc.com'],
    origin: 'https://code.alipay.com',
    endpoint: 'https://code.alipay.com',
    brand: 'AntCode',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/^#L(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[1]];
        }
        matched = hash.match(/^#L(\d+):?(\d*)-(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[3]];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-${endLineNumber}`;
      },
    },
    createBranchAble: true,
  },
  [CodePlatform.code]: {
    platform: CodePlatform.code,
    hostname: [],
    origin: 'https://code.cloud.alipay.com',
    endpoint: 'https://twebgwnet.alipay.com',
    brand: 'Code',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/^#L(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[1]];
        }
        matched = hash.match(/^#L(\d+):?(\d*)-(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[3]];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-${endLineNumber}`;
      },
    },
    createBranchAble: true,
  },
  [CodePlatform.github]: {
    platform: CodePlatform.github,
    hostname: ['github.com'],
    origin: 'https://github.com',
    endpoint: 'https://api.github.com',
    brand: 'GitHub',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/L(\d+)(?:[^\dL]+)?(?:L(\d+))?/);
        if (matched) {
          return [+matched[1], +(matched[2] || matched[1])];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-L${endLineNumber}`;
      },
    },
  },
  [CodePlatform.gitlab]: {
    platform: CodePlatform.gitlab,
    hostname: ['gitlab.alibaba-inc.com', 'code.aone.alibaba-inc.com'],
    origin: 'https://gitlab.alibaba-inc.com',
    endpoint: 'https://gitlab.alibaba-inc.com',
    brand: 'GitLab',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/^#L(\d+)(?:-(\d+))?$/);
        if (matched) {
          return [+matched[1], +(matched[2] || matched[1])];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-${endLineNumber}`;
      },
    },
  },
  [CodePlatform.gitlink]: {
    platform: CodePlatform.gitlink,
    hostname: ['www.gitlink.org.cn'],
    origin: 'https://www.gitlink.org.cn',
    endpoint: 'https://www.gitlink.org.cn',
    brand: 'GitLink',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/^#L(\d+)(?:-(\d+))?$/);
        if (matched) {
          return [+matched[1], +(matched[2] || matched[1])];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-${endLineNumber}`;
      },
    },
    createBranchAble: false,
  },
  [CodePlatform.atomgit]: {
    platform: CodePlatform.atomgit,
    hostname: ['atomgit.com'],
    origin: 'https://atomgit.com/',
    endpoint: 'https://api.atomgit.com',
    brand: 'AtomGit',
    line: {
      parse(hash: string) {
        let matched: RegExpMatchArray | null = null;
        matched = hash.match(/^#L(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[1]];
        }
        matched = hash.match(/^#L(\d+):?(\d*)-(\d+):?(\d*)$/);
        if (matched) {
          return [+matched[1], +matched[3]];
        }
        return null;
      },
      format([startLineNumber, endLineNumber]) {
        if (startLineNumber === endLineNumber) {
          return `#L${startLineNumber}`;
        }
        return `#L${startLineNumber}-${endLineNumber}`;
      },
    },
    createBranchAble: true,
  }
};

export const extendPlatformConfig = (
  platform: ICodePlatform,
  data: {
    hostname?: string[];
    origin?: string;
    endpoint?: string;
    token?: string;
  }
) => {
  const config = CODE_PLATFORM_CONFIG[platform];
  if (!config) {
    return;
  }
  if (Array.isArray(data.hostname)) {
    config.hostname.push(...data.hostname);
  }
  if (data.origin) {
    config.origin = data.origin;
  }
  if (data.endpoint) {
    config.endpoint = data.endpoint;
  }
  if (data.token) {
    config.token = data.token;
  }
};
