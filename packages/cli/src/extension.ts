import * as path from 'path'
import { ExtensionInstaller, Extension } from '@ali/ide-extension-installer';
import * as fse from 'fs-extra';
import { from, of } from 'rxjs'
import { mergeMap, filter } from 'rxjs/operators'
import { EXTENSION_DIR, EXTENSION_METADATA_DIR } from './util/constant'
import { getExtension } from './extension/scanner'
import { IWorkerExtensionMetaData, IExtension } from './extension/type';
import log from './util/log'
import checkFramework from './util/check-framework';
import { createMetadataType } from './extension/metadata-type';

let extensionInstaller: ExtensionInstaller

export const install = async () => {
  checkFramework()

  createInstaller()

  // TODO: 暂时只支持从 package.json 配置，不支持通过 install 安装
  const extensions = await getExtensionFromPackage()
  
  checkExtensions(extensions)

  await clearCache()

  log.start('开始安装扩展')

  from(extensions).pipe(
    mergeMap(installExtension, 5), // 限制并发数 5
    mergeMap(extPath => Array.isArray(extPath) ? from(extPath) : of(extPath)),
    mergeMap(getExtension, 5),
    filter(data => !!data),
    mergeMap(writeMetadata)
  ).subscribe(
    (extensionId) => {
      log.info(`${extensionId} 安装完成`)
    },
    () => {
      log.error('扩展安装失败，请稍后重试')
    },
    () => {
      log.success('扩展安装成功')
    }
  )
}

async function createInstaller() {
  const pkgJSON = fse.readJSONSync(path.join(__dirname, '../package.json'))
  extensionInstaller = new ExtensionInstaller({
    accountId: 'nGJBcqs1D-ma32P3mBftgsfq',
    masterKey: '-nzxLbuqvrKh8arE0grj2f1H',
    frameworkVersion: pkgJSON.engines.kaitian,
    dist: EXTENSION_DIR,
    ignoreIncreaseCount: true,
  })
}

async function clearCache() {
  await fse.remove(EXTENSION_DIR)
  await fse.remove(EXTENSION_METADATA_DIR)
  await fse.ensureDir(EXTENSION_DIR)
  await fse.ensureDir(EXTENSION_METADATA_DIR)
}

async function getExtensionFromPackage(): Promise<IExtension[]> {
  try {
    const projectPkgJSON = await fse.readJSON(path.resolve('package.json'))
    return projectPkgJSON?.kaitianExtensions ?? []
  } catch (err) {
    return []
  }
}

async function setExtensionFromPackage(config: any) {
  try {
    const pkgPath = path.resolve('package.json')
    const projectPkgJSON = await fse.readJSON(pkgPath)
    projectPkgJSON.kaitianExtensions = config
    await fse.writeJSON(pkgPath, projectPkgJSON, { spaces: 2 } )
  } catch (err) {
  }
}

function checkExtensions(extensions: Extension[]) {
  for (const ext of extensions) {
    const { publisher, name, version } = ext
    let errMsg = ''
    if (!publisher) {
      errMsg = '缺少 publisher'
    } else if (!name) {
      errMsg = '缺少 name'
    } else if (!version) {
      errMsg = '缺少 version'
    }
    // TODO: should valid version ??
    // else if (!semver.valid(version)) {
    //   errMsg = '缺少 publisher'
    // }
    if (errMsg) {
      log.error(`${JSON.stringify(ext)} ${errMsg}`)
      throw new Error('error')
    }
  }
}

async function installExtension(extension: IExtension) {
  return extensionInstaller.install({
    publisher: extension.publisher,
    name: extension.name,
    version: extension.version
  })
}

async function writeMetadata(metadata: IWorkerExtensionMetaData) {
  await fse.ensureDir(EXTENSION_METADATA_DIR)

  await fse.writeFile(
    path.join(EXTENSION_METADATA_DIR, `${metadata.extensionId}.js`),
    `
module.exports = ${JSON.stringify(metadata, null, 2)}
    `.trim() + '\n'
  )
  await fse.writeFile(
    path.join(EXTENSION_METADATA_DIR, `${metadata.extensionId}.d.ts`),
    createMetadataType(metadata.extensionId)
  )
  return metadata.extensionId
}

// uninstall
export async function uninstall(extensionId: string[]) {
  const extensions = await getExtensionFromPackage()
  const removeExtensions: IExtension[] = []
  const remainExtensions: IExtension[] = []
  for (const config of extensions) {
    let index = -1
    for (let i = 0; i < extensionId.length; i++) {
      if (`${config.publisher}.${config.name}` === extensionId[i]) {
        index = i
        break
      }
    }
    if (index !== -1) {
      extensionId.splice(index, 1)
      removeExtensions.push(config)
    } else {
      remainExtensions.push(config)
    }
  }
  if (extensionId.length) {
    extensionId.forEach(id => {
      log.error(`${id} 未安装，无法卸载`)
      throw new Error('error')
    })
  }
  await Promise.all(removeExtensions.map(async (ext) => {
    const extensionId = `${ext.publisher}.${ext.name}`
    await fse.remove(path.join(`${EXTENSION_DIR}`, `${extensionId}-${ext.version}`))
    await fse.remove(path.join(EXTENSION_METADATA_DIR, `${extensionId}.js`))
    await fse.remove(path.join(EXTENSION_METADATA_DIR, `${extensionId}.d.ts`))
  }))
  await setExtensionFromPackage(remainExtensions)

  log.success('卸载插件成功')
}
