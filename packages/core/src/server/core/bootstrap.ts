import { configure } from 'browserfs'
import { os, fse } from '../node'
import { AppConfig } from './app'
import { WORKSPACE_DIR } from '../../common'

export const bootstrap = async (appConfig: AppConfig) => {
  await new Promise((resolve, reject) => {
    configure(
      {
        fs: 'MountableFileSystem',
        options: {
          [os.homedir()]: { fs: 'IndexedDB', options: {} },
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
  await fse.ensureDir(appConfig.workspaceDir || WORKSPACE_DIR)
}
