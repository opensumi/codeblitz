// 配置参考文档：https://bigfish.alipay.com/doc
const getLocalIdent = require('./getLocalIdent');

const pkg = require('../package.json');

// custom webpack script for umi/bigfish
module.exports = (config) => {
  // 配置参考 https://github.com/neutrinojs/webpack-chain
  config.module
    .rule('less-in-node_modules')
    .use('css-loader')
    .merge({
      options: {
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
        getLocalIdent: (loaderContext, localIdentName, localName, options) => {
          const resourcePath = String(loaderContext.resourcePath);
          if (
            (resourcePath.includes(pkg.name) || resourcePath.includes('@opensumi/ide')) &&
            resourcePath.endsWith('.module.less')
          ) {
            return getLocalIdent(loaderContext, localIdentName, localName, options);
          } else {
            return localName;
          }
        },
      },
    });

  /**
   * https://github.com/malte-wessel/react-custom-scrollbars/issues/233
   * react-custom-scrollbar 有个 issue，主要是在新版本 mac 下获取滚动条的宽度一直是0，只有设置了 scrollbar 的宽度才能获取到
   * 但是 antcode 页面我们不能覆盖全局的 scrollbar 宽度
   * 目前的措施：alias 解决掉，默认返回10（10为kaitian里面默认滚动条宽度）
   * 后续措施：ide-fw 类似操作都要读取 rootElement 下的，而不是 body 下的
   * react-custom-scrollbars 后续要 fork 改下嗅探逻辑，或者说支持传入一个指定的滚动条宽度才行
   */
  // config
  //   .plugin('replace')
  //   .use(require.resolve('webpack/lib/NormalModuleReplacementPlugin'), [
  //     /.+react-custom-scrollbars\/lib\/utils\/getScrollbarWidth\.js/,
  //     path.resolve(__dirname, './dummy/getScrollbarWidth.js'),
  //   ]);

  // 由于纯前端版本使用了 octions.font 系列，后续 ide-fw 需要移除这类处理
  // config.module
  //   .rule('font-in-node_modules')
  //   .include
  //     .add('node_modules/@opensumi/ide-core-browser')
  //     .end()
  //   .test(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/)
  //   .use('file')
  //   .loader('file-loader');
};
