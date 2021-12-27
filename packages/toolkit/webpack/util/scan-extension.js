const path = require('path');
const fs = require('fs');
const { ExtensionScanner } = require('@ali/ide-kaitian-extension/lib/node/extension.scanner');
const { getExtension } = require('@alipay/alex-cli/lib/extension/scanner');
const { Uri } = require('@ali/ide-core-common');

exports.getLocalExtensions = () => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../../extensions');
  const fixturesDir = path.join(__dirname, '../../fixtures');
  if (fs.existsSync(extensionDir)) {
    dirList.push(extensionDir);
  }
  if (fs.existsSync(fixturesDir)) {
    dirList.push(fixturesDir);
  }
  const extensionScanner = new ExtensionScanner(dirList, 'en-US', [], {});
  return extensionScanner.run();
};

exports.getLocalExtensionsMetadata = (host, basePath) => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../../extensions');
  const fixturesDir = path.join(__dirname, '../../fixtures');
  [extensionDir, fixturesDir].forEach((dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory()) {
        dirList.push(path.join(dir, dirent.name));
      }
    });
  });
  const httpUri = Uri.parse(host).with({ path: basePath });
  return Promise.all(dirList.map((localExtPath) => getExtension(localExtPath, 'local', httpUri)));
};
