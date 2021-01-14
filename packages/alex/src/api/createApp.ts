import { ClientApp, EXTENSION_DIR, IClientAppOpts } from '@alipay/alex-core';

export function createApp(opts: IClientAppOpts) {
  const appOpts: IClientAppOpts = {
    modules: [],
    useCdnIcon: true,
    noExtHost: true,
    extWorkerHost: __WORKER_HOST__,
    webviewEndpoint: __WEBVIEW_ENDPOINT__,
    defaultPreferences: {
      'general.theme': 'alipay-geek-dark',
      'general.icon': 'vsicons-slim',
      'application.confirmExit': 'never',
      'editor.quickSuggestionsDelay': 10,
      'editor.quickSuggestionsMaxCount': 50,
      'editor.scrollBeyondLastLine': false,
      'general.language': 'zh-CN',
    },
    staticServicePath: location.origin,
    workspaceDir: '',
    extensionDir: EXTENSION_DIR,
  };

  const { defaultPreferences, ...restOpts } = opts;
  if (defaultPreferences) {
    Object.assign(appOpts.defaultPreferences, defaultPreferences);
  }
  Object.assign(appOpts, restOpts);

  const app = new ClientApp(appOpts);

  return app;
}
