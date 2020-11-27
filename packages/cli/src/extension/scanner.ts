/**
 * copy from @ali/ide-kaitian-extension/src/node/extension.scanner.ts
 */

import * as path from 'path';
import * as fse from 'fs-extra';

import { mergeContributes } from './merge-contributes';
import { NLS, IExtensionBasicMetadata, IExtensionIdentity } from './type';

export async function getExtension(
  extensionPath: string
): Promise<IExtensionBasicMetadata | undefined> {
  if (!(await fse.pathExists(extensionPath))) {
    return undefined;
  }

  const pkgPath = path.join(extensionPath, 'package.json');
  const defaultPkgNlsPath = path.join(extensionPath, 'package.nls.json');
  const extendPath = path.join(extensionPath, 'kaitian.js');

  const pkgExist = await fse.pathExists(pkgPath);
  const defaultPkgNlsPathExist = await fse.pathExists(defaultPkgNlsPath);
  const extendExist = await fse.pathExists(extendPath);

  let pkgCheckResult = pkgExist;
  const extendCheckResult = extendExist;

  if (pkgExist) {
    try {
      const packageJSON = await fse.readJSON(pkgPath);
      if (!packageJSON.engines) {
        pkgCheckResult = false;
      } else if (!(packageJSON.engines.vscode || packageJSON.engines.kaitian)) {
        pkgCheckResult = false;
      }
    } catch (e) {
      console.error(e);
      pkgCheckResult = false;
    }
  }

  if (!(pkgCheckResult || extendCheckResult)) {
    return;
  }

  let defaultPkgNlsJSON: { [key: string]: string } | undefined;
  if (defaultPkgNlsPathExist) {
    defaultPkgNlsJSON = await fse.readJSON(defaultPkgNlsPath);
  }

  let packageJSON = {} as any;
  try {
    packageJSON = await fse.readJSON(pkgPath);
  } catch (e) {
    console.error(e);
    return;
  }

  let extendConfig = {};
  if (await fse.pathExists(extendPath)) {
    try {
      // 这里必须clear cache, 不然每次都一样
      delete require.cache[extendPath];
      extendConfig = require(extendPath);
    } catch (e) {
      console.error(e);
    }
  }

  const pkgNlsJSON: any = {};
  const zhLocalizedPath = await getLocalizedExtraMetadataPath(
    'package.nls',
    extensionPath,
    'zh-CN',
    '.json'
  );
  const enLocalizedPath = await getLocalizedExtraMetadataPath(
    'package.nls',
    extensionPath,
    'en-US',
    '.json'
  );
  if (zhLocalizedPath) {
    pkgNlsJSON['zh-CN'] = await fse.readJSON(zhLocalizedPath);
  }
  if (enLocalizedPath) {
    pkgNlsJSON['en-US'] = await fse.readJSON(enLocalizedPath);
  }

  const nlsList = await getAllLocalized(extensionPath, 'package.nls', '.json');

  // merge for `kaitianContributes` and `contributes`
  packageJSON.contributes = mergeContributes(
    packageJSON.kaitianContributes,
    packageJSON.contributes
  );

  const { publisher, name } = getExtensionIdByPath(extensionPath, packageJSON.version);

  const metadata: IExtensionBasicMetadata = {
    extension: {
      publisher,
      name,
      version: packageJSON.version,
    },
    packageJSON: {
      name: packageJSON.name,
      contributes: packageJSON.contributes,
    },
    defaultPkgNlsJSON,
    pkgNlsJSON,
    nlsList,
    extendConfig,
  };
  return metadata;
}

async function getLocalizedExtraMetadataPath(
  prefix: string,
  extensionPath: string,
  localization: string,
  suffix: string
): Promise<string | undefined> {
  const lowerCasePrefix = prefix.toLowerCase();
  const lowerCaseLocalization = localization.toLowerCase();
  const maybeExist = [
    `${prefix}.${localization}${suffix}`, // {prefix}.zh-CN{suffix}
    `${lowerCasePrefix}.${localization}${suffix}`,
    `${prefix}.${lowerCaseLocalization}${suffix}`, // {prefix}.zh-cn{suffix}
    `${lowerCasePrefix}.${lowerCaseLocalization}${suffix}`,
    `${prefix}.${localization.split('-')[0]}${suffix}`, // {prefix}.zh{suffix}
    `${lowerCasePrefix}.${localization.split('-')[0]}${suffix}`,
  ];

  for (const maybe of maybeExist) {
    const filepath = path.join(extensionPath, maybe);
    if (await fse.pathExists(filepath)) {
      return filepath;
    }
  }
  return undefined;
}

/**
 * 获取所有的 localized 文件
 */
async function getAllLocalized(
  extensionPath: string,
  prefix: string,
  suffix: string
): Promise<NLS[]> {
  const fileList = await fse.readdir(extensionPath);
  const result: NLS[] = [];
  for (const file of fileList) {
    const filePath = path.join(extensionPath, file);
    const fileStat = await fse.stat(filePath);
    if (fileStat.isFile()) {
      const matched = file.match(
        new RegExp(`^(?:${prefix}|${prefix.toLocaleLowerCase()})(.+)${suffix}$`)
      );
      if (matched) {
        result.push({
          filename: matched[0],
          languageId: matched[1],
        });
      }
    }
  }
  return result;
}

/**
 * 获取插件的 publisher 和 name，可能和 package.json 的 name 不一致，所以从文件名获取
 */
function getExtensionIdByPath(extensionPath: string, version?: string) {
  const regExp = version
    ? new RegExp(`^(.+?)\\.(.+?)-(${version})$`)
    : /^(.+?)\.(.+?)-(\d+\.\d+\.\d+)$/;
  const dirName = path.basename(extensionPath);
  const match = dirName.match(regExp);

  if (match === null) {
    throw new Error('无法获取 extensionId');
  }

  return {
    publisher: match[1],
    name: match[2],
  };
}
