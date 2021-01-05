import { Injector } from '@ali/common-di';

import { ClientApp, EXTENSION_DIR, IClientAppOpts } from '@alipay/spacex-core';

export async function createApp(opts: IClientAppOpts) {
  const injector = new Injector();

  opts = { ...opts };

  opts.injector = injector;
  opts.extensionDir ||= EXTENSION_DIR;

  const app = new ClientApp(opts);

  app.fireOnReload = () => {
    window.location.reload();
  };

  return app;
}
