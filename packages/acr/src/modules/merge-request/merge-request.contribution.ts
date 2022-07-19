import {
  Domain,
  getIcon,
  SlotLocation,
  ComponentContribution,
  ComponentRegistry,
  ClientAppContribution,
  WithEventBus,
} from '@opensumi/ide-core-browser';
import { Autowired } from '@opensumi/di';

import { MergeRequestSummary } from './mr-summary';
import { MergeRequestExplorerId } from './common';
import { ChangeTreeView } from './changes-tree';
import { WebSCMView } from './web-scm';
import { MenuContribution, IMenuRegistry } from '@opensumi/ide-core-browser/lib/menu/next';
import { LayoutState, LAYOUT_STATE } from '@opensumi/ide-core-browser/lib/layout/layout-state';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { disposableCollection } from '@alipay/alex/lib/core/patch';
import { AccordionService } from '@opensumi/ide-main-layout/lib/browser/accordion/accordion.service';
import { WebSCMViewId } from './web-scm/common';
import { ChangesTreeViewId } from './changes-tree/common';
@Domain(ComponentContribution, MenuContribution, ClientAppContribution)
export class MergeRequestContribution
  extends WithEventBus
  implements ComponentContribution, MenuContribution, ClientAppContribution
{
  @Autowired(IMainLayoutService)
  layoutService: IMainLayoutService;

  @Autowired(ComponentRegistry)
  componentRegistry: ComponentRegistry;

  @Autowired()
  private layoutState: LayoutState;

  registerComponent(registry: ComponentRegistry) {
    registry.register(MergeRequestExplorerId, [ChangeTreeView, WebSCMView], {
      titleComponent: MergeRequestSummary,
      iconClass: getIcon('explorer'),
      priority: 10,
      containerId: MergeRequestExplorerId,
    });
  }

  onDidStart() {
    // TODO 重新载入 titleMenu有缓存 需将其重置
    disposableCollection.push((injector) => {
      const accordionService: AccordionService = injector
        .get(IMainLayoutService)
        .getAccordionService(MergeRequestExplorerId);
      const views = accordionService.visibleViews.filter(
        (view) => view.id === WebSCMViewId || view.id === ChangesTreeViewId
      );
      if (views.length) {
        views.forEach((view) => (view.titleMenu = undefined));
      }
      accordionService.disposeView(WebSCMViewId);
      accordionService.disposeView(ChangesTreeViewId);
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
