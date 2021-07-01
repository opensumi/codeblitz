import YuyanMonitor from '@alipay/yuyan-monitor-web';
import { getPathExt } from './index';
import { FileOpenMethod } from '../common';

const { version } = require('../../package.json');

(window as any).YuyanMonitor = (window as any).YuyanMonitor || YuyanMonitor;

export const monitor = new YuyanMonitor({
  _appId: '5f69c2501e7d23051c4c1ff3',
  yuyanId: '180020010000408013',
  sprintId: version,
});

let hasWorkId = false;

// 设置 monitor 里的 work-id
export const setUserWorkId = (workId: string) => {
  if (!hasWorkId) {
    monitor.config({
      userId: workId,
    });
    hasWorkId = true;
  }
};

/**
 * @deprecated 已废弃，由 antcode 统一上报
 * 上报 ide 模式 关闭开关
 */
export const reportCloseIdeMode = () => {
  monitor.log({
    code: 5,
    msg: '', // TODO: pr-id
  });
};

/**
 * 冷启动时长
 */
export const reportCoolBoot = (time: number) => {
  monitor.log({
    code: 6,
    msg: '', // TODO: pr-id
    m1: time,
  });
};

/**
 * 热启动时长
 * ide 组件渲染时长
 */
export const reportWarmBoot = (time: number) => {
  monitor.log({
    code: 7,
    msg: '', // TODO: pr-id
    m1: time,
  });
};

/**
 * lsif 操作统计
 */
export const reportLsifBehavior = (
  behavior: 'hover' | 'definition' | 'references',
  hasResult: boolean,
  time: number,
  meta: {
    projectId: string | number;
    prId: number;
    commitId: string;
    path: string;
  }
) => {
  monitor.log({
    code: 8,
    msg: '', // TODO: pr-id
    d1: behavior,
    d2: hasResult ? 1 : 0,
    m1: time,
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.commitId,
    c4: meta.path,
    c5: getPathExt(meta.path),
  });
};

/**
 * lsif 是否存在
 */
export const reportLsifExist = (
  projectId: string,
  prId: number,
  commitId: string,
  hasResult: boolean
) => {
  monitor.log({
    code: 9,
    msg: '', // TODO: pr-id
    d1: hasResult ? 1 : 0,
    c1: projectId,
    c2: prId,
    c3: commitId,
  });
};

/**
 * 记录 web-scm 下的代码 push 行为
 */
export const reportWebSCMPush = (
  projectId: string,
  prId: number,
  commitId: string,
  succeed: boolean,
  newBranch: boolean,
  errorMsg?: string
) => {
  monitor.log({
    code: 10,
    msg: '', // TODO: pr-id
    d1: succeed ? 1 : 0,
    d2: newBranch ? 1 : 0,
    d3: errorMsg,
    c1: projectId,
    c2: prId,
    c3: commitId,
  });
};

/**
 * 记录打开文件的方式
 *   文件树点击
 *   状态栏上一个/下一个
 *   快捷键切换文件
 *   quick-open 切换时
 */
export const reportOpenFileOperation = (
  path: string,
  uri: string,
  channel: FileOpenMethod,
  /**
   * 表示该文件已经存在于当前编辑器的 tab 中
   */
  isOpened: boolean,
  meta: {
    projectId: string | number;
    prId: number;
    commitId: string;
  }
) => {
  monitor.log({
    code: 11,
    msg: '',
    d1: channel,
    d2: path,
    d3: uri,
    d4: isOpened,
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.commitId,
  });
};

/**
 * 记录用户点击进入写模式的行为
 *  * 点击“编辑”按钮
 *  * 点击 scm 列表中 item 上的打开按钮
 */
export const reportEditOperation = (
  behavior: 'editor-title-btn' | 'scm-resource-inline-open-file',
  path: string,
  meta: {
    projectId: string | number;
    prId: number;
    commitId: string;
  }
) => {
  monitor.log({
    code: 12,
    msg: '',
    d1: behavior,
    d2: path,
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.commitId,
  });
};

/**
 * 记录用户写模式下的 保存 行为
 */
export const reportSaveOperation = (
  behavior: 'save-btn' | 'keybinding',
  path: string,
  meta: {
    projectId: string | number;
    prId: number;
    commitId?: string; // 暂时先不记录了
  }
) => {
  monitor.log({
    code: 13,
    msg: '',
    d1: behavior,
    d2: path,
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.commitId,
  });
};

/**
 * 记录用户读模式下的使用 inline 模式的情况
 */
export const reportDiffEditorInlineMode = (meta: { projectId: string | number; prId: number }) => {
  monitor.log({
    code: 14,
    msg: '',
    c1: meta.projectId,
    c2: meta.prId,
  });
};

/**
 * 记录用户访问信息
 */
export const reportUserAccess = (meta: {
  projectId: string | number;
  prId: number;
  pullRequestId: number;
}) => {
  monitor.log({
    code: 15,
    msg: '',
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.pullRequestId,
  });
};

/**
 * 记录仓库 master 分支主语言
 * @param repoLanguage {string} 仓库 master 分支主语言
 * @param meta {object}
 */
export const reportRepoMainLang = (
  repoLanguage: string,
  repoLanguages: string[],
  meta: {
    projectId: string | number;
    prId: number;
    pullRequestId: number;
  }
) => {
  monitor.log({
    code: 16,
    msg: '',
    d1: repoLanguage,
    d2: repoLanguages.join(','),
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.pullRequestId,
  });
};

/**
 * 记录仓库 master 分支主语言
 * @param repoLanguage {string} 仓库 master 分支主语言
 * @param prLanguage {string} pr 内容的主语言
 * @param meta {object}
 */
export const reportChangeFilesMainLang = (
  prLanguage: string,
  prLanguages: string[],
  meta: {
    projectId: string | number;
    prId: number;
    pullRequestId: number;
  }
) => {
  monitor.log({
    code: 17,
    msg: '',
    d1: prLanguage,
    d2: prLanguages.join(','),
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.pullRequestId,
  });
};

/**
 * 记录无法识别语言的文件
 * @param extname {string}
 * @param filename {string}
 * @param meta {object}
 */
export const reportCannotRecognizeFile = (
  extname: string,
  filename: string,
  meta: {
    projectId: string | number;
    prId: number;
    pullRequestId: number;
  }
) => {
  monitor.log({
    code: 18,
    msg: '',
    d1: extname,
    d2: filename,
    c1: meta.projectId,
    c2: meta.prId,
    c3: meta.pullRequestId,
  });
};
