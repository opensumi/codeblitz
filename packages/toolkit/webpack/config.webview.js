const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { config, manifestSeed } = require('./util');

module.exports = (option = {}) => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    entry: {
      [config.webviewEntry]: require.resolve('@opensumi/ide-webview/lib/webview-host/web-preload'),
    },
    output: {
      filename: `[name].${isDev ? 'js' : '[contenthash:8].js'}`,
      path: path.resolve(__dirname, '../../sumi-core/resources'),
    },
    devtool: isDev ? 'inline-source-map' : false,
    mode: isDev ? 'development' : 'production',
    plugins: [
      new WebpackManifestPlugin({
        publicPath: '',
        seed: manifestSeed,
        useEntryKeys: true,
        removeKeyHash: /\.[a-f0-9]{8}/gi,
      }),
      new HtmlWebpackPlugin({
        filename: `[name]${isDev ? '' : '.[contenthash:8]'}/index.html`,
        template: option.template || path.join(__dirname, '../public/webview.html'),
        inject: false,
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  };
};
