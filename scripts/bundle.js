const path = require('path');
const signale = require('signale');
const fse = require('fs-extra');
const { invoke, exec } = require('./utils/utils');

invoke(async () => {
  const targetDir = path.join(__dirname, '../packages/core/bundle');
  await exec(`npx rimraf ${targetDir}`);

  signale.pending('开始打包');

  try {
    await exec('yarn workspace @codeblitzjs/ide-toolkit build');

    await fse.writeFile(
      path.join(targetDir, 'index.js'),
      `
module.exports = require("./codeblitz");
    `.trim() + '\n'
    );
    await fse.writeFile(
      path.join(targetDir, 'index.min.js'),
      `
module.exports = require("./codeblitz.min");
    `.trim() + '\n'
    );
    await fse.writeFile(
      path.join(targetDir, 'index.d.ts'),
      `
export * from "../lib";
    `.trim() + '\n'
    );
    await fse.writeFile(
      path.join(targetDir, 'index.min.d.ts'),
      `
export * from "../lib";
    `.trim() + '\n'
    );
    // editor 类型文件
    await fse.writeFile(
      path.join(targetDir, 'codeblitz.editor.d.ts'),
      `
export * from "../lib/editor";
    `.trim() + '\n'
    );

    // editor.all 类型文件
    await fse.writeFile(
      path.join(targetDir, 'codeblitz.editor.all.d.ts'),
      `
export * from "../lib/editor.all";
    `.trim() + '\n'
    );

    signale.success('打包成功');
  } catch (err) {
    signale.error('打包失败');
    throw err;
  }
});
