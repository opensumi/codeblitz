import { SlotLocation, SlotRenderer } from '@opensumi/ide-core-browser';
import { BoxPanel, SplitPanel } from '@opensumi/ide-core-browser/lib/components';
import * as React from 'react';

export function LayoutComponent(): React.ReactElement {
  return (
    <BoxPanel direction='top-to-bottom'>
      <SlotRenderer slot='top' />
      <SplitPanel overflow='hidden' id='main-horizontal' flex={1}>
        <SlotRenderer slot='left' defaultSize={310} minResize={204} minSize={49} />
        <SplitPanel id='main-vertical' minResize={300} flexGrow={1} direction='top-to-bottom'>
          <SlotRenderer flex={2} flexGrow={1} minResize={200} slot='main' />
          <SlotRenderer flex={1} minResize={160} slot='bottom' />
        </SplitPanel>
      </SplitPanel>
      <SlotRenderer slot='statusBar' />
    </BoxPanel>
  );
}

export const getDefaultLayoutConfig = () => ({
  [SlotLocation.top]: {
    modules: ['@opensumi/ide-menu-bar'],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer', '@opensumi/ide-search'],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.bottom]: {
    modules: ['@opensumi/ide-output', '@opensumi/ide-markers'],
  },
  [SlotLocation.statusBar]: {
    modules: ['@opensumi/ide-status-bar'],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
});

export function EditorLayoutComponent(): React.ReactElement {
  return (
    <BoxPanel direction='top-to-bottom'>
      <SlotRenderer flex={2} flexGrow={1} minResize={200} slot='main' />
    </BoxPanel>
  );
}

export const getEditorLayoutConfig = () => ({
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
});
