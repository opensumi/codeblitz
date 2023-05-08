const path = require('path');
const webpack = require('webpack');
const { nodePolyfill, manifestSeed, config } = require('./util');
const isDev = process.env.NODE_ENV === 'development';
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  stats: 'errors-only',
  entry: {
    [config.odpsEntry]: '../sql-service/src/worker/ODPSWorker.ts',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `[name].${isDev ? 'js' : '[contenthash:8].js'}`,
    libraryTarget: 'umd',
  },
  target: 'webworker',
  optimization: {
    sideEffects: true,
  },
  devtool: isDev ? 'inline-source-map' : false,
  mode: 'development',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [{ loader: 'source-map-loader' }],
      //   enforce: 'pre',
      // },
      {
        test: /\.tsx?$/,
        use: [
          // { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true, compilerOptions: { target: 'es2018' } },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    // alias: {
    //   antlr4: path.resolve('node_modules/antlr4'),
    // },
    fallback: {
      fs: false,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // node: {
  //   fs: 'empty',
  //   module: 'empty',
  // },
  // resolve: {
  //   alias: {
  //     ...nodePolyfill.alias,
  //   },
  //   fallback: {
  //     ...nodePolyfill.fallback,
  //   },
  // },
  plugins: [
    // Merge chunks for UMD bundle
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new WebpackManifestPlugin({
      publicPath: '',
      seed: manifestSeed,
      useEntryKeys: true,
    }),
    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
    // new webpack.IgnorePlugin(
    //   /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
    //   /vs\/language\/typescript\/lib/,
    // ),
    // Fix webpack warning https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/13#issuecomment-390806320
    new webpack.ContextReplacementPlugin(
      /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
      __dirname
    ),
  ],
};
