/**
 * @typedef {import('./util/type').WebpackConfiguration} Configuration
 * @typedef {import('./util/type').ConfigOption} ConfigOption
 * @typedef {import('./util/type').ConfigFn} ConfigFn
 */

const path = require('path');
const fs = require('fs');
const https = require('https');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('./util/tsconfig-paths-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');
const notifier = require('node-notifier');
const BundleAnalyzerPlugin = require('umi-webpack-bundle-analyzer').BundleAnalyzerPlugin;

const BannerPlugin = require('./util/banner-plugin');
const { nodePolyfill } = require('./util');
const { findPortSync } = require('./util/find-porter');
const { config } = require('./util');
const pkg = require('../../../package.json');

const defaultHost = 'localhost';
const HOST = process.env.HOST || defaultHost;

/** @type {ConfigFn} */
module.exports = (option) => {
  const port = findPortSync(option.port || process.env.PORT || 9009);

  const outputPath = option.outputPath || path.resolve(__dirname, '../dist');
  const mode = option.mode || 'development';
  const isDev = mode === 'development';
  const baseURL = `http://${HOST}:${port}`;

  const styleLoader = isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader;

  /** @type {Configuration} */
  const baseConfig = {
    mode,
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      // 不能改成 `./`, 否则无法加载
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
      plugins: [
        // @ts-ignore
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
      unknownContextCritical: false,
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
                  modifyVars: {
                    'html-selector': 'alex-root',
                    'body-selector': 'alex-root',
                  },
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
                    publicPath: './',
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
                publicPath: './',
              },
            },
          ],
        },
        {
          test: /\.(txt|text|md)$/,
          use: 'raw-loader',
        },
      ],
      parser: {
        javascript: {
          dynamicImportMode: 'eager',
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          IS_DEV: isDev,
        },
        __WORKER_HOST__: process.env.WORKER_PATH
          ? JSON.stringify(`/assets/~${process.env.WORKER_PATH}`)
          : JSON.stringify(`${baseURL}/${config.workerEntry}.js`),
        __WEBVIEW_ENDPOINT__: process.env.WEBVIEW_ENDPOINT
          ? JSON.stringify(`/assets/~${process.env.WEBVIEW_ENDPOINT}`)
          : JSON.stringify(`${baseURL}/${config.webviewEntry}`),
        __WEBVIEW_SCRIPT__: JSON.stringify(''),
        __VERSION__: JSON.stringify(pkg.version),
        ...option.define,
      }),
      new webpack.ProvidePlugin({
        ...nodePolyfill.provider,
      }),
      ...(option.copy ? [new CopyPlugin(option.copy)] : []),
      !process.env.TS_NO_EMIT
        ? new ForkTsCheckerWebpackPlugin({
          typescript: {
            configFile: option.tsconfigPath,
          },
        })
        : null,
      ...(isDev
        ? [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: option.template || path.join(__dirname, '../public/index.html'),
            publicPath: './',
            integration: process.env.INTEGRATION,
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
        ]
        : [
          new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
          }),
          ...(process.env.ANALYZE === '1' ? [new BundleAnalyzerPlugin()] : []),
          // 打 bundle 包不分 chunks
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
          }),
        ]),
    ].filter(Boolean),
    devServer: {
      port,
      disableHostCheck: true,
      host: '0.0.0.0',
      openPage: `http://${HOST}:${port}`,
      stats: 'errors-only',
      overlay: true,
      open: process.env.OPEN === 'true',
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
