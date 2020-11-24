import { configure } from 'browserfs'
import { os, fse } from '../node'
import { AppConfig } from './app'
import { WORKSPACE_DIR } from '../../common'
import { IndexedDBName } from '../../common/constant'

export const bootstrap = async (appConfig: AppConfig) => {
  await new Promise<void>((resolve, reject) => {
    configure(
      {
        fs: 'MountableFileSystem',
        options: {
          [os.homedir()]: { fs: 'IndexedDB', options: { storeName: IndexedDBName } },
          [os.tmpdir()]: { fs: 'InMemory', options: {} },
        },
      },
      (err) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
  // 初始化文件目录
  await Promise.all([
    await fse.ensureDir(appConfig.workspaceDir || WORKSPACE_DIR),
    await fse.ensureDir(appConfig.marketplace.extensionDir),
  ])
}
