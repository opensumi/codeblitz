import { IPluginConfig } from '@codeblitzjs/ide-plugin';
import { IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { IRange } from '@opensumi/ide-core-common';
import { IAppRendererProps } from '../../api/renderApp';
import { IAppConfig, IAppInstance } from '../../editor';
import { LandingProps } from '../types';

export const IDiffViewerService = Symbol('IDiffViewerService');
export interface IDiffViewerService {
}

export interface IDiffViewerHandle {
  openDiffInTab: (filePath: string, oldContent: string, newContent: string) => void;
  closeFile: (filePath: string) => void;
  onConflictSolved: (fn: (event: IConflictSolvedEvent) => void) => void;
}

export interface IConflictSolvedEvent {
  /**
   * 总冲突数
   */
  totalConflictsCount: number;
  /**
   * 已解决冲突数
   */
  solvedConflictsCount: number;
  /**
   * 未解决冲突数
   */
  leftConflictsCount: number;
  /**
   * 已添加行数
   */
  totalAddedLines: number;
  /**
   * 已删除行数
   */
  totalRemovedLines: number;
  /**
   * 是否所有冲突已解决
   */
  isAllConflictsSolved: boolean;

  /**
   * 当前冲突信息
   */
  currentConflict: {
    deletedLines: string[];
    addedLines: string[];
    isApplied: boolean;
    original: {
      range: IRange;
    };
    modified: {
      range: IRange;
    };
  };
  filePath: string;
}

export interface IOverrideAppConfig extends Partial<IAppOpts> {
  /**
   * 工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 根目录下
   */
  workspaceDir?: string;
  /**
   * 插件配置
   */
  plugins?: IPluginConfig;
  /**
   * 插件OSS地址
   * extensionOSSPath/publisher.name-version
   */
  extensionOSSPath?: string;
}

export interface IOverrideAppRendererConfig {
  /**
   * 应用相关配置
   */
  appConfig: IOverrideAppConfig;
  /**
   * 运行相关配置
   */
  runtimeConfig: RuntimeConfig;
}

export interface IOverrideAppRendererProps extends IOverrideAppRendererConfig {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const IDiffViewerProps = Symbol('IDiffViewerProps');
export interface IDiffViewerProps extends Partial<IOverrideAppRendererProps> {
  onRef: (handle: IDiffViewerHandle) => void;
}
