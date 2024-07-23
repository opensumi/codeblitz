import { IExtensionMode } from '@codeblitzjs/ide-common';
import { Extension, ExtensionInstaller } from '@opensumi/extension-installer';
import * as fse from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { from, of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { createMetadataType } from './extension/metadata-type';
import { getExtension } from './extension/scanner';
import { IExtensionBasicMetadata, IExtensionDesc, IExtensionIdentity, IExtensionServerOptions } from './extension/type';
import { formatExtension } from './util';
import checkFramework from './util/check-framework';
import {
  IExtensionInstallationConfig,
  kExtensionConfig,
  resolveExtensionInstallationConfig,
  resolveMarketplaceConfig,
} from './util/constant';
import { error, log } from './util/log';
import { resolveCWDPkgJSON } from './util/path';
import { createServer, getHttpUri } from './util/serve-file';

let extensionInstaller: ExtensionInstaller;
let shouldWriteConfig = false;

export const install = async (
  extensionId?: string[],
  options?: { silent: boolean; mode?: 'public' | 'internal' },
) => {
  checkFramework();

  createInstaller();

  const installationConfig = resolveExtensionInstallationConfig();

  let extensions: IExtensionDesc[] = [];

  if (extensionId?.length) {
    extensions = parseExtensionId(extensionId, options?.mode);
    shouldWriteConfig = true;
    await Promise.all(extensions.map((ext) => removeExtensionById(installationConfig, ext)));
  } else {
    const extensionConfig = await getExtensionFromPackage();
    if (!extensionConfig.length && !options?.silent) {
      log.warn(`当前未配置 ${kExtensionConfig.extensionField} npx ${kExtensionConfig.product} ext -h 查看帮助`);
      return;
    }
    checkExtensionConfig(extensionConfig);
    extensions = extensionConfig;
    await removeAllExtension(installationConfig);
  }

  if (!extensions.length) return;

  log.start('开始安装扩展\n');
  extensions.forEach((ext) => {
    console.log(`  * ${formatExtension(ext)}`);
  });

  const installedExtensions: IExtensionIdentity[] = [];

  from(extensions)
    .pipe(
      mergeMap(installExtension, 5), // 限制并发数 5
      mergeMap(([extPath, mode]) =>
        Array.isArray(extPath)
          ? from(extPath.map((p) => [p, mode] as const))
          : of([extPath, mode] as const)
      ),
      mergeMap(([extPath, mode]) => getExtension(extPath, mode), 5),
      filter((data) => !!data),
      mergeMap((meta) => writeMetadata(installationConfig, meta!)),
    )
    .subscribe(
      (ext) => {
        if (options?.mode === 'public') {
          ext.mode = 'public';
        }
        installedExtensions.push({ ...ext });
        log.info(`${formatExtension(ext)} 安装完成`);
      },
      (err) => {
        log.error('扩展安装失败，请稍后重试');
        console.error(err);
      },
      () => {
        if (shouldWriteConfig) {
          modifyPkgJSON(installedExtensions);
        }
        log.success('扩展安装成功');
      },
    );
};

/**
 * 从本地安装扩展
 * @param dirs 扩展目录
 */
export const installLocalExtensions = async (dirs: string[], options?: IExtensionServerOptions) => {
  checkFramework();

  if (!dirs.length) {
    return;
  }

  const installationConfig = resolveExtensionInstallationConfig();

  const absoluteDirs = dirs.map((dir) => path.resolve(dir));

  log.start('开始安装本地扩展\n');
  const homedir = os.homedir();
  absoluteDirs.forEach((dir) => {
    let readablePath = dir;
    if (dir.startsWith(homedir)) {
      readablePath = dir.replace(homedir, '~');
    }
    console.log(`  * ${readablePath}`);
  });

  const httpUri = await getHttpUri(options);

  from(absoluteDirs)
    .pipe(
      mergeMap((localExtPath) => getExtension(localExtPath, 'local', httpUri), 5),
      filter((data) => !!data),
      mergeMap((meta) => writeMetadata(installationConfig, meta!)),
    )
    .subscribe(
      (ext) => {
        log.info(`${formatExtension(ext)} 安装完成`);
      },
      (err) => {
        log.error('本地扩展安装失败，请重试');
        console.error(err);
      },
      () => {
        log.success('本地扩展安装成功');
        createServer(absoluteDirs, httpUri);
      },
    );
};

async function createInstaller() {
  const pkgJSON = fse.readJSONSync(path.join(__dirname, '../package.json'));

  const marketplaceConfig = resolveMarketplaceConfig();
  const installConfig = resolveExtensionInstallationConfig();
  extensionInstaller = new ExtensionInstaller({
    endpoint: marketplaceConfig.endpoint,
    accountId: marketplaceConfig.accountId,
    masterKey: marketplaceConfig.masterKey,
    frameworkVersion: pkgJSON.engines.opensumi,
    dist: installConfig.extensionDir,
    ignoreIncreaseCount: true,
    retry: 3, // 失败重试
  });
}

async function removeAllExtension(installationConfig: IExtensionInstallationConfig) {
  await fse.remove(installationConfig.extensionDir);
  await fse.remove(installationConfig.extensionMetadataDir);
  await fse.ensureDir(installationConfig.extensionDir);
  await fse.ensureDir(installationConfig.extensionMetadataDir);
}

async function removeExtensionById(installationConfig: IExtensionInstallationConfig, ext: IExtensionDesc) {
  const extensionId = `${ext.publisher}.${ext.name}`;
  return Promise.all([
    await fse.remove(
      path.join(`${installationConfig.extensionDir}`, `${extensionId}${ext.version ? `-${ext.version}` : ''}`),
    ),
    await fse.remove(path.join(installationConfig.extensionMetadataDir, `${extensionId}.js`)),
    await fse.remove(path.join(installationConfig.extensionMetadataDir, `${extensionId}.d.ts`)),
  ]);
}

async function getExtensionFromPackage(): Promise<IExtensionDesc[]> {
  try {
    const projectPkgJSON = await fse.readJSON(resolveCWDPkgJSON());
    return projectPkgJSON?.[kExtensionConfig.extensionField] ?? [];
  } catch (err) {
    return [];
  }
}

async function setExtensionFromPackage(config: any) {
  try {
    const pkgPath = resolveCWDPkgJSON();
    const projectPkgJSON = await fse.readJSON(pkgPath);
    projectPkgJSON[kExtensionConfig.extensionField] = config;
    await fse.writeJSON(pkgPath, projectPkgJSON, { spaces: 2 });
  } catch (err) {}
}

function checkExtensionConfig(extensions: Extension[]) {
  for (const ext of extensions) {
    const { publisher, name, version } = ext;
    let errMsg = '';
    if (!publisher) {
      errMsg = '缺少 publisher';
    } else if (!name) {
      errMsg = '缺少 name';
    }
    if (!version) {
      shouldWriteConfig = true;
    }
    // TODO: should valid version ??
    // else if (!semver.valid(version)) {
    //   errMsg = 'version 不合法'
    // }
    if (errMsg) {
      error(`${JSON.stringify(ext)} ${errMsg}`);
    }
  }
}

function parseExtensionId(extensionIds: string[], mode?: IExtensionMode) {
  const extensions: IExtensionDesc[] = [];
  for (const extId of extensionIds) {
    const reg = /^([a-zA-Z][0-9a-zA-Z_-]*)\.([a-zA-Z][0-9a-zA-Z_-]*)(?:@(\d+\.\d+\.\d+.*))?$/;
    const matched = extId.match(reg);
    if (!matched) {
      return error(`${extId} 格式不合法，请输入 publisher.name[@version] 的形式`);
    }
    const [, publisher, name, version] = matched;
    extensions.push({ publisher, name, version, mode });
  }
  return extensions;
}

async function installExtension(extension: IExtensionDesc) {
  const extensionPath = await extensionInstaller.install({
    publisher: extension.publisher,
    name: extension.name,
    version: extension.version,
  });
  return [extensionPath, extension.mode] as const;
}

async function writeMetadata(installationConfig: IExtensionInstallationConfig, metadata: IExtensionBasicMetadata) {
  await fse.ensureDir(installationConfig.extensionMetadataDir);

  const { extension } = metadata;
  const extensionId = `${extension.publisher}.${extension.name}`;
  await fse.writeFile(
    path.join(installationConfig.extensionMetadataDir, `${extensionId}.js`),
    `
module.exports = ${JSON.stringify(metadata, null, 2)}
    `.trim() + '\n',
  );
  await createMetadataType(extensionId);
  return extension;
}

async function modifyPkgJSON(extensions: IExtensionIdentity[]) {
  const extConfig = await getExtensionFromPackage();
  const newConfig = [...extConfig];
  extensions.forEach((ext) => {
    const obj = extConfig.find(
      (item) => item.publisher === ext.publisher && item.name === ext.name,
    );
    if (obj) {
      obj.version = ext.version;
    } else {
      newConfig.push(ext);
    }
  });
  setExtensionFromPackage(newConfig);
}

// uninstall
export async function uninstall(extensionId: string[]) {
  const installationConfig = resolveExtensionInstallationConfig();

  const extensions = await getExtensionFromPackage();
  const removeExtensions: IExtensionDesc[] = [];
  const remainExtensions: IExtensionDesc[] = [];
  for (const config of extensions) {
    let index = -1;
    for (let i = 0; i < extensionId.length; i++) {
      if (`${config.publisher}.${config.name}` === extensionId[i]) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      extensionId.splice(index, 1);
      removeExtensions.push(config);
    } else {
      remainExtensions.push(config);
    }
  }
  if (extensionId.length) {
    extensionId.forEach((id) => {
      log.error(`${id} 未安装，无法卸载`);
      throw new Error('error');
    });
  }
  await Promise.all(removeExtensions.map((ext) => removeExtensionById(installationConfig, ext)));
  await setExtensionFromPackage(remainExtensions);

  log.success('卸载扩展成功');
}
