const path = require('path');
const fs = require('fs');
const createWebpackConfig = require('./config.integration');
const { config } = require('./util');
const define = require('../define.json');

process.env.NODE_ENV = 'production';

module.exports = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  outputPath: path.join(__dirname, '../../alex/bundle'),
  define: Object.keys(define).reduce((obj, key) => {
    obj[key] = JSON.stringify(obj[key]);
    return obj;
  }, {}),
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appEntry]: './packages/alex/src/index',
    },
    output: {
      library: 'Alex',
      libraryTarget: 'umd',
    },
    externals({ context, request }, callback) {
      if (/^antd/.test(request) || request === 'react' || request === 'react-dom') {
        // Externalize to a commonjs module using the request path
        return callback(null, 'commonjs ' + request);
      }

      // Continue without externalizing the import
      callback();
    },
    optimization: {
      minimize: false,
    },
  },
});
