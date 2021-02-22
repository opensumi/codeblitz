import { BrowserFS, FileSystemConfiguration } from '../server/node';

export { AppConfig } from '@ali/ide-core-browser';

export type RootFS = InstanceType<typeof BrowserFS.FileSystem.MountableFileSystem>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}

export const RuntimeConfig = Symbol('RuntimeConfig');

interface CodeServicePlatform {
  /** 平台 */
  platform: 'antcode' | 'gitlab' | 'github';
  /** location.origin */
  origin: string;
  /** 用于接口请求，不设置为 origin */
  endpoint?: string;
}

interface CodeServiceProject extends CodeServicePlatform {
  /** 群组或用户 */
  owner: string;
  /** 仓库名 */
  name: string;
  /** ref */
  ref?: string;
  /** tag */
  tag?: string;
  /** branch */
  branch?: string;
  /** commit sha */
  commit?: string;
}

interface CodeServiceHost extends CodeServicePlatform {
  /** 从代码托管平台跳转过来的路径，解析出 ref，如 /microsoft/vscode/main/README.md  */
  path: string;
}

export type CodeServiceConfig = CodeServiceProject | CodeServiceHost;

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
  codeService?: CodeServiceConfig;
  /** 默认打开的文件，多个文件时，会展示最右边的文件 */
  defaultOpenFile?: string | string[];
  /** 禁止文件树更改，此时无法新增、删除、重命名文件 */
  disableModifyFileTree?: boolean;
}
