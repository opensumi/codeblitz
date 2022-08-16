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
              Cookie:
                'autologin_trustie=ebdf7bf2e3a7b7e38db85cbfb052a4f5639b480b;user_id=BAhpA3p1AQ%3D%3D--016cfd4d2c67651b141d9ea39b418fff55bd859c;states=%7B%22select_params%22%3A%7B%22page%22%3A1%2C%22limit%22%3A15%2C%22fixed_version_id%22%3A%222031%22%7D%2C%22assigned_to_ids%22%3A%22%E8%B4%9F%E8%B4%A3%E4%BA%BA%22%2C%22status_type%22%3A%221%22%2C%22issue_tag_ids%22%3A%22%E6%A0%87%E8%AE%B0%22%2C%22tracker_ids%22%3A%22%E7%B1%BB%E5%9E%8B%22%2C%22author_ids%22%3A%22%E5%8F%91%E5%B8%83%E4%BA%BA%22%2C%22fixed_version_ids%22%3A%22CloudIDE%22%2C%22status_ids%22%3A%22%E7%8A%B6%E6%80%81%22%2C%22done_ratios%22%3A%22%E5%AE%8C%E6%88%90%E5%BA%A6%22%2C%22paix%22%3A%22%E6%8E%92%E5%BA%8F%22%2C%22update_author_ids%22%3A%22%E6%9B%B4%E6%8D%A2%E8%B4%9F%E8%B4%A3%E4%BA%BA%22%2C%22update_status_ids%22%3A%22%E4%BF%AE%E6%94%B9%E7%8A%B6%E6%80%81%22%2C%22begin%22%3A%22%22%2C%22end%22%3A%22%22%7D;_educoder_session=bd5f5284909f8e080964f649497d837b',
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
