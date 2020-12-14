import { Injector } from '@ali/common-di';

import {
  ClientApp,
  ServerApp,
  EXTENSION_DIR,
  IClientAppOpts,
  IServerAppOpts,
} from '@alipay/spacex-core';

interface Options {
  clientOptions: Omit<IClientAppOpts, 'serverApp'>;
  serverOptions: IServerAppOpts;
}

export async function createApp({ clientOptions, serverOptions }: Options) {
  const clientInjector = new Injector();
  const serverInjector = new Injector();

  clientOptions.injector = clientInjector;
  clientOptions.extensionDir ||= EXTENSION_DIR;

  const serverApp = new ServerApp({
    injector: serverInjector,
    modules: serverOptions.modules || [],
    workspaceDir: serverOptions.workspaceDir,
    extensionDir: serverOptions.extensionDir,
    extensionMetadata: serverOptions.extensionMetadata,
  });

  await serverApp.start();

  const app = new ClientApp({
    ...clientOptions,
    serverApp,
  });
  app.fireOnReload = () => {
    window.location.reload();
  };

  return app;
}
