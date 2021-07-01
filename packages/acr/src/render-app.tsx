import { Injector } from '@ali/common-di';
import { ClientApp, IClientAppOpts, LogServiceForClientPath } from '@ali/ide-core-browser';
import { DEFAULT_USER_STORAGE_FOLDER } from '@ali/ide-preferences/lib/browser/userstorage/user-storage.service';
import { IStatusBarService } from '@ali/ide-core-browser/lib/services';
import { IDocPersistentCacheProvider } from '@ali/ide-editor';
import { LocalStorageDocCacheImpl } from '@ali/ide-editor/lib/browser/doc-cache/local-storage-cache';

import bfs, { BROWSER_FS_HOME_DIR } from './common/file-system';

import { MockLogServiceForClient } from './overrides/mock-logger';
import { EmptyStatusBarService } from './overrides/empty-statusbar.service';

export async function renderApp(opts: IClientAppOpts, injector: Injector, customRenderer) {
  injector = injector || new Injector();
  opts.injector = injector;

  // FIXME: 这里有一个问题，injector 这个时候是拿不到 ide-fw 内部的 service 的
  // FIXME: 应尽快去掉 mock 模块的使用
  injector.addProviders(
    {
      token: LogServiceForClientPath,
      useClass: MockLogServiceForClient,
    },
    // mock 掉不展示的 statusbar
    {
      token: IStatusBarService,
      useClass: EmptyStatusBarService,
    },
    // 将文本内容缓存到浏览器缓存中
    {
      token: IDocPersistentCacheProvider,
      useClass: LocalStorageDocCacheImpl,
    }
  );

  // 跟后端通信部分配置，需要解耦
  opts.extensionDir = opts.extensionDir || process.env.EXTENSION_DIR;
  opts.wsPath = process.env.WS_PATH || 'ws://127.0.0.1:8000'; // 代理测试地址: ws://127.0.0.1:8001
  opts.extWorkerHost = opts.extWorkerHost || process.env.EXTENSION_WORKER_HOST; // `http://127.0.0.1:8080/kaitian/ext/worker-host.js`; // 访问 Host
  opts.webviewEndpoint = opts.webviewEndpoint || `http://localhost:50998`;

  // 将 kaitian 存在另外一个 workspace 下面
  // FIXME: 应该用单独的 browser fs 实例才更合适
  await bfs.ensureDir(BROWSER_FS_HOME_DIR.codeUri.fsPath);
  // workspaceDir 已经确保在 home 之下了
  await bfs.ensureDir(opts.workspaceDir!);

  // storage 相关
  // ensure `.kaitian` 目录存在
  await bfs.ensureDir(BROWSER_FS_HOME_DIR.resolve(DEFAULT_USER_STORAGE_FOLDER).codeUri.fsPath);

  const app = new ClientApp(opts);

  app.fireOnReload = (forcedReload: boolean) => {
    window.location.reload(forcedReload);
  };

  await app.start(customRenderer);
  const loadingDom = document.getElementById('loading');
  if (loadingDom) {
    loadingDom.classList.add('loading-hidden');
    loadingDom.remove();
  }
}
