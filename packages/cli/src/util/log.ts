import { Signale } from 'signale';
import { PRODUCT } from './constant';

const log = new Signale({
  scope: PRODUCT,
});

const error = (msg) => {
  log.error(msg);
  throw new Error(msg);
};

export { log, error };
