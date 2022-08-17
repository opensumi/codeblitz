// 给代码服务平台（Gitlink）打包的 jsbundle
// 语言包
import '@alipay/alex/languages';
// 引入自定义的 i18n 文案
import './locales';
// 引入 color token
import './color-token';
// Ant Code CR
export { default as ACR } from './antcode-cr';

// Editor 组件
export { EditorRenderer } from '@alipay/alex/lib/editor.all';
// ALEX 组件
export { AppRenderer } from '@alipay/alex/lib/index';
export * from '@alipay/alex/lib//api/require';
