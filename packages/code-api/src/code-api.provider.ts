import { Autowired, ConstructorOf, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import { ClientAppContribution, Domain, getExternalIcon, getIcon, SlotLocation } from '@opensumi/ide-core-browser';
import { Deferred } from '@opensumi/ide-core-common';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { IIconService } from '@opensumi/ide-theme';
import { AtomGitAPIService } from './atomgit/atomgit.service';
import { CodeUPAPIService } from './codeup/codeup.service';
import { CODE_PLATFORM_CONFIG, ICodePlatformConfig } from './common';
import { CodePlatform, ICodeAPIProvider, ICodeAPIService, ICodePlatform } from './common/types';
import { GiteeAPIService } from './gitee/gitee.service';
import { GitHubAPIService } from './github/github.service';
import { GitHubView } from './github/github.view';
import { GitLabAPIService } from './gitlab/gitlab.service';
import { GitLabView } from './gitlab/gitlab.view';
import { GitLinkAPIService } from './gitlink/gitlink.service';

interface ICodePlatformAPIProvider {
  provider: ConstructorOf<ICodeAPIService>;
  config: ICodePlatformConfig;
  onCreate?: () => void;
}

@Domain(ClientAppContribution)
export class CodeAPIProvider implements ICodeAPIProvider, ClientAppContribution {
  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  @Autowired(IIconService)
  iconService: IIconService;

  private started = new Deferred<void>();

  private apiProviderMap = new Map<
    string,
    ICodePlatformAPIProvider
  >();
  private apiServiceMap = new Map<string, ICodeAPIService>();

  constructor() {
    this.registerPlatformProvider(CodePlatform.github, {
      provider: GitHubAPIService,
      onCreate: () => {
        this.started.promise.then(() => {
          this.mainLayoutService.collectTabbarComponent(
            [
              {
                component: GitHubView,
                id: 'github',
                name: 'GitHub',
              },
            ],
            {
              containerId: CodePlatform.github,
              iconClass: getExternalIcon('github'),
              title: 'GitHub',
            },
            SlotLocation.left,
          );
        });
      },
      config: CODE_PLATFORM_CONFIG[CodePlatform.github],
    });
    this.registerPlatformProvider(CodePlatform.gitlab, {
      provider: GitLabAPIService,
      onCreate: () => {
        this.started.promise.then(() => {
          this.mainLayoutService.collectTabbarComponent(
            [
              {
                component: GitLabView,
                id: 'gitlab',
                name: 'GitLab',
              },
            ],
            {
              containerId: CodePlatform.gitlab,
              iconClass: getIcon('Gitlab-fill'),
              title: 'GitLab',
            },
            SlotLocation.left,
          );
        });
      },
      config: CODE_PLATFORM_CONFIG[CodePlatform.gitlab],
    });
    this.registerPlatformProvider(CodePlatform.gitlink, {
      provider: GitLinkAPIService,
      config: CODE_PLATFORM_CONFIG[CodePlatform.gitlink],
    });
    this.registerPlatformProvider(CodePlatform.atomgit, {
      provider: AtomGitAPIService,
      config: CODE_PLATFORM_CONFIG[CodePlatform.atomgit],
    });
    this.registerPlatformProvider(CodePlatform.codeup, {
      provider: CodeUPAPIService,
      config: CODE_PLATFORM_CONFIG[CodePlatform.codeup],
    });
    this.registerPlatformProvider(CodePlatform.gitee, {
      provider: GiteeAPIService,
      config: CODE_PLATFORM_CONFIG[CodePlatform.gitee],
    });
  }

  registerPlatformProvider(
    platform: ICodePlatform,
    provider: ICodePlatformAPIProvider,
  ) {
    if (!this.apiProviderMap.has(platform)) {
      this.apiProviderMap.set(platform, provider);
    }
  }

  asPlatform(platform: ICodePlatform): ICodeAPIService {
    if (this.apiServiceMap.has(platform)) {
      return this.apiServiceMap.get(platform)!;
    }
    if (!this.apiProviderMap.has(platform)) {
      throw new Error(`[Code Service]: no api provider for ${platform}`);
    }
    const { provider, onCreate } = this.apiProviderMap.get(platform)!;
    const serviceInstance = this.injector.get(provider);
    this.apiServiceMap.set(platform, serviceInstance);
    onCreate?.();
    return serviceInstance;
  }

  get github() {
    return this.asPlatform(CodePlatform.github) as GitHubAPIService;
  }

  get gitlab() {
    return this.asPlatform(CodePlatform.gitlab) as GitLabAPIService;
  }

  get gitlink() {
    return this.asPlatform(CodePlatform.gitlink) as GitLinkAPIService;
  }

  get atomgit() {
    return this.asPlatform(CodePlatform.atomgit) as AtomGitAPIService;
  }

  get codeup() {
    return this.asPlatform(CodePlatform.codeup) as CodeUPAPIService;
  }

  getCodePlatformConfigs(): Record<string, ICodePlatformConfig> {
    const result = {} as Record<string, ICodePlatformConfig>;

    this.apiProviderMap.forEach((provider, key) => {
      result[key] = provider.config;
    });

    return result;
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
    const provider = this.apiProviderMap.get(platform);
    if (!provider) {
      return;
    }
    if (Array.isArray(data.hostname)) {
      provider.config.hostname.push(...data.hostname);
    }
    if (data.origin) {
      provider.config.origin = data.origin;
    }
    if (data.endpoint) {
      provider.config.endpoint = data.endpoint;
    }
    if (data.token) {
      provider.config.token = data.token;
    }
  }

  onStart() {
    this.started.resolve();
  }
}
