import * as React from 'react';
import { SlotLocation, SlotRenderer } from '@opensumi/ide-core-browser';
import { BoxPanel, SplitPanel } from '@opensumi/ide-core-browser/lib/components';

import { MergeRequestExplorerId } from '../modules/merge-request/common';
import { MenuBarId } from '../modules/menubar';

// 视图和slot插槽的对应关系
export const layoutConfig = {
  [SlotLocation.top]: {
    modules: [MenuBarId],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: [MergeRequestExplorerId],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.statusBar]: {
    modules: [
      // '@opensumi/ide-status-bar',
    ],
  },
  [SlotLocation.extra]: {
    modules: [],
  },
};

// 插槽的划分
export function LayoutComponent() {
  return (
    <BoxPanel direction="top-to-bottom">
      <SlotRenderer slot="top" z-index="unset" />
      <SplitPanel id="main-horizontal" flex={1}>
        <SlotRenderer slot="left" defaultSize={320} minResize={240} minSize={0} />
        <SlotRenderer flexGrow={1} minResize={300} slot="main" />
      </SplitPanel>
      {/* <SlotRenderer slot="statusBar" /> */}
    </BoxPanel>
  );
}
