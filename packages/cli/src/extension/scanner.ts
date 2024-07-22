/**
 * copy from @opensumi/ide-extension/src/node/extension.scanner.ts
 */

import { Uri } from '@opensumi/ide-core-common';
import { mergeContributes } from '@opensumi/ide-extension/lib/node/merge-contributes';
import * as fse from 'fs-extra';
import pick from 'lodash.pick';
import * as path from 'path';

import { IExtensionBasicMetadata, IExtensionMode, NLSInfo } from './type';

export async function getExtension(
  extensionPath: string,
  mode?: IExtensionMode,
  localUri?: Uri,
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
      } else if (!(packageJSON.engines.vscode || packageJSON.engines.kaitian || packageJSON.engines.opensumi)) {
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
    '.json',
  );
  const enLocalizedPath = await getLocalizedExtraMetadataPath(
    'package.nls',
    extensionPath,
    'en-US',
    '.json',
  );
  if (zhLocalizedPath) {
    pkgNlsJSON['zh-CN'] = await fse.readJSON(zhLocalizedPath);
  }
  if (enLocalizedPath) {
    pkgNlsJSON['en-US'] = await fse.readJSON(enLocalizedPath);
  }

  const nlsList = await getAllLocalized(extensionPath, 'package.nls', '.json');

  const metaPath = path.join(extensionPath, 'kaitian-meta.json');
  let webAssets: string[] = [];
  if (await fse.pathExists(metaPath)) {
    try {
      const meta = await fse.readJSON(metaPath);
      webAssets = meta?.['web-assets'] || [];
    } catch (e) {
      console.error(e);
      webAssets = [];
    }
  }

  if (!packageJSON.sumiContributes && packageJSON.kaitianContributes) {
    packageJSON.sumiContributes = packageJSON.kaitianContributes;
  }

  // merge for `sumiContributes` and `contributes`
  packageJSON.contributes = mergeContributes(
    packageJSON.sumiContributes,
    packageJSON.contributes,
  );

  // 本地扩展的 publisher 和 name 从 package.json 获取，
  // 远程扩展的 publisher 和 name 从目录名获取
  const { publisher, name } = mode === 'local' ? packageJSON : getExtensionIdByPath(extensionPath, packageJSON.version);

  let uri: string | undefined;
  if (mode === 'local' && localUri) {
    uri = localUri.with({ path: path.join(localUri.path, extensionPath) }).toString();
  }

  const metadata: IExtensionBasicMetadata = {
    extension: {
      publisher,
      name,
      version: packageJSON.version,
    },
    packageJSON: pick(packageJSON, [
      'name',
      'publisher',
      'version',
      'repository',
      'displayName',
      'description',
      'icon',
      'activationEvents',
      'sumiContributes',
      'contributes',
      'browser',
    ]),
    defaultPkgNlsJSON,
    pkgNlsJSON,
    nlsList,
    extendConfig,
    webAssets,
    mode,
    uri,
  };
  return metadata;
}

async function getLocalizedExtraMetadataPath(
  prefix: string,
  extensionPath: string,
  localization: string,
  suffix: string,
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
export async function getAllLocalized(
  extensionPath: string,
  prefix: string,
  suffix: string,
): Promise<NLSInfo[]> {
  const fileList = await fse.readdir(extensionPath);
  const result: NLSInfo[] = [];
  for (const file of fileList) {
    const filePath = path.join(extensionPath, file);
    const fileStat = await fse.stat(filePath);
    if (fileStat.isFile()) {
      const matched = file.match(
        new RegExp(`^(?:${prefix}|${prefix.toLocaleLowerCase()})(.+)${suffix}$`),
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
 * 获取插件的 publisher 和 name，可能和 package.json 上的 publisher 及 name 不一致，所以从文件名获取
 */
export function getExtensionIdByPath(extensionPath: string, version?: string) {
  const regExp = version
    ? new RegExp(`^(.+?)\\.(.+?)-(${version})$`)
    : /^(.+?)\.(.+?)-(\d+\.\d+\.\d+.*)$/;
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
