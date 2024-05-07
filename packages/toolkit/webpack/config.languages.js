const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { config } = require('./util');

module.exports = () => {
  return {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.languageGlobalEntry]: './packages/core/languages/index.js',
      [config.languageGlobalMinEntry]: './packages/core/languages/index.js',
    },
    output: {
      path: path.resolve(__dirname, '../../core/languages'),
      library: 'AlexLanguages',
      libraryTarget: 'global',
    },
    devtool: false,
    mode: 'production',
    resolve: {
      extensions: ['.js', '.json'],
    },
    externals: {
      '@codeblitzjs/ide-registry': 'CodeBlitz',
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
