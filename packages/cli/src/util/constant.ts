import * as path from 'path';

export const PRODUCT = 'codeblitz';

export const FRAMEWORK_NAME = '@codeblitzjs/ide-core';

export const FRAMEWORK_PATH = resolveFramework();

export const EXTENSION_DIR = path.join(FRAMEWORK_PATH, '.cloudide/extensions');

export const EXTENSION_METADATA_DIR = path.join(FRAMEWORK_PATH, 'extensions');

export const EXTENSION_METADATA_TYPE_PATH = path.join(FRAMEWORK_PATH, 'extensions.d.ts');

export const EXTENSION_FIELD = 'cloudideExtensions';
export const EXTENSION_CONFIG_FIELD = 'marketplaceConfig';

export interface IMarketplaceConfig {
  endpoint: string;
  accountId: string;
  masterKey: string;
}

export const MARKETPLACE_CONFIG: IMarketplaceConfig = {
  endpoint: 'https://marketplace.opentrs.cn',
  accountId: 'JL1k9cyrepomKpoSWXADGb9G',
  masterKey: 't-6MbbT-9C15R_chQ8qUj78P',
}

export const resolveMarketplaceConfig = (pkgJSON: any): IMarketplaceConfig => {
  if (pkgJSON && pkgJSON[EXTENSION_CONFIG_FIELD]) {
    return pkgJSON[EXTENSION_CONFIG_FIELD] as IMarketplaceConfig;
  }

  return MARKETPLACE_CONFIG;
}

function resolveFramework() {
  try {
    const pkgPath = require.resolve(`${FRAMEWORK_NAME}/package.json`);
    return path.resolve(pkgPath, '..');
  } catch (err) {
    return '';
  }
}
