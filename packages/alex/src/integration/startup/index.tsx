import '@ali/ide-i18n/lib/browser';
import { SlotLocation } from '@ali/ide-core-browser';
import { loadMonaco } from '@ali/ide-monaco/lib/browser/monaco-loader';

import { Modules } from './module';
import { createWorkspace } from '../../api/createWorkspace';

// 引入公共样式文件
import '@ali/ide-core-browser/lib/style/index.less';

import { LayoutComponent } from './layout';
import vsicons from '../../../extensions/kaitian.vsicons-slim';
import theme from '../../../extensions/cloud-ide.alipay-geek-theme';

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
  [SlotLocation.extra]: {
    modules: [],
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

// TODO: 从 query 上取
const GIT_PROJECT = 'ide-s/TypeScript-Node-Starter';

loadMonaco({
  // monacoCDNBase: 'https://g.alicdn.com/tb-ide/monaco-editor-core/0.17.0/',
  monacoCDNBase: 'https://dev.g.alicdn.com/tb-ide/monaco-editor-core/0.17.99/',
});

createWorkspace(document.getElementById('main')!, {
  modules: Modules,
  layoutConfig,
  layoutComponent: LayoutComponent,
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: process.env.WORKER_HOST,
  webviewEndpoint: process.env.WEBVIEW_ENDPOINT,
  defaultPreferences: {
    'general.theme': 'alipay-geek-dark',
    'general.icon': 'vsicons-slim',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 10,
    'editor.quickSuggestionsMaxCount': 50,
    'editor.scrollBeyondLastLine': false,
    'general.language': 'zh-CN',
  },
  staticServicePath: location.origin,
  // workspaceDir: '/',
  runtimeConfig: {
    git: {
      project: GIT_PROJECT,
    },
    memfs: {
      fileIndex: {
        'README.md': '# memfs\n> memfs module test',
        src: {
          'main.js': 'function add(x, y) {\n  return x + y;\n}',
          'main.css': 'body {\n  color: "black";\n}',
        },
        'index.html': '<div id="root"></div>',
        'package.json': '{\n  "name": "memfs"\n}',
      },
      defaultOpenFile: 'src/main.js',
    },
    scene: 'project',
  },
  serverOptions: {
    extensionMetadata: [vsicons, theme],
  },
});
