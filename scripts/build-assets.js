/**
 * 构建 worker-host 和 webview 并发布到内网 cdn 上
 */

const path = require('path');
const fs = require('fs');
const signale = require('signale');
const { invoke, exec } = require('./utils/utils');
const { upload } = require('./utils/upload');

invoke(async () => {
  signale.pending(`开始编译 worker-host 和 webview`);

  await execa('npx rimraf ./packages/toolkit/dist');
  await execa(`npx yarn workspace @alipay/alex-toolkit build:host`);

  signale.info('构建成功，开始上传 cdn');

  const distDir = path.resolve('packages/toolkit/dist');
  const manifest = require(path.join(distDir, 'manifest.json'));
  Object.keys(manifest).forEach((file) => {
    manifest[file] = path.join(distDir, manifest[file]);
  });
  const cdnResult = await upload(manifest);

  signale.info('上传成功，生成 config.json');

  const config = {};
  const transformHttps = (str) => str.replace(/^http:/, 'https:');
  Object.keys(cdnResult).forEach((key) => {
    if (key === 'worker-host.js') {
      config.WORKER_HOST = transformHttps(cdnResult[key]);
    } else if (key === 'webview/index.html') {
      config.WEBVIEW_ENDPOINT = transformHttps(
        cdnResult[key].slice(0, cdnResult[key].lastIndexOf('/'))
      );
    }
  });
  fs.writeFileSync(path.resolve('packages/alex/config.json'), JSON.stringify(config, null, 2));

  signale.success('构建资源成功');
});
