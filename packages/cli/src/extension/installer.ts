import * as path from 'path'
import { ExtensionInstaller, Extension } from '@ali/ide-extension-installer';
import log from 'npmlog'
import semver from 'semver'
import * as fse from 'fs-extra';
import { parallelLimit } from './../util'
import { EXTENSION_DIR, FRAMEWORK_PATH, FRAMEWORK_NAME, LOG_PREFIX, EXTENSION_METADATA_DIR } from './constant'
import { ExtensionScanner } from './scanner'
import { IWorkExtensionMetaData } from './type';

if (!FRAMEWORK_PATH) {
  log.error(LOG_PREFIX, `cli 无法单独使用，需要配合 spacex 一起使用，请直接安装 ${FRAMEWORK_NAME}`)
  process.exit(1)
}

const pkgJSON = fse.readJSONSync(path.join(__dirname, '../../package.json'))

const extensionInstaller = new ExtensionInstaller({
  accountId: 'nGJBcqs1D-ma32P3mBftgsfq',
  masterKey: '-nzxLbuqvrKh8arE0grj2f1H',
  frameworkVersion: pkgJSON.engines.kaitian,
  dist: EXTENSION_DIR,
  ignoreIncreaseCount: true,
})

export const install = async (extensions: Extension[]) => {
  if (!extensions?.length) {
    // 使用 package.json 中的配置
    extensions = await getExtensionFromPackage()
  }
  checkExtensions(extensions)
  await parallelLimit(extensions.map(ext => () => installExtension(ext)), 5)
  const metadata = await new ExtensionScanner([EXTENSION_DIR], {}).run()
  await writeMetadata(metadata)
  log.info(FRAMEWORK_NAME, 'extensions installed successfully')
}

async function getExtensionFromPackage() {
  try {
    const projectPkgJSON = await fse.readJSON(path.resolve('package.json'))
    return projectPkgJSON?.['kaitian-extensions'] ?? []
  } catch (err) {
    return []
  }
}

function checkExtensions(extensions: Extension[]) {
  extensions.forEach((ext) => {
    if (!ext.publisher) {
      log.error(FRAMEWORK_NAME, `${JSON.stringify(ext)} 缺少 publisher`)
      throw new Error('exit')
    }
    if (!ext.name) {
      log.error(FRAMEWORK_NAME, `${JSON.stringify(ext)} 缺少 name`)
      throw new Error('exit')
    }
    if (!ext.version) {
      log.error(FRAMEWORK_NAME, `${JSON.stringify(ext)} 缺少 version`)
      throw new Error('exit')
    } else if (!semver.valid(ext.version)) {
      log.error(FRAMEWORK_NAME, `${JSON.stringify(ext)} 中的 version 无效`)
      throw new Error('exit')
    }
  })
}

async function installExtension(extension: Extension) {
  try {
    await extensionInstaller.install({
      publisher: extension.publisher,
      name: extension.name,
      version: extension.version
    })
  } catch(err) {
    log.error(FRAMEWORK_NAME, `${extension.publisher}.${extension.name}@${extension.version} 安装失败，请稍后重试`)
  }
}

async function writeMetadata(metadata: IWorkExtensionMetaData[]) {
  await fse.ensureDir(EXTENSION_METADATA_DIR)
  return Promise.all(metadata.map(async data => {
    try {
      const p = path.join(EXTENSION_METADATA_DIR, `${data.extensionId}.js`)
      await fse.writeFile(p, `
module.exports = ${JSON.stringify(data, null, 2)}
      `.trim() + '\n')
    } catch (err) {
      log.error(FRAMEWORK_NAME, `${data.extensionId} 安装失败`)
    }
  }))
}
