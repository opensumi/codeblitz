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
import { CodeAPIModule } from '@alipay/alex-code-api';
import * as Alex from '@alipay/alex';
import { isFilesystemReady } from '@alipay/alex-core';
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
    }}
    appConfig={{
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
        StartupModule,
      ],
      extensionMetadata: [css, html, json, markdown, typescript],
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'ide-dark',
      },
    }}
    runtimeConfig={{
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
