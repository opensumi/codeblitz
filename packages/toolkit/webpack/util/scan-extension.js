const path = require('path');
const fs = require('fs');
const { ExtensionScanner } = require('@ali/ide-kaitian-extension/lib/node/extension.scanner');

module.exports = () => {
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
