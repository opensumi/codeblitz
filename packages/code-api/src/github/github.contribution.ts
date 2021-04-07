import { Autowired } from '@ali/common-di';
import {
  ComponentContribution,
  ComponentRegistry,
  getExternalIcon,
  CommandRegistry,
  SlotLocation,
  ClientAppContribution,
} from '@ali/ide-core-browser';
import { CommandContribution, Domain } from '@ali/ide-core-common';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { IMainLayoutService } from '@ali/ide-main-layout';
import { GITHUB_CONTAINER_ID } from '../common/constant';
import { GitHubView } from './github.view';
import { GitHubService } from './github.service';
import { HelperService } from '../common/service';

@Domain(ComponentContribution, CommandContribution, ClientAppContribution)
export class GithubContribution
  implements ComponentContribution, CommandContribution, ClientAppContribution {
  @Autowired(ICodeAPIService)
  codeAPI: GitHubService;

  @Autowired()
  helper: HelperService;

  @Autowired(IMainLayoutService)
  layoutService: IMainLayoutService;

  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'github',
      {
        component: GitHubView,
        id: 'github',
        name: 'GitHub',
      },
      {
        containerId: GITHUB_CONTAINER_ID,
        iconClass: getExternalIcon('github'),
        title: 'GitHub',
      }
    );
  }

  registerCommands(registry: CommandRegistry) {
    registry.afterExecuteCommand(`workbench.view.${GITHUB_CONTAINER_ID}`, () => {
      this.codeAPI.getRateLimit();
    });
  }

  onDidStart() {
    if (this.codeAPI.shouldShowView) {
      this.helper.revealView(GITHUB_CONTAINER_ID);
    }

    this.layoutService
      .getTabbarService(SlotLocation.left)
      .onCurrentChange(({ currentId, previousId }) => {
        if (previousId !== currentId && currentId === GITHUB_CONTAINER_ID) {
          this.codeAPI.refresh();
        }
      });
  }
}
