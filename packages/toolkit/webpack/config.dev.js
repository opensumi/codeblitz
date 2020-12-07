const path = require('path');
const createWebpackConfig = require('./config.integration');
const getLocalExtensions = require('./util/scan-extension');

module.exports = async () => {
  const config = await createWebpackConfig({
    tsconfigPath: path.join(__dirname, '../../../tsconfig.json'),
    template: path.join(__dirname, '../public/index.html'),
    webpackConfig: {
      entry: path.join(__dirname, '../../spacex/src/integration/startup/index.tsx'),
      devServer: {
        contentBasePublicPath: '/assets/~',
        contentBase: '/',
        staticOptions: {
          setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
          },
        },
      },
    },
  });

  const before = config.devServer.before;
  config.devServer.before = (...args) => {
    before && before(...args);
    const [app] = args;
    app.get('/getLocalExtensions', (req, res, next) => {
      getLocalExtensions().then(res.send.bind(res)).catch(next);
    });
  };

  return config;
};
