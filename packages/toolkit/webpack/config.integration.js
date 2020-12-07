/**
 * @typedef {import('./config').WebpackConfiguration} Configuration
 * @typedef {import('./config').ConfigParam} ConfigParam
 * @typedef {import('./config').ConfigFn} ConfigFn
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');
const notifier = require('node-notifier');

const { nodePolyfill } = require('./util');
const { findPort } = require('./util/find-porter');

const defaultPort = process.env.PORT || 9009;

/** @type {ConfigFn} */
module.exports = async (config) => {
  const port = await findPort(defaultPort);

  const outputPath = path.resolve(config.outputPath || 'dist');
  const mode = config.mode || 'development';
  const isDev = mode === 'development';

  const styleLoader = isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader;

  /** @type {Configuration} */
  const baseConfig = {
    mode,
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
      plugins: [
        new TsconfigPathsPlugin.default({
          ...(config.tsconfigPath ? { configFile: config.tsconfigPath } : {}),
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
                configFile: config.tsconfigPath,
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
                limit: config.inlineLimit || 10000,
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
        template: config.template || path.join(__dirname, '../public/index.html'),
      }),
      new webpack.DefinePlugin({
        'process.env': {
          IS_DEV: isDev,
          EXTENSION_WORKER_HOST: isDev
            ? JSON.stringify(
                `/assets/~${
                  process.env.EXTENSION_WORKER_PATH ||
                  path.join(__dirname, '../dist/worker-host.js')
                }`
              )
            : '', // TODO: cdn 地址
        },
        ...config.define,
      }),
      new webpack.ProvidePlugin({
        ...nodePolyfill.provider,
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://localhost:${port}`],
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
      ...(config.copy ? [new CopyPlugin(config.copy)] : []),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: config.tsconfigPath,
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
      // before(app) {
      //   app.get('/assets', (req, res) => {
      //     const { path: filePath } = req.query;
      //     if (!filePath) {
      //       res.status(404)
      //       res.send('file is not exist')
      //       return;
      //     }
      //     // @ts-ignore
      //     res.sendFile(filePath, {
      //       headers: {
      //         'Access-Control-Allow-Origin': '*'
      //       }
      //     })
      //   })
      // },
    },
  };

  return merge(baseConfig, config.webpackConfig);
};
