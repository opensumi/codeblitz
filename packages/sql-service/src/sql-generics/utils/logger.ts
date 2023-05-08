// import { goldLogPost } from '../../../tools/goldlog';
// import { goldlogType } from '../../../tools/goldlog/definition';

const MAX_WAIT_TIME = 1000;

function handleTimeAnalysis(monitorInfo) {
  /** 目前部分worker未透出monitorInfo，先加一个判定，后续再移除 */
  // if (monitorInfo) {
  //   const { parseTime, traverseTime, workerTime } = monitorInfo || ({} as any);
  //   if (workerTime > MAX_WAIT_TIME) {
  //     const { userAgent } = window.navigator;
  //     const reports = {
  //       bizScene: 'aceEditor.parser',
  //       type: goldlogType.timecost,
  //       goKey: {
  //         parseTime,
  //         traverseTime,
  //         workerTime,
  //         userAgent,
  //       },
  //     };
  //     goldLogPost([reports]);
  //   }
  // }
}

export { handleTimeAnalysis };
