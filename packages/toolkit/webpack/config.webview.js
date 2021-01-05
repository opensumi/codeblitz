const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { config } = require('./util');

module.exports = (option = {}) => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    entry: {
      [config.webviewEntry]: require.resolve('@ali/ide-webview/lib/webview-host/web-preload'),
    },
    output: {
      filename: `[name].${isDev ? 'js' : '[contenthash:8].js'}`,
      path: path.resolve(__dirname, '../dist'),
    },
    devtool: isDev ? 'inline-source-map' : false,
    mode: isDev ? 'development' : 'production',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'webview/index.html',
        template: option.template || path.join(__dirname, '../public/webview.html'),
      }),
    ],
  };
};
