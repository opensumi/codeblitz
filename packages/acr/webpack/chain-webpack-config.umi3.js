// 配置参考文档：https://bigfish.alipay.com/doc
const { deepmerge } = require('@umijs/utils');
const getLocalIdent = require('./getLocalIdent');

const pkg = require('../package.json');

// custom webpack script for umi/bigfish
module.exports = (config) => {
  // 以下 rule 对象的获取参考 umi3 源码
  // https://github.com/umijs/umi/blob/master/packages/bundler-webpack/src/getConfig/css.ts#L39
  // https://github.com/umijs/umi/blob/master/packages/bundler-webpack/src/getConfig/css.ts#L79
  const rule = config.module
    .rule('less')
    .test(/\.(less)(\?.*)?$/)
    .oneOf('css-modules')
    .resourceQuery(/modules/);

  console.log('Modifying umi3 css-loader config for css-module in ide-framework');

  rule.use('css-loader').tap((options) => {
    // https://github.com/webpack-contrib/css-loader#getlocalident
    return deepmerge(options, {
      modules: {
        ...(options.modules || {}),
        getLocalIdent: (loaderContext, localIdentName, localName, options) => {
          const resourcePath = String(loaderContext.resourcePath);
          if (
            (resourcePath.includes(pkg.name) || resourcePath.includes('@ali/ide')) &&
            resourcePath.endsWith('.module.less')
          ) {
            return getLocalIdent(loaderContext, localIdentName, localName, options);
          }
          return null;
        },
      },
    });
  });
};
