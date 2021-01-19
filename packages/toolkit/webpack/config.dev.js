const path = require('path');
const createWebpackConfig = require('./config.integration');
const createWorkerConfig = require('./config.worker');
const createWebviewConfig = require('./config.webview');
const getLocalExtensions = require('./util/scan-extension');
const { config } = require('./util');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

process.env.NODE_ENV = 'development';

module.exports = () => {
  const integrationConfig = createWebpackConfig({
    tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
    useLocalWorkerAndWebviewHost: true,
    webpackConfig: {
      context: path.join(__dirname, '../../..'),
      entry: {
        [config.appEntry]: `./packages/alex/src/integration/${
          process.env.INTEGRATION || 'startup'
        }`,
      },
      devtool: 'eval-cheap-module-source-map',
      devServer: {
        proxy: {
          '/code-service': {
            target: 'https://code.alipay.com',
            headers: {
              'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN,
            },
            changeOrigin: true,
            pathRewrite: {
              '^/code-service': '',
            },
          },
        },
      },
    },
  });

  const before = integrationConfig.devServer.before;
  integrationConfig.devServer.before = (...args) => {
    before && before(args[0], args[1], args[2]);
    const [app] = args;
    app.get('/getLocalExtensions', (req, res, next) => {
      getLocalExtensions().then(res.send.bind(res)).catch(next);
    });
  };

  return [createWorkerConfig(), createWebviewConfig(), integrationConfig];
};
