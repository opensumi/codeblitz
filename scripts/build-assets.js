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

  const distDir = path.resolve(__dirname, '../packages/toolkit/dist');
  const manifest = require(path.join(distDir, 'manifest.json'));
  const fileJSON = Object.keys(manifest).reduce((obj, key) => {
    obj[key] = {
      filename: manifest[key],
      filepath: path.join(distDir, manifest[key]),
    };
    return obj;
  }, {});
  const cdnResult = await upload(fileJSON);

  signale.info('上传成功，生成 config.json');

  const transformHttps = (str) => str.replace(/^http:/, 'https:');
  const env = {
    __WORKER_HOST__: {
      key: 'worker-host.js',
      transform: transformHttps,
    },
    __WEBVIEW_ENDPOINT__: {
      key: 'webview/index.html',
      transform: (v) => transformHttps(v.slice(0, v.lastIndexOf('/'))),
    },
  };
  const config = Object.keys(env).reduce((obj, name) => {
    const { key, transform } = env[name];
    if (cdnResult[key]) {
      obj[name] = transform(cdnResult[key]);
    }
    return obj;
  }, {});
  fs.writeFileSync(
    path.resolve(__dirname, '../packages/alex/config.json'),
    JSON.stringify(config, null, 2)
  );

  signale.success('构建资源成功');
});
