const path = require('path');
const signale = require('signale');
const { invoke, exec } = require('./utils/utils');

invoke(async () => {
  signale.pending(`开始编译 worker-host 和 webview`);

  await exec('npx rimraf ./packages/sumi-core/resources');
  await exec(`yarn workspace @codeblitzjs/ide-toolkit build:host`);


  const distDir = path.resolve(__dirname, '../packages/sumi-core/resources');
  const manifest = require(path.join(distDir, 'manifest.json'));
  console.log('manifest', manifest);

  signale.success('构建资源成功');
});
