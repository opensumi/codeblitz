// tslint:disable:no-var-requires
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const merge = require('webpack-merge');

const utils = require('./utils');

const tsConfigPath = path.join(__dirname, '../../../tsconfig.json');
const port = process.env.IDE_FRONT_PORT || 8080;

console.log('front port', port);

const styleLoader = process.env.NODE_ENV === 'production'
  ? MiniCssExtractPlugin.loader
  : require.resolve('style-loader');

/**
 * @param {{ webpackConfig: any, tsconfigPath?: string, env: string, outputPath: string, template: string }} config 
 */
exports.createWebpackConfig = function(config) {
  const absOutputPath = path.resolve(config.outputPath || 'dist');

  const baseConfig = {
    mode: config.env || 'development',
    devtool: 'inline-cheap-source-map',
    output: {
      path: absOutputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
      plugins: [
        new TsconfigPathsPlugin({
          ...(tsConfigPath ? { configFile: tsConfigPath } : {})
        })
      ]
    },
    node: {
      net: "empty",
      child_process: "empty",
      path: "empty",
      url: false,
      fs: "empty",
      process: "mock"
    },
    optimization: {
      nodeEnv: config.env,
    },
    module: {
      // https://github.com/webpack/webpack/issues/196#issuecomment-397606728
      exprContextCritical: false,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                cacheDirectory: process.env.BABEL_CACHE !== 'none'
                  ? path.resolve('.cache/babel-loader')
                  : false,
                presets: [
                  [require('@babel/preset-env').default, {
                    exclude: [
                      'transform-typeof-symbol',
                      'transform-unicode-regex',
                      'transform-sticky-regex',
                      'transform-new-target',
                      'transform-modules-umd',
                      'transform-modules-systemjs',
                      'transform-modules-amd',
                      'transform-literals',
                    ]
                  }],
                  [require('@babel/preset-react').default],
                  [require('@babel/preset-typescript'), {
                    allowNamespaces: true,
                  }]
                ],
                plugins: [
                  require('@babel/plugin-syntax-top-level-await').default,
                  [
                    require('@babel/plugin-transform-destructuring').default,
                    { loose: false },
                  ],
                  [
                    require('@babel/plugin-proposal-decorators').default,
                    { legacy: true }
                  ],
                  [
                    require('@babel/plugin-proposal-class-properties').default,
                    { loose: true },
                  ],
                  require('@babel/plugin-proposal-export-default-from').default,
                  [
                    require('@babel/plugin-proposal-pipeline-operator').default,
                    {
                      proposal: 'minimal',
                    },
                  ],
                  require('@babel/plugin-proposal-do-expressions').default,
                  require('@babel/plugin-proposal-function-bind').default,
                  require('@babel/plugin-proposal-logical-assignment-operators').default,
                ]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [styleLoader, 'css-loader'],
        },
        {
          test: /\.module.less$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: true,
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              }
            }
          ]
        },
        {
          test: /^((?!\.module).)*less$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              }
            }
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp|ico)(\?.*)?$/,
          use: 'url-loader',
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
            }
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              esModule: false,
            }
          }]
        },
        {
          test: /\.(txt|text|md)$/,
          use: 'raw-loader'
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: config.template,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
        chunkFilename: '[id].css',
      }),
      new webpack.DefinePlugin(config.define || {}),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://localhost:${port}`],
        },
        onErrors: utils.createNotifierCallback(),
        clearConsole: true,
      }),
      new CopyPlugin(...(
        config.copy
          ? config.copy.map((from) => ({
              from: path.resolve(from),
              to: absOutputPath,
            }))
          : []
      )),
      new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        tsconfig: tsConfigPath,
        reportFiles: ['packages/**/*.{ts,tsx}']
      }),
    ],
  }

  return merge(baseConfig, config.webpackConfig)
}
