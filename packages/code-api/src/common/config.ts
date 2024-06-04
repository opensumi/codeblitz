import { CodePlatform } from './types';

export interface ICodePlatformConfig {
  platform: CodePlatform | string;
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
  [key: string]: any;
}

// 代码托管平台配置
const CODE_PLATFORM_CONFIG: Record<string, ICodePlatformConfig> = {
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
    createBranchAble: true,
  },
  [CodePlatform.gitlab]: {
    platform: CodePlatform.gitlab,
    hostname: ['gitlab.cn'],
    origin: 'https://gitlab.cn',
    endpoint: 'https://gitlab.cn',
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
    origin: 'https://atomgit.com',
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
  },
  [CodePlatform.codeup]: {
    platform: CodePlatform.codeup,
    hostname: ['codeup.aliyun.com'],
    origin: 'https://codeup.aliyun.com',
    endpoint: 'https://codeup.aliyun.com',
    brand: 'Codeup',
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
  [CodePlatform.gitee]: {
    platform: CodePlatform.gitee,
    hostname: ['gitee.com'],
    origin: 'https://gitee.com',
    endpoint: 'https://gitee.com',
    brand: 'Gitee',
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
};


export class CodePlatformRegistry {
  protected platformMap = new Map<string, ICodePlatformConfig>();

  protected constructor() {
    this.load(CODE_PLATFORM_CONFIG);
  }

  protected static _instance: CodePlatformRegistry;
  static instance() {
    if (!CodePlatformRegistry._instance) {
      CodePlatformRegistry._instance = new CodePlatformRegistry();
    }
    return CodePlatformRegistry._instance;
  }

  registerPlatformConfig(
    platform: string,
    provider: ICodePlatformConfig,
  ) {
    if (!this.platformMap.has(platform)) {
      this.platformMap.set(platform, provider);
    }
  }

  getPlatformConfig(platform: string): ICodePlatformConfig {
    if (this.platformMap.has(platform)) {
      return this.platformMap.get(platform)!;
    }
    throw new Error(`[Code API]: no config found for ${platform}`);
  }

  extendPlatformConfig(
    platform: string,
    data: {
      hostname?: string[] | undefined;
      origin?: string | undefined;
      endpoint?: string | undefined;
      token?: string | undefined;
    },
  ): void {
    const provider = this.platformMap.get(platform);
    if (!provider) {
      return;
    }
    if (Array.isArray(data.hostname)) {
      provider.hostname.push(...data.hostname);
    }
    if (data.origin) {
      provider.origin = data.origin;
    }
    if (data.endpoint) {
      provider.endpoint = data.endpoint;
    }
    if (data.token) {
      provider.token = data.token;
    }
  }

  load(configs: Record<string, ICodePlatformConfig>) {
    Object.keys(configs).forEach((key) => {
      this.registerPlatformConfig(key, configs[key]);
    });
  }

  getCodePlatformConfigs(): Record<string, ICodePlatformConfig> {
    const result = {} as Record<string, ICodePlatformConfig>;

    this.platformMap.forEach((config, key) => {
      result[key] = config;
    });

    return result;
  }
}
