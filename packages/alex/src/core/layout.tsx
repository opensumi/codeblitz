import * as React from 'react';
import { SlotRenderer, SlotLocation } from '@ali/ide-core-browser';
import { BoxPanel, SplitPanel } from '@ali/ide-core-browser/lib/components';

export function LayoutComponent(): React.ReactElement {
  return (
    <BoxPanel direction="top-to-bottom">
      <SlotRenderer slot="top" />
      <SplitPanel overflow="hidden" id="main-horizontal" flex={1}>
        <SlotRenderer slot="left" defaultSize={310} minResize={204} minSize={49} />
        <SplitPanel id="main-vertical" minResize={300} flexGrow={1} direction="top-to-bottom">
          <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
          <SlotRenderer flex={1} minResize={160} slot="bottom" />
        </SplitPanel>
      </SplitPanel>
      <SlotRenderer slot="statusBar" />
    </BoxPanel>
  );
}

export const layoutConfig = {
  [SlotLocation.top]: {
    modules: ['@ali/ide-menu-bar'],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@ali/ide-explorer'],
  },
  [SlotLocation.main]: {
    modules: ['@ali/ide-editor'],
  },
  [SlotLocation.bottom]: {
    modules: ['@ali/ide-output', '@ali/ide-markers'],
  },
  [SlotLocation.statusBar]: {
    modules: ['@ali/ide-status-bar'],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
};
