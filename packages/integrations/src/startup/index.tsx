import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, getDefaultLayoutConfig, SlotLocation } from '@alipay/alex';
import * as Alex from '@alipay/alex';
import '@alipay/alex/languages';
import { CodeServiceModule } from '@alipay/alex-code-service';
import { CodeAPIModule } from '@alipay/alex-code-api';
import { isFilesystemReady } from '@alipay/alex-core';
import { StartupModule } from './startup.module';
import SarifViewer from '@alipay/alex/extensions/cloud-ide-ext.sarif-viewer';
import css from '@alipay/alex/extensions/alex.css-language-features-worker';
import html from '@alipay/alex/extensions/alex.html-language-features-worker';
import json from '@alipay/alex/extensions/alex.json-language-features-worker';
import markdown from '@alipay/alex/extensions/alex.markdown-language-features-worker';
import typescript from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import lsif from '@alipay/alex/extensions/cloud-ide.vscode-lsif';
import gitlens from '@alipay/alex/extensions/alex.gitlens';
import graph from '@alipay/alex/extensions/alex.git-graph';
import codeservice from '@alipay/alex/extensions/alex.code-service';
import imagePreview from '@alipay/alex/extensions/alex.image-preview';

import { LocalExtensionModule } from '../common/local-extension.module';
import * as Plugin from '../editor/plugin';

(window as any).alex = Alex;

isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const platformConfig = {
  antcode: {
    owner: 'kaitian',
    name: 'ide-framework',
  },
  github: {
    owner: 'microsoft',
    name: 'vscode',
  },
  gitlab: {
    owner: 'kaitian',
    name: 'ide-framework',
  },
};

const layoutConfig = getDefaultLayoutConfig();
layoutConfig[SlotLocation.left].modules.push('@ali/ide-extension-manager');

let pathParts = location.pathname.split('/').filter(Boolean);

const platform: any = pathParts[0] in platformConfig ? pathParts[0] : 'antcode';

const config = platformConfig[platform];
if (pathParts[1]) {
  config.owner = pathParts[1];
}
if (pathParts[2]) {
  config.name = pathParts[2];
}
config.refPath = pathParts.slice(3).join('/');

const App = () => (
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
      window.testPlugin = () => {
        const commands = Plugin.api.commands;
        if (commands) {
          commands.executeCommand('plugin.command.test', 1, 2);
        }
      };
    }}
    appConfig={{
      plugins: [Plugin],
      modules: [
        CodeServiceModule.Config({
          platform,
          owner: config.owner,
          name: config.name,
          refPath: config.refPath,
          hash: location.hash,
          antcode: {
            endpoint: '/code-service',
            // for test environment
            // endpoint: '/code-test',
            // origin: 'http://code.test.alipay.net:9009/code-test'
          },
        }),
        CodeAPIModule,
        LocalExtensionModule,
        StartupModule,
      ],
      extensionMetadata: [
        css,
        html,
        json,
        markdown,
        typescript,
        codeservice,
        gitlens,
        graph,
        imagePreview,
      ],
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'ide-light',
      },
    }}
    runtimeConfig={{
      biz: 'alex',
      // unregisterActivityBarExtra: true,
      // hideLeftTabBar: true
    }}
  />
);

let key = 0;
const render = () => ReactDOM.render(<App key={key++} />, document.getElementById('main'));
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy ? ReactDOM.render(<div>destroyed</div>, document.getElementById('main')) : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
