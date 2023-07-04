import * as path from 'path';
import * as os from 'os';
import { ExtensionInstaller, Extension } from '@ali/ide-extension-installer';
import * as fse from 'fs-extra';
import { from, of } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';
import { IExtensionMode } from '@alipay/alex-shared';
import { EXTENSION_DIR, EXTENSION_METADATA_DIR, EXTENSION_FIELD } from './util/constant';
import { getExtension } from './extension/scanner';
import {
  IExtensionBasicMetadata,
  IExtensionDesc,
  IExtensionIdentity,
  IExtensionServerOptions,
} from './extension/type';
import { log, error } from './util/log';
import checkFramework from './util/check-framework';
import { createServer, getHttpUri } from './util/serve-file';
import { formatExtension } from './util';
import { createMetadataType } from './extension/metadata-type';

let extensionInstaller: ExtensionInstaller;
let shouldWriteConfig = false;

export const install = async (
  extensionId?: string[],
  options?: { silent: boolean; mode?: 'public' | 'internal' }
) => {
  checkFramework();

  createInstaller();

  let extensions: IExtensionDesc[] = [];

  if (extensionId?.length) {
    extensions = parseExtensionId(extensionId, options?.mode);
    shouldWriteConfig = true;
    await Promise.all(extensions.map((ext) => removeExtensionById(ext)));
  } else {
    const extensionConfig = await getExtensionFromPackage();
    if (!extensionConfig.length && !options?.silent) {
      log.warn(`当前未配置 ${EXTENSION_FIELD} npx alex ext -h 查看帮助`);
      return;
    }
    checkExtensionConfig(extensionConfig);
    extensions = extensionConfig;
    await removeAllExtension();
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
      mergeMap(writeMetadata)
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
      }
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
      mergeMap(writeMetadata)
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
      }
    );
};

async function createInstaller() {
  const pkgJSON = fse.readJSONSync(path.join(__dirname, '../package.json'));
  extensionInstaller = new ExtensionInstaller({
    accountId: 'nGJBcqs1D-ma32P3mBftgsfq',
    masterKey: '-nzxLbuqvrKh8arE0grj2f1H',
    frameworkVersion: pkgJSON.engines.kaitian,
    dist: EXTENSION_DIR,
    ignoreIncreaseCount: true,
    retry: 3, // 失败重试
  });
}

async function removeAllExtension() {
  await fse.remove(EXTENSION_DIR);
  await fse.remove(EXTENSION_METADATA_DIR);
  await fse.ensureDir(EXTENSION_DIR);
  await fse.ensureDir(EXTENSION_METADATA_DIR);
}

async function removeExtensionById(ext: IExtensionDesc) {
  const extensionId = `${ext.publisher}.${ext.name}`;
  return Promise.all([
    await fse.remove(
      path.join(`${EXTENSION_DIR}`, `${extensionId}${ext.version ? `-${ext.version}` : ''}`)
    ),
    await fse.remove(path.join(EXTENSION_METADATA_DIR, `${extensionId}.js`)),
    await fse.remove(path.join(EXTENSION_METADATA_DIR, `${extensionId}.d.ts`)),
  ]);
}

async function getExtensionFromPackage(): Promise<IExtensionDesc[]> {
  try {
    const projectPkgJSON = await fse.readJSON(resolveCWDPkgJSON());
    return projectPkgJSON?.[EXTENSION_FIELD] ?? [];
  } catch (err) {
    return [];
  }
}

async function setExtensionFromPackage(config: any) {
  try {
    const pkgPath = resolveCWDPkgJSON();
    const projectPkgJSON = await fse.readJSON(pkgPath);
    projectPkgJSON[EXTENSION_FIELD] = config;
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

async function writeMetadata(metadata: IExtensionBasicMetadata) {
  await fse.ensureDir(EXTENSION_METADATA_DIR);

  const { extension } = metadata;
  const extensionId = `${extension.publisher}.${extension.name}`;
  await fse.writeFile(
    path.join(EXTENSION_METADATA_DIR, `${extensionId}.js`),
    `
module.exports = ${JSON.stringify(metadata, null, 2)}
    `.trim() + '\n'
  );
  await createMetadataType(extensionId);
  return extension;
}

async function modifyPkgJSON(extensions: IExtensionIdentity[]) {
  const extConfig = await getExtensionFromPackage();
  const newConfig = [...extConfig];
  extensions.forEach((ext) => {
    const obj = extConfig.find(
      (item) => item.publisher === ext.publisher && item.name === ext.name
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
  await Promise.all(removeExtensions.map((ext) => removeExtensionById(ext)));
  await setExtensionFromPackage(remainExtensions);

  log.success('卸载扩展成功');
}

function resolveCWDPkgJSON() {
  const initCWD = process.env.INIT_CWD || process.cwd();
  return path.resolve(initCWD, 'package.json');
}
