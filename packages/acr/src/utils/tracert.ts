export function spmClick(id: string, extra?: any) {
  if ('Tracert' in window) {
    Tracert.click(id, extra);
  }
}

export function spmExpo(id: string, extra?: any) {
  if ('Tracert' in window) {
    Tracert.expo(id, extra);
  }
}

export function logPv(spmAPos: string, spmBPos: string, extra?: any) {
  if ('Tracert' in window) {
    const originSpmA = Tracert.get('spmAPos');
    const originSpmB = Tracert.get('spmBPos');

    // 修改 spm a和b位
    Tracert.set({
      // spm的a位
      spmAPos,
      // spm的b位
      spmBPos,
    });

    // 发送页面埋点
    Tracert.call('logPv');

    // 重置回原本 spmA spmB
    Tracert.set({
      spmAPos: originSpmA,
      spmBPos: originSpmB,
    });
  }
}
