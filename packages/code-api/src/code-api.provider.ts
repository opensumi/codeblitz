import { Autowired, ConstructorOf, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import { ClientAppContribution, Domain, getExternalIcon, getIcon, SlotLocation } from '@opensumi/ide-core-browser';
import { Deferred } from '@opensumi/ide-core-common';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { IIconService } from '@opensumi/ide-theme';
import { AtomGitAPIService } from './atomgit/atomgit.service';
import { CodeUPAPIService } from './codeup/codeup.service';
import { CodePlatformRegistry, ICodePlatformConfig } from './common';
import {
  CodePlatform,
  ICodeAPIProvider,
  ICodeAPIService,
  ICodePlatform,
  ICodePlatformAPIProvider,
} from './common/types';
import { GiteeAPIService } from './gitee/gitee.service';
import { GitHubAPIService } from './github/github.service';
import { GitHubView } from './github/github.view';
import { GitLabAPIService } from './gitlab/gitlab.service';
import { GitLabView } from './gitlab/gitlab.view';
import { GitLinkAPIService } from './gitlink/gitlink.service';

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
    });
    this.registerPlatformProvider(CodePlatform.gitlink, {
      provider: GitLinkAPIService,
    });
    this.registerPlatformProvider(CodePlatform.atomgit, {
      provider: AtomGitAPIService,
    });
    this.registerPlatformProvider(CodePlatform.codeup, {
      provider: CodeUPAPIService,
    });
    this.registerPlatformProvider(CodePlatform.gitee, {
      provider: GiteeAPIService,
    });
  }

  registerPlatformProvider(
    platform: string,
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

  onStart() {
    this.started.resolve();
  }
}
