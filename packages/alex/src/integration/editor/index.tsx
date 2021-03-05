import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, SlotLocation, BoxPanel, SlotRenderer } from '../..';
// import * as os from 'os';
// import * as path from 'path';
import * as Alex from '../..';
// import '../startup/languages';
import { EditorOverrideModule } from './editor-override.module';
import './style.module.less';

(window as any).alex = Alex;

ReactDOM.render(
  <div style={{ width: '50%', height: '50%' }}>
    <AppRenderer
      onLoad={(app) => {
        window.app = app;
      }}
      appConfig={{
        modules: [EditorOverrideModule],
        workspaceDir: 'editor',
        layoutConfig: {
          [SlotLocation.main]: {
            modules: ['@ali/ide-editor'],
          },
        },
        layoutComponent: () => (
          <BoxPanel direction="top-to-bottom">
            <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
          </BoxPanel>
        ),
        defaultPreferences: {
          'general.theme': 'ide-light',
          'editor.scrollBeyondLastLine': false,
        },
      }}
      runtimeConfig={{
        scenario: null,
        defaultOpenFile: 'main.js',
        workspace: {
          filesystem: {
            fs: 'FileIndexSystem',
            options: {
              requestFileIndex() {
                return Promise.resolve({
                  'main.js': 'console.log(123)',
                });
              },
            },
          },
        },
      }}
    />
  </div>,
  document.getElementById('main')
);

// for test
window.destroy = () => {
  ReactDOM.render(<div>destroyed</div>, document.getElementById('main'));
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
  }
}
