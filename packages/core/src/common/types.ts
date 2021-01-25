import type * as vscode from 'vscode';
import { Event } from '@ali/ide-core-common';
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

export interface RuntimeConfig {
  // 场景标识
  scenario?: string;
  // 工作空间配置
  workspace?: {
    filesystem?: FileSystemConfiguration;
    onDidSaveTextDocument?: (data: { filepath: string; content: string }) => void;
  };
  // 基于 git repository 的配置
  git?: {
    baseURL: string;
    // 项目 IDE
    projectId?: number;
    // 项目名称 group/repository
    project: string;
    // 分支
    branch?: string;
    // commit sha
    commit?: string;
  };
  // 默认打开文件
  defaultOpenFile?: string | string[];
  // 禁止文件树更改，此时无法新增、删除、重命名文件
  disableModifyFileTree?: boolean;
}
