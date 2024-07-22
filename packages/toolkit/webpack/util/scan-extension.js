const path = require('path');
const fs = require('fs/promises');
const { ExtensionScanner } = require('@opensumi/ide-extension/lib/node/extension.scanner');
const { getExtension } = require('@codeblitzjs/ide-cli/lib/extension/scanner');
const { Uri } = require('@opensumi/ide-core-common');

/**
 * @param {string} p
 */
const pathExists = (p) =>
  fs
    .access(p)
    .then(() => true)
    .catch(() => false);

exports.getLocalExtensions = async () => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../../extensions');
  const fixturesDir = path.join(__dirname, '../../fixtures');
  if (await pathExists(extensionDir)) {
    dirList.push(extensionDir);
  }
  if (await pathExists(fixturesDir)) {
    dirList.push(fixturesDir);
  }
  const extensionScanner = new ExtensionScanner(dirList, 'en-US', [], {});
  return extensionScanner.run();
};

exports.getLocalExtensionsMetadata = async (host, basePath) => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../../extensions');
  const fixturesDir = path.join(__dirname, '../../fixtures');
  await Promise.all(
    [extensionDir, fixturesDir].map(async (dir) => {
      if (await pathExists(dir)) {
        const files = await fs.readdir(dir, { withFileTypes: true });
        files.forEach((dirent) => {
          if (dirent.isDirectory()) {
            dirList.push(path.join(dir, dirent.name));
          }
        });
      }
    }),
  );
  const httpUri = Uri.parse(host).with({ path: basePath });
  return Promise.all(dirList.map((localExtPath) => getExtension(localExtPath, 'local', httpUri)));
};
