import * as React from 'react';
import clsx from 'classnames';
import { TabRendererBase } from '@ali/ide-main-layout/lib/browser/tabbar/renderer.view';
import { LeftTabPanelRenderer } from '@ali/ide-main-layout/lib/browser/tabbar/panel.view';
import {
  Domain,
  SlotRendererContribution,
  SlotRendererRegistry,
  ComponentRegistryInfo,
} from '@ali/ide-core-browser';
import { AcrLeftTabbarRenderer } from './acr-lefttabar-renderer';

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
    TabbarView={AcrLeftTabbarRenderer}
    TabpanelView={LeftTabPanelRenderer}
  />
);

@Domain(SlotRendererContribution)
export class CustomLeftSlotRenderContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry) {
    registry.registerSlotRenderer('left', LeftTabRenderer);
  }
}
