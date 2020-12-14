const path = require('path');
const webpack = require('webpack');

const { nodePolyfill } = require('./util');

const isDev = process.env.IS_DEV === '1';

module.exports = {
  entry: require.resolve('@ali/ide-kaitian-extension/lib/hosted/worker.host-preload'),
  output: {
    filename: isDev ? 'worker-host.js' : 'worker-host.[hash:6].js',
    path: path.resolve(__dirname, '../dist'),
  },
  target: 'webworker',
  devtool: isDev ? 'inline-source-map' : false,
  mode: isDev ? 'development' : 'production',
  resolve: {
    alias: {
      '@ali/ide-connection$': '@ali/ide-connection/lib/common/rpcProtocol.js',
      '@ali/vscode-jsonrpc$': '@ali/vscode-jsonrpc/lib/cancellation.js',
      ...nodePolyfill.alias,
    },
    fallback: {
      ...nodePolyfill.fallback,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      ...nodePolyfill.provider,
    }),
  ],
};
