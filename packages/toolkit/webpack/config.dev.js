const path = require('path');
const createWebpackConfig = require('./config.integration');
const createWorkerConfig = require('./config.worker');
const createWebviewConfig = require('./config.webview');
const { getLocalExtensions, getLocalExtensionsMetadata } = require('./util/scan-extension');
const { config } = require('./util');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

process.env.NODE_ENV = 'development';

// const antCodeSitHost = 'http://100.83.41.35:80';
const antCodeSitHost = 'http://code.test.alipay.net';

module.exports = () => {
  const integrationConfig = createWebpackConfig({
    tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
    useLocalWorkerAndWebviewHost: true,
    define: {
      'process.env.KTLOG_SHOW_DEBUG': true,
    },
    webpackConfig: {
      context: path.join(__dirname, '../../..'),
      entry: {
        [config.appEntry]: `./packages/integrations/src/${process.env.INTEGRATION || 'startup'}`,
      },
      devtool: 'eval-cheap-module-source-map',
      devServer: {
        proxy: {
          // 通过 cookie 请求测试平台
          '/code-test': {
            target: antCodeSitHost,
            changeOrigin: true,
            pathRewrite: {
              '^/code-test': '',
            },
            // changeOrigin 只对 get 有效
            onProxyReq: (request) => {
              request.setHeader('origin', antCodeSitHost);
            },
          },
          '/code-service': {
            target: process.env.CODE_SERVICE_HOST || 'https://code.alipay.com',
            headers: {
              'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN,
            },
            secure: false,
            changeOrigin: true,
            pathRewrite: {
              '^/code-service': '',
            },
            onProxyReq(request) {
              request.setHeader(
                'origin',
                process.env.CODE_SERVICE_HOST || 'https://code.alipay.com'
              );
            },
          },
        },
        historyApiFallback: {
          disableDotRule: true,
        },
      },
    },
  });

  const { before, openPage, contentBasePublicPath } = integrationConfig.devServer;
  integrationConfig.devServer.before = (...args) => {
    before && before(args[0], args[1], args[2]);
    const [app] = args;
    app.get('/getLocalExtensions', (req, res, next) => {
      getLocalExtensions().then(res.send.bind(res)).catch(next);
    });
    app.get('/getLocalExtensionsMetadata', (req, res, next) => {
      getLocalExtensionsMetadata(openPage, contentBasePublicPath)
        .then(res.send.bind(res))
        .catch(next);
    });
  };

  return [createWorkerConfig(), createWebviewConfig(), integrationConfig];
};
