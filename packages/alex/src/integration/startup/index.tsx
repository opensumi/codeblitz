import React from 'react';
import ReactDOM from 'react-dom';
import {
  IAppInstance,
  AppRenderer,
  // requireModule,
  getDefaultLayoutConfig,
  SlotLocation,
} from '../..';
import { CodeServiceModule } from '@alipay/alex-code-service';
import { AntCodeModule, GitHubModule, GitLabModule } from '@alipay/alex-code-api';
import * as os from 'os';
import * as path from 'path';
import * as Alex from '../..';
import { isFilesystemReady, STORAGE_DIR, CodeServiceConfig } from '@alipay/alex-core';
import { StartupModule } from './startup.module';
import './languages';
import SarifViewer from '../../../extensions/cloud-ide-ext.sarif-viewer';
import css from '../../../extensions/alex.css-language-features-worker';
import html from '../../../extensions/alex.html-language-features-worker';
import json from '../../../extensions/alex.json-language-features-worker';
import markdown from '../../../extensions/alex.markdown-language-features-worker';
import typescript from '../../../extensions/alex.typescript-language-features-worker';

(window as any).alex = Alex;

isFilesystemReady().then(async () => {
  console.log('filesystem ready');
  // console.log(
  //   await requireModule('fs-extra').pathExists(
  //     path.join(os.homedir(), `${STORAGE_DIR}/settings.json`)
  //   )
  // );
});

const query = location.search
  .slice(1)
  .split('&')
  .reduce<Record<string, string>>((obj, pair) => {
    const [key, value] = pair.split('=');
    obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return obj;
  }, {});

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

const platform = (Object.keys(platformConfig).includes(query.platform)
  ? query.platform
  : 'antcode') as CodeServiceConfig['platform'];
const { module: CodeAPIModule, ...config } = platformConfig[platform];
if (query.project) {
  const [owner, name] = decodeURIComponent(query.project).split('/');
  Object.assign(config, { owner, name });
}
delete query.platform;
delete query.project;
Object.assign(config, query);

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
      extensionMetadata: [css, html, json, markdown, typescript],
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'editor.readonlyFiles': [
          '/workspace/antcode/internal_release/ifcriskcloudus/app/plugin/tcomponent/src/main/java/com/alipay/fc/riskcloud/plugin/tcomponent/util/StrategyDrmParserUtil.java',
        ],
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

window.reset = () => {
  ReactDOM.render(<App key="2" />, document.getElementById('main'));
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
    reset(): void;
  }
}
