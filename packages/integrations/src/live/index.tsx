import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, SlotLocation, BoxPanel, SlotRenderer } from '@alipay/alex';
import typescript from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import '@alipay/alex/languages/cpp';
import '@alipay/alex/languages/java';
import '@alipay/alex/languages/javascript';
import '@alipay/alex/languages/typescript';
import '@alipay/alex/languages/php';
import '@alipay/alex/languages/html';
import '@alipay/alex/languages/css';
import '@alipay/alex/languages/ruby';
import '@alipay/alex/languages/go';
import '@alipay/alex/languages/python';

import * as LivePlugin from './plugin';
import { StartupModule } from '../startup/startup.module';

export const layoutConfig = {
  [SlotLocation.main]: {
    modules: ['@ali/ide-editor'],
  },
};

const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
  </BoxPanel>
);

const App = () => {
  return (
    <div style={{ width: '50%', margin: 'auto', height: 700 }}>
      <AppRenderer
        appConfig={{
          modules: [StartupModule],
          plugins: [LivePlugin],
          workspaceDir: 'live',
          layoutConfig,
          layoutComponent: LayoutComponent,
          defaultPreferences: {
            'general.theme': 'ide-dark',
            'editor.scrollBeyondLastLine': false,
            'editor.autoSave': 'afterDelay',
            'editor.autoSaveDelay': 1000, // one second
          },
          extensionMetadata: [typescript],
        }}
        runtimeConfig={{
          biz: 'live',
          scenario: null,
          startupEditor: 'none',
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
