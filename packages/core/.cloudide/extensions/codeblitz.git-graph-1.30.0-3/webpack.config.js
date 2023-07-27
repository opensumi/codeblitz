// @ts-check

const path = require('path');
const webpack = require('webpack')
const outputPath = path.join(__dirname, 'dist');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.join(__dirname, 'src/extension'),
  output: {
    filename: 'extension.js',
    path: outputPath,
    libraryTarget: 'commonjs2',
  },
  devtool: false,
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
    alias: {
      buffer: require.resolve('buffer/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
							configFile: path.join(__dirname, 'src/tsconfig.json'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  target: 'webworker',
  externals: {
    vscode: 'commonjs vscode',
    kaitian: 'commonjs kaitian',
  },
};
