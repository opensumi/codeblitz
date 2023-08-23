const path = require('path');
const fse = require('fs-extra');
const { invoke } = require('./utils');
const args = require('minimist')(process.argv.slice(2));
const depsFileds = require('../deps-fileds');

const packages = fse
  .readdirSync(path.resolve(__dirname, '../../packages'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

function getPkgRoot(pkg) {
  return path.resolve(__dirname, '../../packages/' + pkg);
}

invoke(async () => {
  const version = args.v || args.version;

  console.log('更新全部 packages 依赖');
  updatePackage(path.resolve(__dirname, '../..'), version);
  packages.forEach((p) => updatePackage(getPkgRoot(p), version));
  console.log('(DONE)');
})

async function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkgJSON = await fse.readJSON(pkgPath);
  pkgJSON.version = version;
  depsFileds.forEach((field) => {
    const obj = pkgJSON[field];
    if (!obj) return;
    Object.keys(obj).forEach((dep) => {
      const scope = '@codeblitzjs/ide';
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