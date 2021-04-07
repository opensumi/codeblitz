/**
 * 记录 PV，UV 埋点
 */

declare var Tracert: {
  get: Function;
  set: Function;
  call: Function;
};

const CLOUD_IDE_SPM_A = 'a1654';

const whitelist = [
  'ide.alipay.com',
  'cloudideweb-pre.alipay.com',
  'alex.alipay.com',
  'alex-pre.alipay.com',
];

export function logPv(biz: string) {
  // alex 集成使用单独的埋点位
  if (whitelist.includes(window.location.hostname)) {
    return;
  }
  if (
    'Tracert' in window &&
    typeof Tracert.get === 'function' &&
    typeof Tracert.set === 'function' &&
    typeof Tracert.call === 'function'
  ) {
    const originSpmA = Tracert.get('spmAPos');
    const originSpmB = Tracert.get('spmBPos');

    Tracert.set({
      spmAPos: CLOUD_IDE_SPM_A,
      spmBPos: biz === 'riddle' ? biz : `alex/sdk:${biz}`, // legacy: remain riddle
    });

    Tracert.call('logPv');

    Tracert.set({
      spmAPos: originSpmA,
      spmBPos: originSpmB,
    });
  }
}
