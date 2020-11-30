const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const threadLoader = require('thread-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const notifier = require('node-notifier')

threadLoader.warmup({}, ['ts-loader'])

const tsConfigPath = path.join(__dirname, '../../tsconfig.json')
const port = process.env.IDE_FRONT_PORT || 9009

const styleLoader =
  process.env.NODE_ENV === 'production'
    ? MiniCssExtractPlugin.loader
    : require.resolve('style-loader')

module.exports = (env) => ({
  entry: env.entry,
  node: {
    net: 'empty',
    child_process: 'empty',
    path: 'empty',
    url: false,
    fs: 'empty',
    process: 'mock',
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
      }),
    ],
  },
  bail: true,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    // https://github.com/webpack/webpack/issues/196#issuecomment-397606728
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? {
                loader: 'cache-loader',
                options: {
                  cacheDirectory: path.resolve(__dirname, '.cache'),
                },
              }
            : null,
        ]
          .filter(Boolean)
          .concat([
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length - 1,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
                transpileOnly: true,
                configFile: tsConfigPath,
                compilerOptions: {
                  target: 'es2015',
                },
              },
            },
          ]),
      },
      {
        test: /\.png$/,
        use: 'file-loader',
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
              localIdentName: '[local]___[hash:base64:5]',
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
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
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
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../../node_modules')],
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    mainFields: ['loader', 'main'],
    moduleExtensions: ['-loader'],
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.IS_DEV': 1,
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://localhost:${port}`],
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return
        }
        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()
        notifier.notify({
          title: 'webpack error',
          message: filename,
        })
      },
      clearConsole: true,
    }),
    // new ForkTsCheckerWebpackPlugin({
    //   typescript: {
    //     typescriptPath: tsConfigPath
    //   }
    // }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port,
    disableHostCheck: true,
    host: '0.0.0.0',
    useLocalIp: true,
    proxy: {},
    stats: 'errors-only',
    overlay: true,
    open: process.env.KAITIAN_DEV_OPEN_BROWSER ? true : false,
    hot: true,
  },
})
