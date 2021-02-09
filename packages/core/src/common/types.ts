import { BrowserFS, FileSystemConfiguration } from '../server/node';

export { AppConfig } from '@ali/ide-core-browser';

export type RootFS = InstanceType<typeof BrowserFS.FileSystem.MountableFileSystem>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}

export const RuntimeConfig = Symbol('RuntimeConfig');

export interface FileIndex {
  [key: string]: FileIndex | string;
}

interface CodeServiceConfig {
  /** 平台 antcode | gitlab | github */
  platform: string;
  /** host */
  baseURL: string;
  /** 项目 ID */
  projectId?: number | string;
  /** 项目名称 group/repository */
  project: string;
  /** 分支 */
  branch?: string;
  /** commit sha */
  commit?: string;
}

/**
 * 运行时相关配置
 * 同时可作为应用的全局配置，可通过类型融合来扩展字段。(https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 */
export interface RuntimeConfig {
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
  };
  /** 基于代码服务的配置 */
  codeService?: CodeServiceConfig & {
    /** 静态资源转换 */
    transformStaticResource?(config: Required<CodeServiceConfig> & { path: string }): string;
  };
  /** 默认打开的文件 */
  defaultOpenFile?: string | string[];
  /** 禁止文件树更改，此时无法新增、删除、重命名文件 */
  disableModifyFileTree?: boolean;
}
