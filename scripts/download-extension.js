/**
 * 插件配置
 * @property ignore 是否忽略安装
 */
const extensions = [
  {
    publisher: 'kaitian-worker',
    name: 'json-language-features',
    version: '1.0.0',
    ignore: false,
  },
  {
    publisher: 'kaitian-worker',
    name: 'html-language-features',
    version: '1.0.0-beta-1',
    ignore: true,
  },
];

const path = require('path');
const fse = require('fs-extra');
const { ExtensionInstaller } = require('@ali/ide-extension-installer');
const pkg = require('../package.json');
const { invoke } = require('./utils/utils');

const targetDir = path.resolve(__dirname, '../packages/toolkit/extensions');

const extensionInstaller = new ExtensionInstaller({
  accountId: 'nGJBcqs1D-ma32P3mBftgsfq',
  masterKey: '-nzxLbuqvrKh8arE0grj2f1H',
  frameworkVersion: pkg.version,
  dist: targetDir,
  ignoreIncreaseCount: true,
});

invoke(async () => {
  console.log('清空 extensions 目录');
  await fse.remove(targetDir);
  await fse.mkdirp(targetDir);

  await Promise.all(
    extensions.map((ext) => {
      if (ext.ignore) {
        return Promise.resolve();
      }
      return extensionInstaller.install({
        publisher: ext.publisher,
        name: ext.name,
        version: ext.version,
      });
    })
  );

  console.log('安装完毕');
});
