const path = require('path');
const createWebpackConfig = require('./config.integration');
const { config } = require('./util');

process.env.NODE_ENV = 'production';

module.exports = createWebpackConfig({
  mode: 'production',
  tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
  webpackConfig: {
    context: path.join(__dirname, '../../..'),
    entry: {
      [config.appEntry]: './packages/alex/src/index',
    },
    externals({ context, request }, callback) {
      if (/(^antd)|react|react-dom/.test(request)) {
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
