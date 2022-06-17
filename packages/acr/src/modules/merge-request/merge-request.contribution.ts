import { Domain, getIcon, localize } from '@opensumi/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser/lib/layout';

import { MergeRequestSummary } from './mr-summary';
import { MergeRequestExplorerId } from './common';
import { ChangeTreeView } from './changes-tree';
import { WebSCMView } from './web-scm';
import { MenuContribution, IMenuRegistry } from '@opensumi/ide-core-browser/lib/menu/next';

@Domain(ComponentContribution, MenuContribution)
export class MergeRequestContribution implements ComponentContribution, MenuContribution {
  // MR Explorer
  registerComponent(registry: ComponentRegistry) {
    registry.register(MergeRequestExplorerId, [ChangeTreeView, WebSCMView], {
      titleComponent: MergeRequestSummary,
      iconClass: getIcon('explorer'),
      priority: 10,
      containerId: MergeRequestExplorerId,
    });
  }

  registerMenus(menus: IMenuRegistry) {
    // 卸载左侧面板的右键菜单
    menus.unregisterMenuId(`accordion/${MergeRequestExplorerId}`);
    // 卸载配置菜单
    menus.unregisterMenuId(`activityBar/extra`);
    // 卸载左侧右键菜单
    menus.unregisterMenuId(`tabbar/left`);
  }
}
