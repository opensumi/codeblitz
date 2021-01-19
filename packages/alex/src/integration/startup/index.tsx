import React from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer, renderApp } from '../../api/renderApp';
import { StartupModule } from './startup.module';
import './languages';

const query = location.search
  .slice(1)
  .split('&')
  .reduce<Record<string, string>>((obj, pair) => {
    const [key, value] = pair.split('=');
    obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return obj;
  }, {});

ReactDOM.render(
  <AppRenderer
    appConfig={{
      modules: [StartupModule],
    }}
    runtimeConfig={{
      git: {
        baseURL: '/code-service',
        project: query.project || 'ide-s/TypeScript-Node-Starter',
        branch: query.branch,
        commit: query.commit,
      },
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
