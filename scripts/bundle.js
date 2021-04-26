const path = require('path');
const signale = require('signale');
const args = require('minimist')(process.argv.slice(2));
const fse = require('fs-extra');
const { invoke, exec } = require('./utils/utils');

invoke(async () => {
  const targetDir = path.join(__dirname, '../packages/alex/bundle');
  await exec(`npx rimraf ${targetDir}`);

  signale.pending('开始打包');

  try {
    await exec('yarn workspace @alipay/alex-toolkit build');

    await fse.writeFile(
      path.join(targetDir, 'index.js'),
      `
module.exports = require("./alex");
    `.trim() + '\n'
    );
    await fse.writeFile(
      path.join(targetDir, 'index.d.ts'),
      `
export * from "../lib";
    `.trim() + '\n'
    );

    // editor 类型文件
    await fse.writeFile(
      path.join(targetDir, 'alex.editor.d.ts'),
      `
export * from "../lib/editor";
    `.trim() + '\n'
    );

    // editor.all 类型文件
    await fse.writeFile(
      path.join(targetDir, 'alex.editor.all.d.ts'),
      `
export * from "../lib/editor.all";
    `.trim() + '\n'
    );

    signale.success('打包成功');
  } catch (err) {
    console.error(err);
    signale.error('打包失败');
  }
});
