import React from 'react';
import ReactDOM from 'react-dom';
import { GitFileSchemeModule } from '@alipay/alex-git';
import { AppRenderer, renderApp } from '../../api/renderApp';
import { StartupModule } from './startup.module';
import './languages';
import SarifViewer from '../../../extensions/cloud-ide-ext.sarif-viewer';
import css from '../../../extensions/alex.css-language-features-worker';
import html from '../../../extensions/alex.html-language-features-worker';
import json from '../../../extensions/alex.json-language-features-worker';
import markdown from '../../../extensions/alex.markdown-language-features-worker';
import typescript from '../../../extensions/alex.typescript-language-features-worker';

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
      // (window as any).app = app
      // app.service.fs.onFilesChanged(e => {
      //   e.forEach(async item => {
      //     console.log('>>>content', await app.service.fs.resolveContent(item.uri))
      //     console.log('>>>path', item.uri)
      //   })
      // })
    }}
    appConfig={{
      modules: [GitFileSchemeModule, StartupModule],
      extensionMetadata: [css, html, json, markdown, typescript],
      workspaceDir: project,
    }}
    runtimeConfig={{
      git: {
        baseURL: '/code-service',
        project,
        branch: query.branch,
        commit: query.commit,
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

// renderApp(document.getElementById('main')!, {
//   appConfig: {
//     modules: [StartupModule]
//   },
//   runtimeConfig: {
//     // TODO: 从 query 上取
//     git: {
//       baseURL: '/code-service',
//       project: query.project || 'ide-s/TypeScript-Node-Starter',
//       branch: query.branch,
//       commit: query.commit,
//     },
//   },
// });

// for test
(window as any).destroy = () => {
  ReactDOM.render(<div>destroyed</div>, document.getElementById('main'));
};
