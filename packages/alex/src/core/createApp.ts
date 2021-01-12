import { Injector } from '@ali/common-di';

import { ClientApp, EXTENSION_DIR, WORKSPACE_ROOT, IClientAppOpts } from '@alipay/alex-core';

export function createApp(opts: IClientAppOpts) {
  const injector = new Injector();

  opts = { ...opts };

  opts.injector = injector;
  opts.extensionDir ||= EXTENSION_DIR;
  opts.workspaceDir ||= '';

  const app = new ClientApp(opts);

  app.fireOnReload = () => {
    window.location.reload();
  };

  return app;
}
