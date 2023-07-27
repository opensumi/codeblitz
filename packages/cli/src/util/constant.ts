import * as path from 'path';

export const PRODUCT = 'codeblitz';

export const FRAMEWORK_NAME = '@codeblitzjs/ide-core';

export const FRAMEWORK_PATH = resolveFramework();

export const EXTENSION_DIR = path.join(FRAMEWORK_PATH, '.cloudide/extensions');

export const EXTENSION_METADATA_DIR = path.join(FRAMEWORK_PATH, 'extensions');

export const EXTENSION_METADATA_TYPE_PATH = path.join(FRAMEWORK_PATH, 'extensions.d.ts');

export const EXTENSION_FIELD = 'cloudideExtensions';

export const MARKETPLACE_CONFIG = {
  ENDPOINT: 'https://marketplace.opentrs.cn',
  ACCOUNT_ID: 'JL1k9cyrepomKpoSWXADGb9G',
  MASTER_KEY: 't-6MbbT-9C15R_chQ8qUj78P',
}

function resolveFramework() {
  try {
    const pkgPath = require.resolve(`${FRAMEWORK_NAME}/package.json`);
    return path.join(pkgPath, '..');
  } catch (err) {
    return '';
  }
}
