const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { config } = require('./util');

module.exports = () => {
  return {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.languageUmdEntry]: './packages/alex/languages/index.js',
      [config.languageUmdMinEntry]: './packages/alex/languages/index.js',
    },
    output: {
      path: path.resolve(__dirname, '../../alex/languages'),
      library: 'AlexLanguages',
      libraryTarget: 'umd',
    },
    devtool: false,
    mode: 'production',
    resolve: {
      extensions: ['.js', '.json'],
    },
    externals: {
      '@alipay/alex-registry': {
        root: ['Alex', 'Registry'],
        commonjs2: ['@alipay/alex/bundle/alex.umd', 'Registry'],
        commonjs: ['@alipay/alex/bundle/alex.umd', 'Registry'],
        amd: ['@alipay/alex/bundle/alex.umd', 'Registry'],
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          include: /\.min\.js$/,
        }),
      ],
    },
  };
};
