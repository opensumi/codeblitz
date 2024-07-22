import { Signale } from 'signale';
import { kExtensionConfig } from './constant';

const log = new Signale();

const error = (msg) => {
  log.error(msg);
  throw new Error(msg);
};

export const init = () => {
  log.scope(kExtensionConfig.product);
};

export { error, log };
