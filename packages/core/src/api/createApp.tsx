import '@opensumi/ide-i18n/lib/browser';
import '@codeblitzjs/ide-i18n';
import {
  ClientApp,
  RuntimeConfig,
  makeWorkspaceDir,
  IAppOpts,
  STORAGE_DIR,
  HOME_ROOT,
} from '@codeblitzjs/ide-sumi-core';
import {
  SlotRenderer,
  SlotLocation,
  IAppRenderer,
  FILES_DEFAULTS,
  IReporter,
  getPreferenceThemeId,
  PreferenceProvider,
  PreferenceScope,
  registerExternalPreferenceProvider,
  IClientAppOpts,
} from '@opensumi/ide-core-browser';
import { BoxPanel, SplitPanel } from '@opensumi/ide-core-browser/lib/components';

import '@opensumi/ide-core-browser/lib/style/entry.less';
import '@opensumi/ide-core-browser/lib/style/codicons/codicon-animations.css';
import './normalize.less';

import { IPluginConfig } from '@codeblitzjs/ide-plugin';
import { deletionLogPath } from '@codeblitzjs/ide-browserfs/lib/backend/OverlayFS';

import '../core/extension/extension.patch';
import { disposeMode, disposableCollection } from '../core/patch';

import { modules } from '../core/modules';
import { IconSlim, IDETheme } from '../core/extension/metadata';
import { mergeConfig, getThemeTypeByPreferenceThemeId } from '../core/utils';
import { LayoutComponent, getDefaultLayoutConfig } from '../core/layout';
import { IConfig, IAppInstance } from './types';
import { logPv } from '../core/tracert';
import { EXT_WORKER_HOST, WEBVIEW_ENDPOINT } from '../core/env';

export { SlotLocation, SlotRenderer, BoxPanel, SplitPanel };

export const getDefaultAppConfig = (): IAppOpts => ({
  modules,
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: EXT_WORKER_HOST,
  webviewEndpoint: WEBVIEW_ENDPOINT,
  defaultPreferences: {
    'general.theme': 'opensumi-dark',
    'general.icon': 'vsicons-slim',
    'application.confirmExit': 'never',
    'editor.quickSuggestionsDelay': 10,
    'settings.userBeforeWorkspace': true,
    'editor.fixedOverflowWidgets': true,
    // 取消高亮线
    'editor.guides.bracketPairs': false,
    'files.exclude': {
      ...FILES_DEFAULTS.filesExclude,
      // browserfs OverlayFS 用来记录删除的文件
      [`**${deletionLogPath}`]: true,
      '**/.cloudide/**': true,
    },
  },
  layoutConfig: getDefaultLayoutConfig(),
  layoutComponent: LayoutComponent,
  extensionMetadata: [IconSlim, IDETheme],
  defaultPanels: {
    bottom: '',
  },
  logDir: `${HOME_ROOT}/${STORAGE_DIR}/logs/`,
  preferenceDirName: STORAGE_DIR,
  storageDirName: STORAGE_DIR,
  extensionStorageDirName: STORAGE_DIR,
  appName: 'ALEX',
  allowSetDocumentTitleFollowWorkspaceDir: false,
});

export const DEFAULT_APP_CONFIG = getDefaultAppConfig();

export function createApp({ appConfig, runtimeConfig }: IConfig): IAppInstance {
  const opts = mergeConfig(getDefaultAppConfig(), appConfig);

  if (!opts.workspaceDir) {
    throw new Error(
      '需工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 目录下'
    );
  }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir);
  // 托管 preference 逻辑
  registerLocalStorageProvider(opts);
  
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

  let destroyed = false;
  app.destroy = () => {
    if (destroyed) {
      return;
    }
    destroyed = true;
    disposeMode();
    disposableCollection.forEach((d) => d(app.injector));
    app.injector.disposeAll();
  };

  // 基于场景的运行时数据
  app.injector.addProviders({
    token: RuntimeConfig,
    useValue: runtimeConfig,
  });

  app.injector.addProviders({
    token: IPluginConfig,
    useValue: appConfig.plugins,
  });

  if (runtimeConfig.reporter) {
    app.injector.addProviders({
      token: IReporter,
      useValue: runtimeConfig.reporter,
      override: true,
    });
  }

  return app;
}

function registerLocalStorageProvider(options: IClientAppOpts) {
  function getScopePrefix(scope: PreferenceScope) {
    if (scope === PreferenceScope.Workspace) {
      return options.workspaceDir;
    }
    return scope;
  }
  const THEME_KEY = 'general.theme';
  registerExternalPreferenceProvider(THEME_KEY, {
    set: (value: string, scope) => {
      if (scope >= PreferenceScope.Folder) {
        // earlyPreference不支持针对作用域大于等于Folder的值设置
        return;
      }

      if ((global as any).localStorage) {
        if (value !== undefined) {
          localStorage.setItem(getScopePrefix(scope) + `:${THEME_KEY}`, value);
        } else {
          localStorage.removeItem(getScopePrefix(scope) + `:${THEME_KEY}`);
        }
      }
    },
    get: (scope) => {
      if ((global as any).localStorage) {
        const themeId = localStorage.getItem(getScopePrefix(scope) + `:${THEME_KEY}`) || undefined;
        // 兼容 ide-dark 逻辑
        // https://github.com/opensumi/core/issues/274
        return themeId === 'ide-dark' ? options.defaultPreferences!['general.theme'] : themeId;
      }
    },
  });
}
