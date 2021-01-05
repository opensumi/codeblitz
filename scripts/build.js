const path = require('path');
const signale = require('signale');
const execa = require('execa');
const args = require('minimist')(process.argv.slice(2));
const invoke = require('./utils/invoke');

invoke(async () => {
  const scope = args.scope || 'all';
  await execa.command(`npx rimraf packages/${scope === 'all' ? '*' : scope}/lib`);

  signale.pending(`开始编译 ${args.scope || 'all'}`);

  try {
    const watch = args.w || args.watch ? '--watch' : '';
    await execa.command(`npx tsc --build packages/tsconfig.build.json ${watch}`, {
      stdio: 'inherit', // use inherit get pretty error log
    });
    signale.success('编译成功');
  } catch (err) {
    console.error(err);
    signale.error('编译失败');
  }
});
