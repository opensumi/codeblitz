import fse from 'fs-extra';
import * as path from 'path';
import { log } from './log';
import { resolveCWDPkgJSON } from './path';

export interface IExtensionConfig {
  product: string;
  frameworkPackageName: string;
  extensionField: string;
  marketplaceConfigField: string;
  configurationDir: string;
}

export const kExtensionConfig: IExtensionConfig = {
  product: 'codeblitz',
  frameworkPackageName: '@codeblitzjs/ide-core',
  extensionField: 'cloudideExtensions',
  marketplaceConfigField: 'marketplaceConfig',
  configurationDir: '.cloudide',
};

export const setExtensionConfig = (config: Partial<IExtensionConfig>) => {
  if (config.product) {
    kExtensionConfig.product = config.product;
  }
  if (config.frameworkPackageName) {
    kExtensionConfig.frameworkPackageName = config.frameworkPackageName;
  }
  if (config.extensionField) {
    kExtensionConfig.extensionField = config.extensionField;
  }
  if (config.marketplaceConfigField) {
    kExtensionConfig.marketplaceConfigField = config.marketplaceConfigField;
  }
  if (config.configurationDir) {
    kExtensionConfig.configurationDir = config.configurationDir;
  }
};

export interface IMarketplaceConfig {
  endpoint: string;
  accountId: string;
  masterKey: string;
}

const kMarketplaceConfig: IMarketplaceConfig = {
  endpoint: 'https://marketplace.opentrs.cn',
  accountId: 'JL1k9cyrepomKpoSWXADGb9G',
  masterKey: 't-6MbbT-9C15R_chQ8qUj78P',
};

export const setMarketplaceConfig = (config: Partial<IMarketplaceConfig>) => {
  if (config.endpoint) {
    kMarketplaceConfig.endpoint = config.endpoint;
  }
  if (config.accountId) {
    kMarketplaceConfig.accountId = config.accountId;
  }
  if (config.masterKey) {
    kMarketplaceConfig.masterKey = config.masterKey;
  }
};

export const resolveMarketplaceConfig = (): IMarketplaceConfig => {
  const pkgJSON = fse.readJsonSync(resolveCWDPkgJSON());

  const { marketplaceConfigField } = kExtensionConfig;

  if (pkgJSON && pkgJSON[marketplaceConfigField]) {
    const config = pkgJSON[marketplaceConfigField];
    if (config.endpoint) {
      log.info(
        '使用 package.json 中的定义的 marketplaceConfig.endpoint 配置: ' + pkgJSON[marketplaceConfigField].endpoint,
      );
      kMarketplaceConfig.endpoint = config.endpoint;
    }
    if (config.accountId) {
      log.info(
        '使用 package.json 中的定义的 marketplaceConfig.accountId 配置: ' + pkgJSON[marketplaceConfigField].accountId,
      );
      kMarketplaceConfig.accountId = config.accountId;
    }
    if (config.masterKey) {
      log.info('使用 package.json 中的定义的 marketplaceConfig.masterKey 配置。');
      kMarketplaceConfig.masterKey = config.masterKey;
    }
  }

  return kMarketplaceConfig;
};

export function resolveFrameworkPath() {
  try {
    const pkgPath = require.resolve(`${kExtensionConfig.frameworkPackageName}/package.json`);
    return path.resolve(pkgPath, '..');
  } catch (err) {
    return '';
  }
}

export interface IExtensionInstallationConfig {
  extensionDir: string;
  extensionMetadataDir: string;
  extensionMetadataTypePath: string;
}

export function resolveExtensionInstallationConfig(): IExtensionInstallationConfig {
  const frameworkPath = resolveFrameworkPath();

  const extensionDir = path.join(frameworkPath, kExtensionConfig.configurationDir, 'extensions');
  const extensionMetadataDir = path.join(frameworkPath, 'extensions');
  const extensionMetadataTypePath = path.join(frameworkPath, 'extensions.d.ts');

  return {
    extensionDir: extensionDir,
    extensionMetadataDir: extensionMetadataDir,
    extensionMetadataTypePath: extensionMetadataTypePath,
  };
}
