import * as fse from 'fs-extra'
import { EXTENSION_METADATA_TYPE_PATH, FRAMEWORK_NAME } from '../util/constant'

export function createMetadataType(extensionId: string) {
  const content = `
declare module "${FRAMEWORK_NAME}/extensions/${extensionId}" {
  declare var data: { [key: string]: any }
  export = data
}
  `.trim() + '\n'
  return content
}

// export async function removeMetadataType(extensionId: string) {
//   const content = await fse.readFile(EXTENSION_METADATA_TYPE_PATH, 'utf8')
//   const reg = new RegExp(`//\\s*${extensionId}[\\s\\S]+//\\s*${extensionId}`)
//   await fse.writeFile(EXTENSION_METADATA_TYPE_PATH, content.replace(reg, '\n'))
// }

// export async function clearMetadataType() {
//   await fse.writeFile(EXTENSION_METADATA_TYPE_PATH, '// extension metadata declarations')
// }
