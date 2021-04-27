const path = require('path');
const signale = require('signale');
const args = require('minimist')(process.argv.slice(2));
const glob = require('glob');
const fse = require('fs-extra');
const { invoke, exec } = require('./utils/utils');

invoke(async () => {
  const scope = args.scope || 'all';
  await exec(`npx rimraf packages/${scope === 'all' ? '*' : scope}/lib`);

  signale.pending(`开始编译 ${args.scope || 'all'}`);

  try {
    const watch = args.w || args.watch ? '--watch' : '';
    await exec(`npx tsc --build packages/tsconfig.build.json ${watch}`);
    signale.success('编译成功');
    signale.pending('复制非 ts 资源');
    const cwd = path.join(__dirname, '../packages');
    const files = glob.sync('*/src/**/*.@(less)', { cwd, nodir: true });
    console.log(files);
    for (const file of files) {
      const from = path.join(cwd, file);
      const to = path.join(cwd, file.replace(/\/src\//, '/lib/'));
      await fse.mkdirp(path.dirname(to));
      await fse.copyFile(from, to);
    }
    signale.success('复制成功');
  } catch (err) {
    signale.error('编译失败', err);
    throw err;
  }
});
