import { extend } from 'umi-request';
import { API } from './type';

const request = extend({});

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
