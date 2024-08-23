import { IExtensionIdentity, IExtensionMode } from '@codeblitzjs/ide-common';
import { ConstructorOf, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { BackService, MaybePromise } from '@opensumi/ide-core-common';
import * as paths from 'path';
import { EXT_SCHEME, OSSBucket, WORKSPACE_ROOT } from './constant';

export const getExtensionPath = (
  ext: IExtensionIdentity,
  mode?: IExtensionMode,
  OSSPath?: string,
) => {
  if (!!OSSPath) {
    return [OSSPath, '/', `${ext.publisher}.${ext.name}-${ext.version}`].join('');
  }

  return [
    EXT_SCHEME,
    '://',
    mode == 'public' ? OSSBucket.public : OSSBucket.internal,
    '/marketplace/extension/',
    `${ext.publisher}.${ext.name}-${ext.version}`,
  ].join('');
};

export const makeWorkspaceDir = (path: string = '') => {
  const posixPath = paths.posix || paths;
  return posixPath.join(WORKSPACE_ROOT, posixPath.resolve('/', path));
};

/**
 * 通过是否同时存在 servicePath 和 token 确定是否在 server 层
 */
export const isBackServicesInServer = (backService: BackService) => {
  return !!(backService.servicePath && backService.token);
};

export const isBackServicesInBrowser = (backService: BackService) => {
  return !isBackServicesInServer(backService);
};

/**
 * 将配置分摊到各自模块中，在 modules 声明时可通过 Module.Config({}) 传入配置对象
 * 静态方法 Config 通过 extendModule 扩充模块，eg.
 * TODO: 在 opensumi 中弄个更通用的
 *
 * ```js
 * static Config(config) {
 *  return extendModule({
 *    module: MyModule,
 *    providers: [
 *      {
 *        useToken: IMyConfig,
 *        useValue: config
 *      }
 *    ]
 *  })
 * }
 * ```
 */
export const extendModule = ({
  module: ParentModule,
  providers,
}: {
  module: ConstructorOf<BrowserModule>;
  providers: Provider[];
}): ConstructorOf<BrowserModule> => {
  return class ConfigBrowserModule extends ParentModule {
    constructor() {
      super();
      this.providers = (this.providers || []).concat(...providers);
    }
  };
};

export const tryCatchPromise = (fn: () => MaybePromise<void>): Promise<void> => {
  const run = async () => {
    return await fn();
  };

  return run().catch((e) => {
    console.error('dispose injector error', e);
  });
};
