/**
 * 记录 PV，UV 埋点
 */

declare var Tracert: {
  get: Function;
  set: Function;
  call: Function;
};

const CLOUD_IDE_SPM_A = 'a1654';

const whitelist: string[] = [];

export function logPv(biz: string) {
  if (whitelist.includes(window.location.hostname)) {
    return;
  }
}
