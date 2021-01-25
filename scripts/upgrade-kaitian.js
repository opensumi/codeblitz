const { invoke, exec } = require('./utils/utils');
const signale = require('signale');
const args = require('minimist')(process.argv.slice(2));
const fse = require('fs-extra');
const path = require('path');
const https = require('https');
const { StringDecoder } = require('string_decoder');

const pkg = '@ali/ide-core-common';

invoke(async () => {
  const v = args.v || args.version;
  const version = await getOrCheckVersion(v);
  signale.info(`版本: ${version}`);

  const { packages } = await getKaitianDeps(version);

  const pkgPathList = [];
  pkgPathList.push(path.resolve('./package.json'));
  const packagesDir = path.resolve('./packages');
  const dirents = await fse.readdir(packagesDir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      pkgPathList.push(path.join(packagesDir, dirent.name, 'package.json'));
    }
  });
  await Promise.all(pkgPathList.map((pkgPath) => upgradeKaitianDeps(pkgPath, version, packages)));
  signale.await(`yarn 重装依赖`);
  await exec('npx yarn --network-timeout 100000');
});

async function getOrCheckVersion(version) {
  if (version) {
    const { stdout: name } = await exec(`tnpm view ${pkg}@${version} name`, { stdio: 'pipe' });
    if (!name) {
      signale.fatal(`${version} 不存在`);
      process.exit(128);
    }
  } else {
    ({ stdout: version } = await exec(`tnpm view ${pkg}@latest version`, { stdio: 'pipe' }));
    if (!version) {
      signale.fatal(`查找最新版本失败`);
      process.exit(128);
    }
  }
  return version;
}

async function getKaitianDeps(v) {
  return new Promise((resolve, reject) => {
    const decoder = new StringDecoder('utf8');
    https.get(`https://g.alipay.com/@ali/kaitian@${v}/manifest.json`, (res) => {
      const { statusCode } = res;
      if (statusCode >= 200 && statusCode < 300) {
        let text = '';
        res.on('data', (chunk) => {
          text += decoder.write(chunk);
        });
        res.on('end', () => {
          text += decoder.end();
          return resolve(JSON.parse(text));
        });
      } else {
        reject(new Error('请求 deps 失败'));
      }
    });
  });
}

async function upgradeKaitianDeps(pkgPath, version, kaitianDepList) {
  const pkgJSON = await fse.readJSON(pkgPath);
  let modified = false;
  if (pkgJSON.engines && pkgJSON.engines.kaitian) {
    pkgJSON.engines.kaitian = version;
    modified = true;
  }
  ['dependencies', 'devDependencies'].forEach((field) => {
    const obj = pkgJSON[field];
    if (!obj) return;
    Object.keys(obj).forEach((dep) => {
      if (kaitianDepList[dep]) {
        obj[dep] = kaitianDepList[dep];
        modified = true;
      }
    });
  });
  if (modified) {
    await fse.writeJSON(pkgPath, pkgJSON, { spaces: 2 });
  }
}
