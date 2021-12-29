import * as React from 'react';
import clsx from 'classnames';
import { TabRendererBase } from '@ali/ide-main-layout/lib/browser/tabbar/renderer.view';
import { LeftTabPanelRenderer } from '@ali/ide-main-layout/lib/browser/tabbar/panel.view';
import {
  ComponentRegistryInfo,
  useInjectable,
  CommandService,
  SlotLocation,
} from '@ali/ide-core-browser';
import {
  TabbarServiceFactory,
  TabbarService,
} from '@ali/ide-main-layout/lib/browser/tabbar/tabbar.service';
import { Domain, SlotRendererContribution, SlotRendererRegistry } from '@ali/ide-core-browser';

// 隐藏 activity-bar
const EmptyLeftTabbarRenderer: React.FC = () => {
  const tabbarService: TabbarService = useInjectable(TabbarServiceFactory)('left');
  tabbarService.barSize = 0;
  return <div style={{ width: 0 }} />;
};

const LeftTabRenderer = ({
  className,
  components,
}: {
  className: string;
  components: ComponentRegistryInfo[];
}) => (
  <TabRendererBase
    side="left"
    direction="left-to-right"
    className={clsx(className, 'left-slot')}
    components={components}
    TabbarView={EmptyLeftTabbarRenderer}
    TabpanelView={LeftTabPanelRenderer}
  />
);

@Domain(SlotRendererContribution)
export class CustomLeftSlotRenderContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry) {
    registry.registerSlotRenderer('left', LeftTabRenderer);
  }
}
