import { IPluginConfig } from '@codeblitzjs/ide-plugin';
import { IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import { Event } from '@opensumi/ide-core-common';
import { IResourceOpenOptions } from '@opensumi/ide-editor';
import { IAppInstance } from '../../editor';
import { LandingProps } from '../types';

export interface IResourceOpenDiffOptions extends IResourceOpenOptions {
  overwriteOldCode?: boolean;
}

export interface IExtendPartialEditEvent extends IPartialEditEvent {
  filePath: string;
}

export interface IDiffViewerHandle {
  openDiffInTab: (filePath: string, oldContent: string, newContent: string, options?: IResourceOpenDiffOptions) => void;
  openTab: (filePath: string, options?: IResourceOpenOptions) => void;
  closeTab: (filePath: string) => void;
  getFileContent: (filePath: string) => Promise<string>;
  acceptAllPartialEdit: () => Promise<void>;
  rejectAllPartialEdit: () => Promise<void>;
  onPartialEditEvent: Event<IExtendPartialEditEvent>;
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
