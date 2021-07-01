import { Domain, getIcon, localize } from '@ali/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@ali/ide-core-browser/lib/layout';

import { MergeRequestSummary } from './mr-summary';
import { MergeRequestExplorerId } from './common';
import { ChangeTreeView } from './changes-tree';
import { WebSCMView } from './web-scm';
import { MenuContribution, IMenuRegistry } from '@ali/ide-core-browser/lib/menu/next';

@Domain(ComponentContribution, MenuContribution)
export class MergeRequestContribution implements ComponentContribution, MenuContribution {
  // MR Explorer
  registerComponent(registry: ComponentRegistry) {
    // FIXME: 恰好借用 title 为空时不渲染高度，然后用他 titleComponent 展示 mr-summary
    registry.register(MergeRequestExplorerId, [ChangeTreeView, WebSCMView], {
      titleComponent: MergeRequestSummary,
      // title: 'Code review',
      iconClass: getIcon('PR'),
      priority: 1,
      containerId: MergeRequestExplorerId,
    });
  }

  registerMenus(menus: IMenuRegistry) {
    // 卸载左侧面板的右键菜单
    menus.unregisterMenuId(`accordion/${MergeRequestExplorerId}`);
  }
}
