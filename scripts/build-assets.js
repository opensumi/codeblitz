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

  await exec('npx rimraf ./packages/toolkit/dist');
  await exec(`yarn workspace @alipay/alex-toolkit build:host`);

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
  const obj = {
    'worker-host.js': {
      name: '__WORKER_HOST__',
      transform: transformHttps,
    },
    'webview/index.html': {
      name: '__WEBVIEW_ENDPOINT__',
      transform: (v) => transformHttps(v.slice(0, v.lastIndexOf('/'))),
    },
  };
  Object.keys(cdnResult).forEach((key) => {
    if (obj[key]) {
      const { name, transform } = obj[key];
      config[name] = transform(cdnResult[key]);
    }
  });
  fs.writeFileSync(path.resolve('packages/alex/config.json'), JSON.stringify(config, null, 2));

  signale.success('构建资源成功');
});
