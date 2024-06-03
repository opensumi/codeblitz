import * as path from 'path';
import { log } from './log';

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

const MARKETPLACE_CONFIG: IMarketplaceConfig = {
  endpoint: 'https://marketplace.opentrs.cn',
  accountId: 'JL1k9cyrepomKpoSWXADGb9G',
  masterKey: 't-6MbbT-9C15R_chQ8qUj78P',
}

export const resolveMarketplaceConfig = (pkgJSON: {
  [EXTENSION_CONFIG_FIELD]: IMarketplaceConfig
}): IMarketplaceConfig => {
  if (pkgJSON && pkgJSON[EXTENSION_CONFIG_FIELD]) {
    const config = pkgJSON[EXTENSION_CONFIG_FIELD];
    if (config.endpoint) {
      log.info('使用 package.json 中的定义的 marketplaceConfig.endpoint 配置: ' + pkgJSON[EXTENSION_CONFIG_FIELD].endpoint)
      MARKETPLACE_CONFIG.endpoint = config.endpoint;
    }
    if (config.accountId) {
      log.info('使用 package.json 中的定义的 marketplaceConfig.accountId 配置: ' + pkgJSON[EXTENSION_CONFIG_FIELD].accountId)
      MARKETPLACE_CONFIG.accountId = config.accountId;
    }
    if (config.masterKey) {
      log.info('使用 package.json 中的定义的 marketplaceConfig.masterKey 配置。')
      MARKETPLACE_CONFIG.masterKey = config.masterKey;
    }
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
