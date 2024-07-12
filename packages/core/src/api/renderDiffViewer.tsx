import { deletionLogPath } from '@codeblitzjs/ide-browserfs/lib/backend/OverlayFS';
import {
  FILES_DEFAULTS,
  ModuleConstructor,
  randomString,
  SlotLocation,
  SlotRenderer,
} from '@opensumi/ide-core-browser';
import merge from 'lodash/merge';
import React from 'react';
import { IDiffViewerProps } from '../core/diff-viewer';
import { DiffViewerModule } from '../core/diff-viewer/module';
import { BoxPanel, SplitPanel } from '../editor';
import { Injector } from '../modules/opensumi__common-di';
import { AppRenderer, IAppRendererProps } from './renderApp';

export const defaultLayoutConfig = {
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
};

export function DiffViewerLayoutComponent(): React.ReactElement {
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

export const DiffViewerRenderer = (props: IDiffViewerProps) => {
  if (!props.appConfig) {
    props.appConfig = {};
  }

  if (!props.appConfig.injector) {
    props.appConfig.injector = new Injector();
  }

  const injector = props.appConfig.injector;

  injector.addProviders({
    token: IDiffViewerProps,
    useValue: props,
  });

  const appConfig = props.appConfig;

  const appModules: ModuleConstructor[] = appConfig?.modules || [];
  if (!appModules.includes(DiffViewerModule)) {
    appModules.unshift(DiffViewerModule);
  }
  delete appConfig?.modules;

  const defaultPreferences = appConfig?.defaultPreferences || {};
  delete appConfig?.defaultPreferences;

  const workspaceDir = appConfig?.workspaceDir || 'workspace-' + randomString(8);
  delete appConfig?.workspaceDir;

  const layoutConfig = appConfig?.layoutConfig || defaultLayoutConfig;
  delete appConfig?.layoutConfig;

  const layoutComponent = appConfig?.layoutComponent || DiffViewerLayoutComponent;
  delete appConfig?.layoutComponent;

  const diffViewerAppConfig: IAppRendererProps = merge({
    appConfig: {
      modules: appModules,
      workspaceDir,
      layoutComponent,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'opensumi-light',
        'editor.minimap': false,
        'ai.native.inlineDiff.preview.mode': 'inlineLive',
        'editor.autoSave': 'afterDelay',
        'application.confirmExit': 'never',
        'editor.guides.bracketPairs': false,
        'editor.quickSuggestionsDelay': 10,
        'editor.autoSaveDelay': 1000, // one second
        'editor.fixedOverflowWidgets': true, // widget editor 默认改为 fixed
        'editor.unicodeHighlight.ambiguousCharacters': false,
        'files.exclude': {
          ...FILES_DEFAULTS.filesExclude,
          // browserfs OverlayFS 用来记录删除的文件
          [`**${deletionLogPath}`]: true,
        },
        ...defaultPreferences,
      },
      ...appConfig,
    },
    runtimeConfig: merge({
      aiNative: {
        enable: true,
        capabilities: {
          supportsInlineChat: true,
        },
      },
      startupEditor: 'none',
      workspace: {
        filesystem: {
          fs: 'InMemory',
          options: {},
        },
      },
    }, props.runtimeConfig),
  });

  return (
    <AppRenderer
      {...diffViewerAppConfig}
    />
  );
};