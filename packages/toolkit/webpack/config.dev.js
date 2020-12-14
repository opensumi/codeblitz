const path = require('path');
const createWebpackConfig = require('./config.integration');
const createWorkerConfig = require('./config.worker');
const createWebviewConfig = require('./config.webview');
const getLocalExtensions = require('./util/scan-extension');
const { config } = require('./util');

process.env.NODE_ENV = 'development';

module.exports = () => {
  const integrationConfig = createWebpackConfig({
    tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
    useLocalWorkerAndWebviewHost: true,
    webpackConfig: {
      context: path.join(__dirname, '../../..'),
      entry: {
        [config.appEntry]: './packages/spacex/src/integration/startup',
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
