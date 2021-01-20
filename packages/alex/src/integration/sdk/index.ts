import { renderApp } from '../../api/renderApp';

renderApp(document.getElementById('main')!, {
  appConfig: (config) => {
    config.workspaceDir = 'alex';
    return config;
  },
});
