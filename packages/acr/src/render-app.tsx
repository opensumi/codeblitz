import { Injector } from '@opensumi/di';
import { registerExternalPreferenceProvider } from '@opensumi/ide-core-browser';
import { IStatusBarService } from '@opensumi/ide-core-browser/lib/services';
import { IDocPersistentCacheProvider } from '@opensumi/ide-editor';
import { LocalStorageDocCacheImpl } from '@opensumi/ide-editor/lib/browser/doc-cache/local-storage-cache';
import { RuntimeConfig, ClientApp, HOME_IDB_NAME } from '@alipay/alex-core';
import { getDefaultAppConfig, IAppConfig } from '@alipay/alex';
import { EmptyStatusBarService } from './overrides/empty-statusbar.service';
import '@alipay/alex/languages';
import { IPluginConfig } from '@alipay/alex-plugin';
import md5 from 'md5';
import { editorPreferenceSchema } from '@opensumi/ide-editor/lib/browser/preference/schema';

export async function renderApp(opts: IAppConfig, injector: Injector, customRenderer) {
  injector = injector || new Injector();
  opts.injector = injector;

  const runtimeConfig: RuntimeConfig = {
    biz: 'acr',
    startupEditor: 'none',
    scenario: 'ACR',
    workspace: {
      filesystem: {
        fs: 'FolderAdapter',
        options: {
          // 隔离空间存储数据
          folder: `/${md5(opts.workspaceDir)}`,
          wrapped: {
            fs: 'IndexedDB', // indexedDB 持久化缓存编辑文件
            options: {
              storeName: 'ACR_WORKSPACE',
            },
          },
        },
      },
    },
  };

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
    },
    {
      token: RuntimeConfig,
      useValue: runtimeConfig,
    },
    {
      token: IPluginConfig,
      useValue: opts.plugins,
    }
  );

  const defaultConfig = getDefaultAppConfig();
  const extensionMetadata = [
    ...(defaultConfig.extensionMetadata ?? []),
    ...(opts.extensionMetadata ?? []),
  ];

  const appOpts = {
    ...defaultConfig,
    ...opts,
    extensionMetadata,
  };

  // 强制的默认偏好设置主题
  registerExternalPreferenceProvider('general.theme', {
    get() {
      return opts.defaultPreferences?.['general.theme'];
    },
    set() {
      // 不支持设置
    },
  });

  // 支持配置 editor.scrollbar.alwaysConsumeMouseWheel，避免编辑器中滚动不冒泡
  // kaitian 中未支持 editor.scrollbar 的 schema
  editorPreferenceSchema.properties['editor.scrollbar.alwaysConsumeMouseWheel'] = {
    type: 'boolean',
    default: true,
    description: 'Always consume mouse wheel events',
  };

  const app = new ClientApp(appOpts);

  await app.start(customRenderer);
  const loadingDom = document.getElementById('loading');
  if (loadingDom) {
    loadingDom.classList.add('loading-hidden');
    loadingDom.remove();
  }
}
