import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export interface WebpackConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

export interface ConfigParam {
  tsconfigPath: string;
  mode?: 'development' | 'production';
  outputPath?: string;
  template?: string;
  inlineLimit?: number;
  define?: Record<string, any>;
  copy?: ConstructorParameters<typeof CopyWebpackPlugin>[0];
  webpackConfig?: WebpackConfiguration;
}

export interface ConfigFn {
  (param: ConfigParam): Promise<WebpackConfiguration>;
}

export { WebpackConfiguration };
