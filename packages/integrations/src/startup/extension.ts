// @ts-nocheck
// 这里安装需要依赖 alex-cli，但是 build 时 cli 又还没构建出来，先忽略类型校验，后续再优化

export { default as SarifViewer } from '../../../extensions/cloud-ide-ext.sarif-viewer';
export { default as css } from '../../../extensions/alex.css-language-features-worker';
export { default as html } from '../../../extensions/alex.html-language-features-worker';
export { default as json } from '../../../extensions/alex.json-language-features-worker';
export { default as markdown } from '../../../extensions/alex.markdown-language-features-worker';
export { default as typescript } from '../../../extensions/alex.typescript-language-features-worker';
