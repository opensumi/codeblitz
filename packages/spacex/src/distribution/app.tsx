import '@ali/ide-i18n/lib/browser'
import { SlotLocation } from '@ali/ide-core-browser'
import { loadMonaco } from '@ali/ide-monaco/lib/browser/monaco-loader'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ClientModules, ServerModules } from './module'
import { createApp } from '../createApp'

// 引入公共样式文件
import '@ali/ide-core-browser/lib/style/index.less'

import '../styles.less'
import { LayoutComponent } from '../layout'

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
}

loadMonaco({
  monacoCDNBase: 'https://g.alicdn.com/tb-ide/monaco-editor-core/0.17.0/',
})

createApp({
  modules: ClientModules,
  serverModules: ServerModules,
  layoutConfig,
  layoutComponent: LayoutComponent,
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: 'https://dev.g.alicdn.com/tao-ide/ide-lite/0.0.1/worker-host.js',
  defaultPreferences: {
    'general.theme': 'Default Dark+',
    'general.icon': 'vscode-icons',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 100,
    'editor.quickSuggestionsMaxCount': 50,
    'editor.scrollBeyondLastLine': false,
    'general.language': 'en-US',
  },
  workspaceDir: '/root/SpaceX',
}).then(async (app) => {
  await app.start(document.getElementById('main')!)
  const loadingDom = document.getElementById('loading')
  if (loadingDom) {
    loadingDom.classList.add('loading-hidden')
    loadingDom.remove()
  }
})
