import { IAppOpts, RuntimeConfig, ClientApp } from '@alipay/alex-core';
import { IAppRenderer } from '@ali/ide-core-browser';

export type IAppConfig = Partial<IAppOpts> & {
  /**
   * 工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 根目录下
   */
  workspaceDir: string;
};

export interface IConfig {
  /**
   * 应用相关配置
   */
  appConfig: IAppConfig | (() => IAppConfig);
  /**
   * 运行相关配置
   */
  runtimeConfig: RuntimeConfig;
}

export interface IAppInstance extends ClientApp {
  /**
   * 启动应用
   * @param container 挂载位置
   */
  start(container: HTMLElement | IAppRenderer): Promise<void>;

  /**
   * 销毁应用
   */
  destroy(): void;
}
