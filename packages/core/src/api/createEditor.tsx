import '@opensumi/ide-i18n/lib/browser';
import '@codeblitzjs/ide-i18n';
import {
  ClientApp,
  HOME_ROOT,
  IAppOpts,
  makeWorkspaceDir,
  RuntimeConfig,
  STORAGE_DIR,
} from '@codeblitzjs/ide-sumi-core';
import { Injector } from '@opensumi/di';
import { FILES_DEFAULTS, IAppRenderer, IReporter, SlotLocation, SlotRenderer } from '@opensumi/ide-core-browser';
import { BoxPanel, SplitPanel } from '@opensumi/ide-core-browser/lib/components';

import '@opensumi/ide-core-browser/lib/style/entry.less';
import '@opensumi/ide-core-browser/lib/style/codicons/codicon-animations.css';

import { deletionLogPath } from '@codeblitzjs/ide-browserfs/lib/backend/OverlayFS';
import { IPluginConfig } from '@codeblitzjs/ide-plugin';

import { getModules } from '../core/editor/modules';
import { EXT_WORKER_HOST, WEBVIEW_ENDPOINT } from '../core/env';
import { EditorLayoutComponent, getEditorLayoutConfig } from '../core/layout';
import { disposableCollection, disposeMode } from '../core/patch';
import { mergeConfig } from '../core/utils';
import { appName } from './constants';
import { interceptAppOpts } from './opts';
import { IAppInstance, IConfig } from './types';

export { BoxPanel, SlotLocation, SlotRenderer, SplitPanel };

const getDefaultAppConfig = (): IAppOpts => ({
  modules: getModules(),
  useCdnIcon: true,
  noExtHost: true,
  extWorkerHost: EXT_WORKER_HOST,
  webviewEndpoint: WEBVIEW_ENDPOINT,
  defaultPreferences: {
    'general.theme': 'opensumi-design-light-theme',
    'application.confirmExit': 'never',
    'editor.autoSave': 'afterDelay',
    'editor.guides.bracketPairs': false,
    'editor.minimap': false,
    'editor.quickSuggestionsDelay': 10,
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
  appName,
  allowSetDocumentTitleFollowWorkspaceDir: false,
});

export function createEditor({ appConfig, runtimeConfig }: IConfig): IAppInstance {
  const opts = interceptAppOpts(mergeConfig(getDefaultAppConfig(), appConfig), runtimeConfig);

  if (!opts.workspaceDir) {
    throw new Error(
      '需工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 目录下',
    );
  }
  opts.workspaceDir = makeWorkspaceDir(opts.workspaceDir);

  const injector = opts.injector || new Injector();
  // 基于场景的运行时数据
  injector.addProviders({
    token: RuntimeConfig,
    useValue: runtimeConfig,
  });

  injector.addProviders({
    token: IPluginConfig,
    useValue: appConfig.plugins,
  });

  if (runtimeConfig.reporter) {
    injector.addProviders({
      token: IReporter,
      useValue: runtimeConfig.reporter,
      override: true,
    });
  }

  const app = new ClientApp({ ...opts, injector }) as IAppInstance;

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

  return app;
}
