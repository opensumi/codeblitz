import '@ali/ide-i18n/lib/browser';
import '@alipay/alex-i18n';
import {
  ClientApp,
  RuntimeConfig,
  makeWorkspaceDir,
  IAppOpts,
  STORAGE_DIR,
} from '@alipay/alex-core';
import {
  SlotRenderer,
  SlotLocation,
  IAppRenderer,
  FILES_DEFAULTS,
  IReporter,
  getPreferenceThemeId,
} from '@ali/ide-core-browser';
import { BoxPanel, SplitPanel } from '@ali/ide-core-browser/lib/components';
import '@ali/ide-core-browser/lib/style/index.less';
import * as os from 'os';

import '../core/extension.patch';
import { disposeMode } from '../core/patch';

import { modules } from '../core/modules';
import { IconSlim, IDETheme } from '../core/extensions';
import { mergeConfig, getThemeTypeByPreferenceThemeId } from '../core/utils';
import { LayoutComponent, getDefaultLayoutConfig } from '../core/layout';
import { IConfig, IAppInstance } from './types';
import { logPv } from '../core/tracert';

export { SlotLocation, SlotRenderer, BoxPanel, SplitPanel };

const getDefaultAppConfig = (): IAppOpts => ({
  modules,
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: __WORKER_HOST__,
  webviewEndpoint: __WEBVIEW_ENDPOINT__,
  defaultPreferences: {
    'general.theme': 'ide-dark',
    'general.icon': 'vsicons-slim',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 10,
    'editor.quickSuggestionsMaxCount': 50,
    'settings.userBeforeWorkspace': true,
    'files.exclude': {
      ...FILES_DEFAULTS.filesExclude,
      // browserfs OverlayFS 用来记录删除的文件
      '**/.deletedFiles.log': true,
    },
  },
  layoutConfig: getDefaultLayoutConfig(),
  layoutComponent: LayoutComponent,
  extensionMetadata: [IconSlim, IDETheme],
  defaultPanels: {
    bottom: '',
  },
  logDir: `${os.homedir()}/${STORAGE_DIR}/logs/`,
  preferenceDirName: STORAGE_DIR,
  storageDirName: STORAGE_DIR,
  extensionStorageDirName: STORAGE_DIR,
  appName: 'ALEX',
  allowSetDocumentTitleFollowWorkspaceDir: false,
});

export const DEFAULT_APP_CONFIG = getDefaultAppConfig();

export function createApp({ appConfig, runtimeConfig }: IConfig): IAppInstance {
  const customConfig = typeof appConfig === 'function' ? appConfig() : appConfig;
  const opts = mergeConfig(getDefaultAppConfig(), customConfig);

  if (!opts.workspaceDir) {
    throw new Error(
      '需工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 目录下'
    );
  }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir);

  const app = new ClientApp(opts) as IAppInstance;

  Object.defineProperty(app, 'currentThemeType', {
    get() {
      const themeId = getPreferenceThemeId() || opts.defaultPreferences?.['general.theme'];
      return getThemeTypeByPreferenceThemeId(themeId, opts.extensionMetadata);
    },
  });

  const _start = app.start;
  app.start = async (container: HTMLElement | IAppRenderer) => {
    await _start.call(app, container);

    setTimeout(() => {
      logPv(runtimeConfig.biz || location.hostname);
    });
  };

  /**
   * 目前整个应用有太多的副作用，尤其是注册到 monaco 的事件，如 DocumentSymbolProviderRegistry.onChange
   * 在 monaco 上的事件无法注销，除非重新全局实例化一个 monaco，目前 kaitian 并未暴露，暂时不可行
   * 因此这里的 destroy 仍然可能有不少副作用无法清除，暂时清理已知的，避免报错
   */
  let destroyed = false;
  app.destroy = () => {
    if (destroyed) {
      return;
    }
    destroyed = true;
    disposeMode();
    app.injector.disposeAll();
  };

  // 基于场景的运行时数据
  app.injector.addProviders({
    token: RuntimeConfig,
    useValue: runtimeConfig,
  });

  if (runtimeConfig.reporter) {
    app.injector.addProviders({
      token: IReporter,
      useValue: runtimeConfig.reporter,
      override: true,
    });
  }

  (window as any)[RuntimeConfig] = runtimeConfig;

  return app;
}
