import * as path from 'path';

export const PRODUCT = 'spacex';

export const FRAMEWORK_NAME = '@alipay/spacex';

export const FRAMEWORK_PATH = resolveFramework();

export const EXTENSION_DIR = path.join(FRAMEWORK_PATH, '.kaitian/extensions');

export const EXTENSION_METADATA_DIR = path.join(FRAMEWORK_PATH, 'extensions');

export const EXTENSION_METADATA_TYPE_PATH = path.join(FRAMEWORK_PATH, 'extensions.d.ts');

function resolveFramework() {
  try {
    const pkgPath = require.resolve(`${FRAMEWORK_NAME}/package.json`);
    return path.join(pkgPath, '..');
  } catch (err) {
    return '';
  }
}
