/**
 * @typedef {import('./util/type').WebpackConfiguration} Configuration
 * @typedef {import('./util/type').ConfigOption} ConfigOption
 * @typedef {import('./util/type').ConfigFn} ConfigFn
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('./util/tsconfig-paths-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');
const notifier = require('node-notifier');

const { nodePolyfill } = require('./util');
const { findPortSync } = require('./util/find-porter');
const { config } = require('./util');

/** @type {ConfigFn} */
module.exports = (option) => {
  const port = findPortSync(option.port || process.env.PORT || 9009);

  const outputPath = path.resolve(option.outputPath || 'dist');
  const mode = option.mode || 'development';
  const isDev = mode === 'development';
  const baseURL = `http://localhost:${port}`;

  const styleLoader = isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader;

  /** @type {Configuration} */
  const baseConfig = {
    mode,
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: option.tsconfigPath,
        }),
      ],
      fallback: {
        ...nodePolyfill.fallback,
      },
      alias: {
        ...nodePolyfill.alias,
      },
    },
    module: {
      // https://github.com/webpack/webpack/issues/196#issuecomment-397606728
      exprContextCritical: false,
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: option.tsconfigPath,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: styleLoader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.module.less$/,
          use: [
            {
              loader: styleLoader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                esModule: false,
                modules: {
                  mode: 'local',
                  localIdentName: '[local]___[hash:base64:5]',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /^((?!\.module).)*less$/,
          use: [
            {
              loader: styleLoader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                esModule: false,
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp|ico|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: option.inlineLimit || 10000,
                name: '[name].[ext]',
                // require 图片的时候不用加 .default
                esModule: false,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    esModule: false,
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.(txt|text|md)$/,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: option.template || path.join(__dirname, '../public/index.html'),
      }),
      new webpack.DefinePlugin({
        'process.env': {
          IS_DEV: isDev,
          WORKER_HOST: option.useLocalWorkerAndWebviewHost
            ? process.env.WORKER_PATH
              ? JSON.stringify(`/assets/~${process.env.WORKER_PATH}`)
              : JSON.stringify(`${baseURL}/${config.workerEntry}.js`)
            : '', // TODO: cdn 地址
          WEBVIEW_ENDPOINT: option.useLocalWorkerAndWebviewHost
            ? process.env.WEBVIEW_PATH
              ? JSON.stringify(`/assets/~${process.env.WEBVIEW_PATH}`)
              : JSON.stringify(`${baseURL}/${config.webviewEntry}`)
            : '', // TODO: cdn 地址
        },
        ...config.define,
      }),
      new webpack.ProvidePlugin({
        ...nodePolyfill.provider,
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: ${baseURL}`],
          notes: [],
        },
        onErrors: (severity, errors) => {
          if (severity !== 'error') {
            return;
          }
          /** @type {*} */
          const error = errors[0];
          notifier.notify({
            title: 'Webpack error',
            message: severity + ': ' + error.name,
            subtitle: error.file || '',
          });
        },
        clearConsole: true,
      }),
      ...(option.copy ? [new CopyPlugin(option.copy)] : []),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: option.tsconfigPath,
        },
      }),
      ...(isDev
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: '[name].[chunkhash:8].css',
              chunkFilename: '[id].css',
            }),
          ]),
    ],
    devServer: {
      port,
      disableHostCheck: true,
      host: '0.0.0.0',
      useLocalIp: true,
      stats: 'errors-only',
      overlay: true,
      open: process.env.OPEN ? true : false,
      hot: true,
      contentBasePublicPath: '/assets/~',
      contentBase: '/',
      quiet: true,
      staticOptions: {
        setHeaders: (res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
        },
      },
    },
  };

  return merge(baseConfig, option.webpackConfig);
};
