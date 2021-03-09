import React from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer, SlotLocation, BoxPanel, SplitPanel, SlotRenderer } from '@alipay/alex/bundle';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages/html';
import '@alipay/alex/languages/handlebars';
import '@alipay/alex/languages/css';
import '@alipay/alex/languages/less';
import '@alipay/alex/languages/scss';
import '@alipay/alex/languages/javascript';
import '@alipay/alex/languages/typescript';
import '@alipay/alex/languages/json';

import ts from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import css from '@alipay/alex/extensions/alex.css-language-features-worker';
import html from '@alipay/alex/extensions/alex.html-language-features-worker';
import json from '@alipay/alex/extensions/alex.json-language-features-worker';
import md from '@alipay/alex/extensions/alex.markdown-language-features-worker';

export const layoutConfig = {
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@ali/ide-explorer'],
  },
  [SlotLocation.main]: {
    modules: ['@ali/ide-editor'],
  },
  // [SlotLocation.bottom]: {
  //   modules: ['@ali/ide-output', '@ali/ide-markers'],
  // },
  [SlotLocation.statusBar]: {
    modules: ['@ali/ide-status-bar'],
  },
};

const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SplitPanel overflow="hidden" id="main-horizontal" flex={1}>
      <SlotRenderer slot="left" minResize={220} minSize={49} />
      <SplitPanel id="main-vertical" minResize={300} flexGrow={1} direction="top-to-bottom">
        <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
        {/* <SlotRenderer flex={1} minResize={160} slot="bottom" /> */}
      </SplitPanel>
    </SplitPanel>
    <SlotRenderer slot="statusBar" />
  </BoxPanel>
);

const App: React.FC = () => {
  const [key, setKey] = React.useState(0);

  return (
    <div style={{ width: '100%', height: '100%', padding: 8 }}>
      <div style={{ height: 40 }}>
        <Button onClick={() => setKey((k) => k + 1)}>重置</Button>
      </div>
      <div style={{ height: 'calc(100% - 40px)', width: '50%' }}>
        <AppRenderer
          key={key}
          appConfig={{
            workspaceDir: 'playground',
            layoutConfig,
            layoutComponent: LayoutComponent,
            defaultPreferences: {
              'general.theme': 'ide-light',
            },
            panelSizes: {
              [SlotLocation.left]: 220,
            },
            extensionMetadata: [ts, json, html, css, md],
          }}
          runtimeConfig={{
            biz: 'test',
            disableModifyFileTree: true,
            defaultOpenFile: 'main.js',
            workspace: {
              filesystem: {
                fs: 'FileIndexSystem',
                options: {
                  requestFileIndex() {
                    return Promise.resolve({
                      'main.html': '<div id="root"></div>',
                      'main.css': 'body {}',
                      'main.js': 'console.log("main")',
                      'package.json': '{\n  "name": "Riddle"\n}',
                    });
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
