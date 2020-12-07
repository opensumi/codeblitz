const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const version = require('../package.json').version;
const signale = require('signale');

const { promises: fsp } = fs;

const packageDir = path.join(__dirname, '../packages');

const packages = fs.readdirSync(packageDir, { withFileTypes: true });

packages.forEach(async (pkg) => {
  if (!pkg.isDirectory()) return;

  const { name } = pkg;

  const resolve = (file = '') => path.join(__dirname, '../packages', name, file);

  const pkgPath = resolve('package.json');
  if (fs.existsSync(pkgPath) && !args.force) return;

  signale.pending(`开启初始化模块：${name}`);

  // package.json
  const pkgName = name === 'spacex' ? `@alipay/spacex` : `@alipay/spacex-${name}`;
  const json = {
    name: pkgName,
    version,
    description: pkgName,
    main: 'lib/index.js',
    typings: 'lib/index.d.ts',
    files: ['lib'],
    keywords: ['kaitian AntCodespaces'],
    scripts: {},
    publishConfig: {
      registry: 'https://registry.npm.alibaba-inc.com',
    },
    tnpm: {
      mode: 'yarn',
      lockfile: 'enable',
    },
    dependencies: {
      '@alipay/spacex-core': version,
      '@alipay/spacex-shared': version,
    },
  };
  await fsp.writeFile(resolve('package.json'), JSON.stringify(json, null, 2));

  // README.md
  await fsp.writeFile(resolve('README.md'), `# ${name}`);

  // src
  await fsp.mkdir(resolve('src'));
  await fsp.writeFile(resolve('src/index.ts'), '');

  // test
  await fsp.mkdir(resolve('__tests__'));
  await fsp.writeFile(
    resolve('__tests__/index.ts'),
    `
describe('test', () => {

})
    `.trim() + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../tsconfig.base.json',
    compilerOptions: {
      rootDir: './src',
      outDir: './lib',
    },
    include: ['./src'],
  };
  await fsp.writeFile(resolve('tsconfig.build.json'), JSON.stringify(tsconfig, null, 2));

  const buildTSConfigPath = path.join(__dirname, '../packages/tsconfig.build.json');
  const buildTSConfigJSON = require(buildTSConfigPath);
  buildTSConfigJSON.references.push({
    path: `./${name}/tsconfig.build.json`,
  });
  await fsp.writeFile(buildTSConfigPath, JSON.stringify(buildTSConfigJSON, null, 2));

  signale.success(`模块 ${name} 初始化成功`);
});
