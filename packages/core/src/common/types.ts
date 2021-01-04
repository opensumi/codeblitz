import { BrowserFS } from '../server/node';

export type RootFS = InstanceType<typeof BrowserFS.FileSystem.MountableFileSystem>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}

export const RuntimeConfig = Symbol('RuntimeConfig');

export interface RuntimeConfig {
  // 场景
  scene?: string;
  // git 配置
  git?: {
    project: string;
    branch?: string;
    commit?: string;
  };
}
