import CopyWebpackPlugin from 'copy-webpack-plugin';
import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';

export interface WebpackConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

export interface ConfigOption {
  /**
   * tsconfig 路径
   */
  tsconfigPath: string;
  /**
   * webpack mode
   */
  mode?: 'development' | 'production';
  /**
   * 输出 路径
   */
  outputPath?: string;
  /**
   * 模板路径
   */
  template?: string;
  /**
   * uri-loader limit
   */
  inlineLimit?: number;
  /**
   * DefineProvider
   */
  define?: Record<string, any>;
  /**
   * CopyPlugin
   */
  copy?: ConstructorParameters<typeof CopyWebpackPlugin>[0];
  /**
   * 默认端口
   */
  port?: number;
  /**
   * 是否使用本地的 worker-host 好 webview host 资源
   */
  useLocalWorkerAndWebviewHost?: boolean;
  /**
   * webpack 配置
   */
  webpackConfig?: WebpackConfiguration;
}

export interface ConfigFn {
  (option: ConfigOption): WebpackConfiguration;
}
