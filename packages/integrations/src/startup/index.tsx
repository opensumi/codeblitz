import React from 'react';
import ReactDOM from 'react-dom';
import {
  IAppInstance,
  AppRenderer,
  // requireModule,
  getDefaultLayoutConfig,
  SlotLocation,
} from '@alipay/alex';
import { CodeServiceModule } from '@alipay/alex-code-service';
import { AntCodeModule, GitHubModule, GitLabModule } from '@alipay/alex-code-api';
import * as os from 'os';
import * as path from 'path';
import * as Alex from '@alipay/alex';
import { isFilesystemReady, STORAGE_DIR, CodeServiceConfig } from '@alipay/alex-core';
import { StartupModule } from './startup.module';
import '../common/languages';
import SarifViewer from '@alipay/alex/extensions/cloud-ide-ext.sarif-viewer';
import css from '@alipay/alex/extensions/alex.css-language-features-worker';
import html from '@alipay/alex/extensions/alex.html-language-features-worker';
import json from '@alipay/alex/extensions/alex.json-language-features-worker';
import markdown from '@alipay/alex/extensions/alex.markdown-language-features-worker';
import typescript from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import lsif from '@alipay/alex/extensions/cloud-ide.vscode-lsif';

(window as any).alex = Alex;

isFilesystemReady().then(async () => {
  console.log('filesystem ready');
  // console.log(
  //   await requireModule('fs-extra').pathExists(
  //     path.join(os.homedir(), `${STORAGE_DIR}/settings.json`)
  //   )
  // );
});

// const query = location.search
//   .slice(1)
//   .split('&')
//   .reduce<Record<string, string>>((obj, pair) => {
//     const [key, value] = pair.split('=');
//     obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
//     return obj;
//   }, {});

const platformConfig = {
  antcode: {
    module: AntCodeModule,
    platform: 'antcode',
    owner: 'kaitian',
    name: 'ide-framework',
    origin: 'https://code.alipay.com',
    endpoint: '/code-service',
  },
  github: {
    module: GitHubModule,
    platform: 'github',
    owner: 'microsoft',
    name: 'vscode',
    origin: 'https://github.alipay.com',
    endpoint: 'https://api.github.com',
  },
  gitlab: {
    module: GitLabModule,
    platform: 'gitlab',
    owner: 'kaitian',
    name: 'ide-framework',
    origin: 'http://gitlab.alibaba-inc.com',
  },
};

const layoutConfig = getDefaultLayoutConfig();

let pathParts = location.pathname.split('/').filter(Boolean);

const platform = pathParts[0] in platformConfig ? pathParts[0] : 'antcode';

// const platform = (Object.keys(platformConfig).includes(query.platform)
//   ? query.platform
//   : 'antcode') as CodeServiceConfig['platform'];
const { module: CodeAPIModule, ...config } = platformConfig[platform];
if (pathParts[1]) {
  config.owner = pathParts[1];
}
if (pathParts[2]) {
  config.name = pathParts[2];
}
config.refPath = pathParts.slice(3).join('/');

if (platform === 'github' || platform === 'gitlab') {
  layoutConfig[SlotLocation.left].modules.push(platform);
}

const App = () => (
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
    }}
    appConfig={{
      modules: [CodeServiceModule, CodeAPIModule, StartupModule],
      extensionMetadata: [css, html, json, markdown, typescript, lsif],
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'ide-dark',
      },
    }}
    runtimeConfig={{
      codeService: config as CodeServiceConfig,
      biz: 'alex',
      // unregisterActivityBarExtra: true,
      // hideLeftTabBar: true
    }}
  />
);

ReactDOM.render(<App key="1" />, document.getElementById('main'));

// for test
window.destroy = () => {
  ReactDOM.render(<div>destroyed</div>, document.getElementById('main'));
};

let key = 0;
window.reset = () => {
  ReactDOM.render(<App key={key++} />, document.getElementById('main'));
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
    reset(): void;
  }
}
