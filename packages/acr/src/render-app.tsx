import { Injector } from '@ali/common-di';
import { IClientAppOpts } from '@ali/ide-core-browser';
import { IStatusBarService } from '@ali/ide-core-browser/lib/services';
import { IDocPersistentCacheProvider } from '@ali/ide-editor';
import { LocalStorageDocCacheImpl } from '@ali/ide-editor/lib/browser/doc-cache/local-storage-cache';
import { RuntimeConfig } from '@alipay/alex-core';
import { EmptyStatusBarService } from './overrides/empty-statusbar.service';
import { createApp, IAppConfig } from '@alipay/alex';
import '@alipay/alex/languages';

export async function renderApp(opts: IClientAppOpts, injector: Injector, customRenderer) {
  injector = injector || new Injector();
  opts.injector = injector;

  // FIXME: 这里有一个问题，injector 这个时候是拿不到 ide-fw 内部的 service 的
  // FIXME: 应尽快去掉 mock 模块的使用
  injector.addProviders(
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

  const appConfig: IAppConfig = {
    ...opts,
    defaultPreferences: {
      // acr theme
      'general.theme': 'alipay-geek-light',
    },
    extensionMetadata: [],
    workspaceDir: opts.workspaceDir!,
  };

  const runtimeConfig: RuntimeConfig = {
    biz: 'acr',
    startupEditor: 'none',
  };

  const app = createApp({
    appConfig,
    runtimeConfig,
  });

  await app.start(customRenderer);
  const loadingDom = document.getElementById('loading');
  if (loadingDom) {
    loadingDom.classList.add('loading-hidden');
    loadingDom.remove();
  }
}
