import * as path from 'path';

export const PRODUCT = 'alex';

export const FRAMEWORK_NAME = '@alipay/alex';

export const FRAMEWORK_PATH = resolveFramework();

export const EXTENSION_DIR = path.join(FRAMEWORK_PATH, '.kaitian/extensions');

export const EXTENSION_METADATA_DIR = path.join(FRAMEWORK_PATH, 'extensions');

export const EXTENSION_METADATA_TYPE_PATH = path.join(FRAMEWORK_PATH, 'extensions.d.ts');

export const EXTENSION_FIELDS = 'cloudideExtensions';

function resolveFramework() {
  try {
    const pkgPath = require.resolve(`${FRAMEWORK_NAME}/package.json`);
    return path.join(pkgPath, '..');
  } catch (err) {
    return '';
  }
}
