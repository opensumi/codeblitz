import { SlotLocation } from '@ali/ide-core-browser';
import { renderApp } from '../../api/renderApp';
import { LayoutComponent } from './layout';
import { GitFileSchemeModule, MenuBarModule } from '../../core/modules';

// 视图和slot插槽的对应关系
const layoutConfig = {
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

renderApp(document.getElementById('main')!, {
  appConfig: (config) => {
    config.modules.push(GitFileSchemeModule);
    config.layoutConfig = layoutConfig;
    config.layoutComponent = LayoutComponent;
    config.workspaceDir = 'ide-s/TypeScript-Node-Starter';
    return config;
  },
  runtimeConfig: {
    // TODO: 从 query 上取
    git: {
      project: 'ide-s/TypeScript-Node-Starter',
      commit: '3b887f70532f9b17e4502f5956531903e6449a91',
    },
  },
});
