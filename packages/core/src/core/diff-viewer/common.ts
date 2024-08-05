import { IPluginConfig } from '@codeblitzjs/ide-plugin';
import { IAppOpts, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import { Event, URI } from '@opensumi/ide-core-common';
import { IResourceOpenOptions } from '@opensumi/ide-editor';
import { IAppInstance } from '../../editor';
import { LandingProps } from '../types';
import { ITheme } from '@opensumi/ide-theme';

export interface IResourceOpenDiffOptions extends IResourceOpenOptions {
  overwriteOldCode?: boolean;
}

export interface IExtendPartialEditEvent extends IPartialEditEvent {
  filePath: string;
}

export interface IDiffViewerTab {
  index: number;
  filePath: string;
}

export interface IDiffViewerHandle {
  openFileInTab: (filePath: string, content: string, options?: IResourceOpenOptions) => Promise<URI>;
  /**
   * 展示 Inline Diff 预览
   */
  openDiffInTab: (
    filePath: string,
    oldContent: string,
    newContent: string,
    options?: IResourceOpenDiffOptions,
  ) => Promise<void>;
  /**
   * 打开标签页
   */
  openTab: (filePath: string, options?: IResourceOpenOptions) => Promise<void>;
  /**
   * 关闭标签页
   */
  closeTab: (filePath: string) => Promise<void>;
  closeAllTab: () => Promise<void>;
  /**
   * 获取指定路径的文件内容
   */
  getFileContent: (filePath: string) => Promise<string>;
  acceptAllPartialEdit: () => Promise<void>;
  rejectAllPartialEdit: () => Promise<void>;
  /**
   * 监听采纳、拒绝部分编辑事件
   */
  onPartialEditEvent: Event<IExtendPartialEditEvent>;

  getCurrentTab: () => IDiffViewerTab | undefined;
  getTabAtIndex: (index: number) => IDiffViewerTab | undefined;
  getAllTabs: () => IDiffViewerTab[];

  dispose(): void;
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

  onWillApplyTheme?: (theme: ITheme) => Record<string, string | undefined>;
  tabBarRightExtraContent?: React.ReactNode;
}
