import { Autowired } from '@ali/common-di';
import {
  ComponentContribution,
  ComponentRegistry,
  getIcon,
  ClientAppContribution,
} from '@ali/ide-core-browser';
import { Domain } from '@ali/ide-core-common';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { GITLAB_CONTAINER_ID } from '../common/constant';
import { GitLabView } from './gitlab.view';
import { GitLabService } from './gitlab.service';
import { HelperService } from '../common/service';

@Domain(ComponentContribution, ClientAppContribution)
export class GithubContribution implements ComponentContribution, ClientAppContribution {
  @Autowired(ICodeAPIService)
  codeAPI: GitLabService;

  @Autowired()
  helper: HelperService;

  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'gitlab',
      {
        component: GitLabView,
        id: 'gitlab',
        name: 'GitLab',
      },
      {
        containerId: GITLAB_CONTAINER_ID,
        iconClass: getIcon('Gitlab-fill'),
        title: 'GitLab',
      }
    );
  }

  onDidStart() {
    if (this.codeAPI.shouldShowView) {
      this.helper.revealView(GITLAB_CONTAINER_ID);
    }
  }
}
