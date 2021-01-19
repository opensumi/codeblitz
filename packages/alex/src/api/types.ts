import { IAppOpts, RuntimeConfig } from '@alipay/alex-core';

export type IAppConfig = Partial<IAppOpts>;

export interface IConfig {
  /**
   * 应用相关配置
   */
  appConfig?: IAppConfig | (() => IAppConfig);
  /**
   * 运行相关配置
   */
  runtimeConfig?: RuntimeConfig;
}
