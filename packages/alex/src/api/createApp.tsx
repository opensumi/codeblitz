import { ClientApp, RuntimeConfig, makeWorkspaceDir, IAppOpts } from '@alipay/alex-core';
import { SlotRenderer, SlotLocation, IAppRenderer } from '@ali/ide-core-browser';
import { BoxPanel, SplitPanel } from '@ali/ide-core-browser/lib/components';
import { IThemeService } from '@ali/ide-theme/lib/common';
import '@ali/ide-i18n/lib/browser';
import '../core/normalize.less';
import { modules } from '../core/modules';
import { IconSlim, IDETheme } from '../core/extensions';
import { mergeConfig, themeStorage } from '../core/utils';
import { LayoutComponent, layoutConfig } from '../core/layout';
import { IConfig } from './types';

export { SlotLocation, SlotRenderer, BoxPanel, SplitPanel };

const getDefaultAppConfig = (): IAppOpts => ({
  modules,
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: __WORKER_HOST__,
  webviewEndpoint: __WEBVIEW_ENDPOINT__,
  defaultPreferences: {
    'general.theme': 'ide-dark',
    'general.language': 'zh-CN',
    'general.icon': 'vsicons-slim',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 10,
    'editor.quickSuggestionsMaxCount': 50,
    'editor.scrollBeyondLastLine': false,
    'settings.userBeforeWorkspace': true,
  },
  layoutConfig,
  layoutComponent: LayoutComponent,
  extensionMetadata: [IconSlim, IDETheme],
  defaultPanels: {
    bottom: '',
  },
});

export const DEFAULT_APP_CONFIG = getDefaultAppConfig();

export function createApp({ appConfig, runtimeConfig }: IConfig) {
  const customConfig = (typeof appConfig === 'function' ? appConfig() : appConfig) ?? {};
  const opts = mergeConfig(getDefaultAppConfig(), customConfig);

  // TODO: workspaceDir 是否需要强制，共用 workspaceDir 可能的问题是缓存状态会共享
  // if (!opts.workspaceDir) {
  //   throw new Error('请配置 workspaceDir，最好确保 workspaceDir 唯一，推荐类似 group/repository 的形式，内部根据 workspaceDir 缓存打开状态，如果不关心单独 workspaceDir，共用一个 workspaceDir 亦可');
  // }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir || '');

  let themeType = themeStorage.get();
  if (!themeType) {
    const defaultTheme = opts.defaultPreferences?.['general.theme'];
    opts.extensionMetadata?.find((item) => {
      const themeConfig = item.packageJSON.contributes?.themes?.find(
        (item: any) => item.id === defaultTheme
      );
      if (themeConfig) {
        themeType = !themeConfig.uiTheme || themeConfig.uiTheme === 'vs-dark' ? 'dark' : 'light';
        themeStorage.set(themeType);
      }
    });
  }

  const app = new ClientApp(opts);

  const _start = app.start;
  app.start = async (container: HTMLElement | IAppRenderer) => {
    await _start.call(app, container);
    // 在 start 不能 injector.get，否则有的 service 立即初始化，此时 file-system 还没有初始化完成
    (app.injector.get(IThemeService) as IThemeService).onThemeChange((e) => {
      themeStorage.set(e.type);
    });
  };

  runtimeConfig ??= {};
  // 基于场景的运行时数据
  app.injector.addProviders({
    token: RuntimeConfig,
    useValue: runtimeConfig,
  });

  (window as any)[RuntimeConfig] = runtimeConfig;

  return app;
}
