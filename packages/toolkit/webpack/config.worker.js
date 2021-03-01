const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { nodePolyfill, config, manifestSeed } = require('./util');

module.exports = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    entry: {
      [config.workerEntry]: require.resolve(
        '@ali/ide-kaitian-extension/lib/hosted/worker.host-preload'
      ),
    },
    output: {
      filename: `[name].${isDev ? 'js' : '[contenthash:8].js'}`,
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
      new WebpackManifestPlugin({
        publicPath: '',
        seed: manifestSeed,
        useEntryKeys: true,
      }),
      new webpack.ProvidePlugin({
        ...nodePolyfill.provider,
      }),
    ],
    stats: 'errors-only',
  };
};
