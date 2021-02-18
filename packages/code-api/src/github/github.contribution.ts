import { Injectable } from '@ali/common-di';
import { ComponentContribution, ComponentRegistry, getIcon } from '@ali/ide-core-browser';
import { Domain } from '@ali/ide-core-common';
import { CODE_SERVICE_CONTAINER_ID } from '../common/constant';
import { GitHubView } from './github.view';

@Domain(ComponentContribution)
export class GithubContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'github',
      {
        component: GitHubView,
        id: 'github',
        name: 'GitHub',
      },
      {
        containerId: CODE_SERVICE_CONTAINER_ID,
        iconClass: getIcon('github-fill'),
        title: 'GitHub',
      }
    );
  }
}
