import { Autowired, Injector, INJECTOR_TOKEN, ConstructorOf } from '@ali/common-di';
import { Deferred } from '@ali/ide-core-common';
import {
  SlotLocation,
  getIcon,
  Domain,
  ClientAppContribution,
  getExternalIcon,
} from '@ali/ide-core-browser';
import { IMainLayoutService } from '@ali/ide-main-layout';
import { ICodePlatform, ICodeAPIProvider, ICodeAPIService, CodePlatform } from './common/types';
import { AntCodeAPIService } from './antcode/antcode.service';
import { GitHubAPIService } from './github/github.service';
import { GitLabAPIService } from './gitlab/gitlab.service';
import { GitHubView } from './github/github.view';
import { GitLabView } from './gitlab/gitlab.view';

@Domain(ClientAppContribution)
export class CodeAPIProvider implements ICodeAPIProvider, ClientAppContribution {
  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  private started = new Deferred<void>();

  private apiProviderMap = new Map<
    ICodePlatform,
    {
      provider: ConstructorOf<ICodeAPIService>;
      onCreate?: () => void;
    }
  >();
  private apiServiceMap = new Map<ICodePlatform, ICodeAPIService>();

  constructor() {
    this.registerPlatformProvider(CodePlatform.antcode, {
      provider: AntCodeAPIService,
    });
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
            SlotLocation.left
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
            SlotLocation.left
          );
        });
      },
    });
  }

  registerPlatformProvider(
    platform: ICodePlatform,
    provider: { provider: ConstructorOf<ICodeAPIService>; onCreate?: () => void }
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

  onStart() {
    this.started.resolve();
  }
}
