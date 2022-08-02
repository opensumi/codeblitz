import '@opensumi/ide-i18n/lib/browser';
import '@alipay/alex-i18n';
import {
  ClientApp,
  RuntimeConfig,
  makeWorkspaceDir,
  IAppOpts,
  STORAGE_DIR,
  HOME_ROOT,
} from '@alipay/alex-core';
import {
  SlotRenderer,
  SlotLocation,
  IAppRenderer,
  FILES_DEFAULTS,
  IReporter,
} from '@opensumi/ide-core-browser';
import { BoxPanel, SplitPanel } from '@opensumi/ide-core-browser/lib/components';

import '@opensumi/ide-core-browser/lib/style/entry.less';
import '@opensumi/ide-core-browser/lib/style/codicons/codicon-animations.css';

import { IPluginConfig } from '@alipay/alex-plugin';
import { deletionLogPath } from '@alipay/alex-browserfs/lib/backend/OverlayFS';

import { disposeMode, disposableCollection } from '../core/patch';
import { getModules } from '../core/editor/modules';
import { mergeConfig } from '../core/utils';
import { EditorLayoutComponent, getEditorLayoutConfig } from '../core/layout';
import { IConfig, IAppInstance } from './types';
import { logPv } from '../core/tracert';
import { EXT_WORKER_HOST, WEBVIEW_ENDPOINT } from '../core/env';

export { SlotLocation, SlotRenderer, BoxPanel, SplitPanel };

const getDefaultAppConfig = (): IAppOpts => ({
  modules: getModules(),
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: EXT_WORKER_HOST,
  webviewEndpoint: WEBVIEW_ENDPOINT,
  defaultPreferences: {
    'general.theme': 'ide-light',
    'application.confirmExit': 'never',
    'editor.autoSave': 'afterDelay',
    'editor.autoSaveDelay': 1000, // one second
    'editor.fixedOverflowWidgets': true, // widget editor 默认改为 fixed
    'files.exclude': {
      ...FILES_DEFAULTS.filesExclude,
      // browserfs OverlayFS 用来记录删除的文件
      [`**${deletionLogPath}`]: true,
    },
  },
  layoutConfig: getEditorLayoutConfig(),
  layoutComponent: EditorLayoutComponent,
  logDir: `${HOME_ROOT}/${STORAGE_DIR}/logs/`,
  preferenceDirName: STORAGE_DIR,
  storageDirName: STORAGE_DIR,
  extensionStorageDirName: STORAGE_DIR,
  appName: 'ALEX',
  allowSetDocumentTitleFollowWorkspaceDir: false,
});

export function createEditor({ appConfig, runtimeConfig }: IConfig): IAppInstance {
  const opts = mergeConfig(getDefaultAppConfig(), appConfig);

  if (!opts.workspaceDir) {
    throw new Error(
      '需工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 目录下'
    );
  }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir);

  const app = new ClientApp(opts) as IAppInstance;

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
