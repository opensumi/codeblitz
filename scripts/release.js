/**
 * 发布版本
 */

const path = require('path');
const fse = require('fs-extra');
const { prompt, Separator } = require('inquirer');
const chalk = require('chalk');
const { invoke, exec } = require('./utils/utils');
const args = require('minimist')(process.argv.slice(2));
const { SEMVER_INC, getNewVersion, isValidVersion, isVersionGreat } = require('./utils/version');
const currentVersion = require('../package.json').version;
const signale = require('signale');
const { generateAll } = require('./utils/generate-alias');

const packages = fse
  .readdirSync(path.resolve(__dirname, '../packages'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

let stepIndex = 0;
const step = (message) => {
  stepIndex++;
  console.log(chalk.cyan(`\nStep ${stepIndex}: ${message}`));
};

invoke(async () => {
  step('确定发布版本');
  let { targetVersion } = await prompt({
    type: 'list',
    name: 'targetVersion',
    message: `选择版本，当前版本 ${currentVersion}`,
    pageSize: SEMVER_INC.length + 2,
    choices: SEMVER_INC.map((inc) => {
      const { version, text } = getNewVersion(currentVersion, inc);
      return {
        name: `${inc}${' '.repeat(14 - inc.length)}${currentVersion} ${chalk.grey('=>')} ${text}`,
        value: version,
      };
    }).concat([
      new Separator(),
      {
        name: '其它',
        value: null,
      },
    ]),
  });

  if (!targetVersion) {
    ({ targetVersion } = await prompt({
      type: 'input',
      name: 'targetVersion',
      message: '输入版本',
      askAnswered: true,
      validate(input) {
        if (!isValidVersion(input)) {
          return '版本号无效';
        }
        if (!isVersionGreat(input, currentVersion)) {
          return `版本号需大于 ${currentVersion}`;
        }
        return true;
      },
    }));
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `确认发布 v${targetVersion}`,
  });

  if (!yes) {
    return;
  }

  step('运行测试...'); // --no-test 跳过
  if (args.test !== false) {
    await exec('npx jest --clearCache');
    await exec('yarn test');
  } else {
    console.log('(SKIP)');
  }

  step('构建发布 worker-host 和 webview 资源'); // --no-assets 跳过
  if (args.assets !== false) {
    await exec('node scripts/build-assets');
  } else {
    console.log('(SKIP)');
  }

  step('更新全部 packages 依赖');
  updatePackage(path.resolve(__dirname, '..'), targetVersion);
  packages.forEach((p) => updatePackage(getPkgRoot(p), targetVersion));
  console.log('(DONE)');

  step('生成 bundle');
  if (args.bundle !== false) {
    // --no-bundle 跳过
    await exec('node scripts/bundle');
  } else {
    console.log('(SKIP)');
  }

  step('生成 languages, modules, shims 资源路径');
  await generateAll();

  step('构建所有 packages...'); // --no-build 跳过
  if (args.build !== false) {
    const configPath = path.resolve(__dirname, '..', 'packages/toolkit/define.json');
    if (!fse.existsSync(configPath)) {
      throw new Error('请先运行 build-assets 构建资源');
    }
    await exec('yarn build');

    step('注入 cdn 资源');
    const targetFile = path.resolve(__dirname, '..', 'packages/alex/lib/api/createApp.js');
    const { code, result } = replace(
      await fse.readFile(targetFile, 'utf8'),
      await fse.readJSON(configPath)
    );
    if (result) {
      await fse.writeFile(targetFile, code);
      console.log('(DONE)');
    } else {
      console.log('(SKIP)');
    }
  } else {
    console.log('(SKIP)');
  }

  step('生成 changelog');
  await exec('yarn changelog');

  step('git commit');
  const { stdout } = await exec('git diff', { stdio: 'pipe' });
  if (stdout) {
    await exec('git add -A');
    await exec(`git commit -m build:\\ v${targetVersion}`);
  } else {
    console.log('无变更文件');
  }

  step('发布 packages');
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }

  step('提交到远程');
  await exec(`git tag v${targetVersion}`);
  await exec(`git push origin refs/tags/v${targetVersion}`);
  await exec('git push');

  signale.success('发布完成');
});

function getPkgRoot(pkg) {
  return path.resolve(__dirname, '../packages/' + pkg);
}

async function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkgJSON = await fse.readJSON(pkgPath);
  pkgJSON.version = version;
  ['dependencies', 'devDependencies'].forEach((field) => {
    const obj = pkgJSON[field];
    if (!obj) return;
    Object.keys(obj).forEach((dep) => {
      const scope = '@alipay/alex';
      if (
        dep === scope ||
        (dep.startsWith(scope) && packages.includes(dep.replace(new RegExp(`^${scope}-`), '')))
      ) {
        obj[dep] = version;
      }
    });
  });
  await fse.writeJSON(pkgPath, pkgJSON, { spaces: 2 });
}

/**
 * @param {string} code
 * @param {object} replacement
 */
function replace(code, replacement) {
  const keys = Object.keys(replacement)
    .sort((a, b) => b.length - a.length)
    .map((str) => str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${keys.join('|')})\\b`, 'g');

  let result = false;
  code = code.replace(pattern, (match) => {
    result = true;
    return JSON.stringify(replacement[match]);
  });

  return { code, result };
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = await fse.readJSON(pkgPath);
  signale.info(`发布 ${pkgName}...`);
  if (pkg.private) {
    signale.note(`${pkgName} 跳过`);
    return;
  }
  try {
    await exec(`tnpm publish --tag ${args.tag || 'latest'}`, {
      cwd: pkgRoot,
    });
    signale.success(`${pkgName}@${version} 发布成功`);
  } catch (e) {
    throw e;
  }
}
