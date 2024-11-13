const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const createWebpackConfig = require('./config.integration');
const { config } = require('./util');
const define = require('../define.json');

process.env.NODE_ENV = 'production';

const libBundle = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  outputPath: path.join(__dirname, '../../core/bundle'),
  define: {
    ...Object.keys(define).reduce((obj, key) => {
      obj[key] = JSON.stringify(define[key]);
      return obj;
    }, {}),
    __non_webpack_require__: '() => {}',
  },
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appEntry]: './packages/core/src',
      [config.editorEntry]: './packages/core/src/editor',
      [config.editorAllEntry]: './packages/core/src/editor.all',
    },
    // 此处 bundle 的包仅作为 commonjs 使用，但因为 external 原因会导致 webpack4 加载 bundle 出错，因此还是使用 umd
    output: {
      library: 'AlexLib',
      libraryTarget: 'umd',
    },
    externals: [
      {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react',
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom',
        },
        moment: {
          root: 'moment',
          commonjs2: 'moment',
          commonjs: 'moment',
          amd: 'moment',
        },
      },
      '@codeblitzjs/ide-registry',
    ],
    optimization: {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
    },
    experiments: {
      asyncWebAssembly: true, // 启用 WebAssembly 支持
    },
  },
});

const libBundleWithReact = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  outputPath: path.join(__dirname, '../../core/bundle'),
  define: {
    ...Object.keys(define).reduce((obj, key) => {
      obj[key] = JSON.stringify(define[key]);
      return obj;
    }, {}),
    __non_webpack_require__: '() => {}',
  },
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appEntryWithReact]: './packages/core/src',
    },
    // 此处 bundle 的包仅作为 commonjs 使用，但因为 external 原因会导致 webpack4 加载 bundle 出错，因此还是使用 umd
    output: {
      library: 'AlexLib',
      libraryTarget: 'umd',
    },
    externals: [
      // 此处没有 external React，将 React 打包进去以应对 React16 的集成方
      {
        moment: {
          root: 'moment',
          commonjs2: 'moment',
          commonjs: 'moment',
          amd: 'moment',
        },
      },
      '@codeblitzjs/ide-registry',
    ],
    optimization: {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
    },
    experiments: {
      asyncWebAssembly: true, // 启用 WebAssembly 支持
    },
  },
});

const globalBundle = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  outputPath: path.join(__dirname, '../../core/bundle'),
  define: Object.keys(define).reduce((obj, key) => {
    obj[key] = JSON.stringify(define[key]);
    return obj;
  }, {}),
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appGlobalEntry]: './packages/core/src',
      [config.appGlobalMinEntry]: './packages/core/src',
      [config.editorAllGlobalEntry]: './packages/core/src/editor.all',
      [config.editorAllGlobalMiniEntry]: './packages/core/src/editor.all',
    },
    output: {
      library: 'Alex',
      libraryTarget: 'global',
    },
    externals: [
      {
        react: 'React',
        'react-dom': 'ReactDOM',
        moment: 'moment',
      },
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          include: /\.min\.js$/,
        }),
        new CssMinimizerPlugin({
          include: /\.min\.css$/,
        }),
      ],
      concatenateModules: false,
      splitChunks: false,
    },
  },
});


const globalBundleWithReact = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  outputPath: path.join(__dirname, '../../core/bundle'),
  define: Object.keys(define).reduce((obj, key) => {
    obj[key] = JSON.stringify(define[key]);
    return obj;
  }, {}),
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appGlobalMinWithReactEntry]: './packages/core/src',
    },
    output: {
      library: 'Alex',
      libraryTarget: 'global',
    },
    externals: [
      {
        moment: 'moment',
      },
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          include: /\.min\.js$/,
        }),
        new CssMinimizerPlugin({
          include: /\.min\.css$/,
        }),
      ],
      concatenateModules: false,
      splitChunks: false,
    },
  },
});

module.exports = [libBundle, libBundleWithReact, globalBundle, globalBundleWithReact];