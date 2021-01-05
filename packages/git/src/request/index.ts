import { isDevelopment } from '@ali/ide-core-common';
import { umiRequest } from '@alipay/spacex-shared';
import { API } from './type';

const request = umiRequest.extend({
  prefix: isDevelopment() ? '/code-service' : 'https://code.alipay.com',
});

request.use(async (ctx, next) => {
  if (!ctx) return next();
  const {
    req: { options },
  } = ctx;
  options.credentials = 'include';
  return next();
});

export type { API };

export { request };
