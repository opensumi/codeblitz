const path = require('path');
const fs = require('fs');
const signale = require('signale');
const { invoke, exec } = require('./utils/utils');
const pkg = require('../package.json');

invoke(async () => {
  signale.pending(`开始编译 worker-host 和 webview`);

  await exec('npx rimraf ./packages/sumi-core/resources');
  await exec(`yarn workspace @codeblitzjs/ide-toolkit build:host`);


  const distDir = path.resolve(__dirname, '../packages/sumi-core/resources');
  const manifest = require(path.join(distDir, 'manifest.json'));
  signale.log('manifest', manifest);

  const config = { __OPENSUMI_VERSION__: pkg.engines.opensumi };

  fs.writeFileSync(
    path.resolve(__dirname, '../packages/toolkit/define.json'),
    JSON.stringify(config, null, 2)
  );

  signale.success('构建资源成功');
});
