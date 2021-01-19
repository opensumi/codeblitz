import { umiRequest } from '@alipay/alex-shared';
import { API } from './type';

const request = umiRequest.extend({});

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
