import { IReporter } from '@ali/ide-core-common';
import { BrowserFS, FileSystemConfiguration, FileSystemInstance } from '../server/node';

export { AppConfig } from '@ali/ide-core-browser';

export type RootFS = FileSystemInstance<'MountableFileSystem'>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}

export const RuntimeConfig = Symbol('RuntimeConfig');

export interface CodeServiceConfig {
  /** 平台 */
  platform: 'antcode' | 'gitlab' | 'github';
  /** location.origin */
  origin: string;
  /** 用于接口请求，不设置为 origin */
  endpoint?: string;
  /** 群组或用户 */
  owner: string;
  /** 仓库名 */
  name: string;
  /** 从代码托管平台跳转过来的路径，解析出 ref 和默认打开的文件，如 tree/master/README.md  */
  refPath?: string;
  /** ref */
  ref?: string;
  /** tag */
  tag?: string;
  /** branch */
  branch?: string;
  /** commit sha */
  commit?: string;
}

/**
 * 运行时相关配置
 * 同时可作为应用的全局配置，可通过类型融合来扩展字段。(https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 */
export interface RuntimeConfig {
  /*
   * 业务标识，用于内部埋点
   */
  biz: string;

  /**
   * 场景标识，目前用于 indexedDB store name 标识，暂不强制
   * 不填表示为默认场景，此时同一域名会共享 indexedDB
   * 如果指定为 null，表示不作为一个场景，此时不使用 indexedDB，也即不缓存工作空间及全局偏好设置等数据
   */
  scenario?: string | null;
  /** 工作空间配置 */
  workspace?: {
    filesystem?: FileSystemConfiguration;
    onDidSaveTextDocument?: (data: { filepath: string; content: string }) => void;
    onDidChangeTextDocument?: (data: { filepath: string; content: string }) => void;
  };
  /** 基于代码服务的配置 */
  codeService?: CodeServiceConfig;
  /** 默认打开的文件，多个文件时，会展示最右边的文件 */
  defaultOpenFile?: string | string[];
  /** 禁止文件树更改，此时无法新增、删除、重命名文件 */
  disableModifyFileTree?: boolean;
  /** 注销左下角 bar */
  unregisterActivityBarExtra?: boolean;
  /** 隐藏左侧 tabbar */
  hideLeftTabBar?: boolean;
  /**
   * 启动时打开的 editor
   * none 不打开任何 editor
   * welcomePage 打开欢迎页
   * 后续考虑支持 'readme', 'newUntitledFile', 'welcomePageInEmptyWorkbench', 'gettingStarted'
   * @default welcomePage
   */
  startupEditor?: 'none' | 'welcomePage';
  /**
   * 隐藏编辑器区 tab
   */
  hideEditorTab?: boolean;
  /**
   * reporter 服务，可获取内部上报的埋点相关数据
   */
  reporter?: IReporter;
  /**
   * 配置需注销的快捷键
   */
  unregisterKeybindings?: string[];
}
