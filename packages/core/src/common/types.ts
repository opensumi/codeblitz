import { BrowserFS } from '../server/node';

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

export interface RuntimeConfig {
  // 场景
  scene?: string;
  // git 配置
  git?: {
    project: string;
    branch?: string;
    commit?: string;
  };
  // memfs 配置
  memfs?: {
    // 文件索引
    fileIndex: FileIndex;
    // 初始打开全部文件
    openAll?: boolean;
    // 默认打开文件
    defaultOpenFile?: string;
  };
}
