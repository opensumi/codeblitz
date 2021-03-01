const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { config, manifestSeed } = require('./util');

module.exports = (option = {}) => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    entry: {
      [config.webviewEntry]: require.resolve('@ali/ide-webview/lib/webview-host/web-preload'),
    },
    output: {
      filename: `[name].${isDev ? 'js' : '[contenthash:8].js'}`,
      path: path.resolve(__dirname, `../dist`),
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
        filename: `[name].[contenthash:8]/index.html`,
        template: option.template || path.join(__dirname, '../public/webview.html'),
      }),
    ],
  };
};
