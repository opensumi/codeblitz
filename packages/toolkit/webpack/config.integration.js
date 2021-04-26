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

const HOST = process.env.HOST || 'localhost';

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
                  modifyVars: {
                    'kt-html-selector': 'alex-root',
                    'kt-body-selector': 'alex-root',
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
        ...option.define,
      }),
      new webpack.ProvidePlugin({
        ...nodePolyfill.provider,
      }),
      ...(option.copy ? [new CopyPlugin(option.copy)] : []),
      // new ForkTsCheckerWebpackPlugin({
      //   typescript: {
      //     configFile: option.tsconfigPath,
      //   },
      // }),
      new BannerPlugin({
        banner: async () => {
          const content = await new Promise((resolve, reject) => {
            https
              .get(
                'https://gw-office.alipayobjects.com/bmw-prod/f8d166cf-e3fb-49e6-bad8-2b63630829b3.js',
                (res) => {
                  res.setEncoding('utf8');
                  let rawData = '';
                  res.on('data', (chunk) => {
                    rawData += chunk;
                  });
                  res.on('end', () => {
                    resolve(rawData);
                  });
                }
              )
              .on('error', reject);
          });
          return `// global loader
(function(){
var module;
var require;
// ==================== LOADER SOURCE START ====================
${content}
// ==================== LOADER SOURCE END ====================
window.amdLoader = amdLoader;
window.AMDLoader = AMDLoader;
window.define = define;
}).call(window);
`;
        },
        raw: true,
        entryOnly: true,
      }),
      ...(isDev
        ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: option.template || path.join(__dirname, '../public/index.html'),
              publicPath: '/',
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
          ]),
    ],
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
