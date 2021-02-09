import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, requireModule } from '../..';
import { CodeServiceModule } from '@alipay/alex-code-service';
import * as os from 'os';
import * as path from 'path';
import * as Alex from '../..';
import { isFilesystemReady, STORAGE_DIR } from '@alipay/alex-core';
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
  console.log(
    await requireModule('fs-extra').pathExists(
      path.join(os.homedir(), `${STORAGE_DIR}/settings.json`)
    )
  );
});

const query = location.search
  .slice(1)
  .split('&')
  .reduce<Record<string, string>>((obj, pair) => {
    const [key, value] = pair.split('=');
    obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return obj;
  }, {});

const project = query.project || 'ide-s/TypeScript-Node-Starter';

ReactDOM.render(
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
    }}
    appConfig={{
      modules: [CodeServiceModule, StartupModule],
      extensionMetadata: [css, html, json, markdown, typescript],
      workspaceDir: project,
    }}
    runtimeConfig={{
      codeService: {
        platform: 'antcode',
        baseURL: '/code-service',
        project,
        branch: query.branch,
        commit: query.commit,
        transformStaticResource({ baseURL, project, commit, path }) {
          return `${baseURL}/${project}/raw/${commit}/${path}`;
        },
      },
      // workspace: {
      //   filesystem: {
      //     fs: 'FileIndexSystem',
      //     options: {
      //       requestFileIndex() {
      //         return Promise.resolve({
      //           'main.html': '<div id="root"></div>',
      //           'main.css': 'body {}',
      //           'main.js': 'console.log("main")',
      //           'package.json': '{\n  "name": "Riddle"\n}',
      //         })
      //       }
      //     }
      //   }
      // }
    }}
  />,
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
