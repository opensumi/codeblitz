/**
 * 记录 PV，UV 埋点
 */

declare var Tracert: {
  get: Function;
  set: Function;
  call: Function;
};

const CLOUD_IDE_SPM_A = 'a1654';

export function logPv(spmBPos: string) {
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
      spmBPos,
    });

    Tracert.call('logPv');

    Tracert.set({
      spmAPos: originSpmA,
      spmBPos: originSpmB,
    });
  }
}
