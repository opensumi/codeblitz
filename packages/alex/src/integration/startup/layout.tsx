import * as React from 'react';
import { SlotRenderer } from '@ali/ide-core-browser';
import { BoxPanel, SplitPanel } from '@ali/ide-core-browser/lib/components';

// 插槽的划分
export function LayoutComponent() {
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
