import * as fse from 'fs-extra';
import * as path from 'path';
import { FRAMEWORK_NAME, EXTENSION_METADATA_DIR } from '../util/constant';

const referenceFile = '_reference.d.ts';

async function createReference() {
  const p = path.join(EXTENSION_METADATA_DIR, referenceFile);
  if (!(await fse.pathExists(p))) {
    await fse.writeFile(
      p,
      `
interface JSONType {
  [key: string]: any
}
interface IExtensionBasicMetadata {
  extension: {
    publisher: string
    name: string
    version: string
  }
  packageJSON: {
    name: string
    activationEvents?: string[]
    kaitianContributes?: Record<string, any>
    contributes?: Record<string, any>
  }
  defaultPkgNlsJSON: JSONType | undefined
  pkgNlsJSON: JSONType
  nlsList: {
    languageId: string
    filename: string
  }[]
  extendConfig: JSONType
}
  `.trim() + '\n'
    );
  }
}

export async function createMetadataType(extensionId: string) {
  const content =
    `
/// <reference path="${referenceFile}" />
declare var data: IExtensionBasicMetadata
export = data
  `.trim() + '\n';
  await createReference();
  return fse.writeFile(path.join(EXTENSION_METADATA_DIR, `${extensionId}.d.ts`), content);
}

// export async function removeMetadataType(extensionId: string) {
//   const content = await fse.readFile(EXTENSION_METADATA_TYPE_PATH, 'utf8')
//   const reg = new RegExp(`//\\s*${extensionId}[\\s\\S]+//\\s*${extensionId}`)
//   await fse.writeFile(EXTENSION_METADATA_TYPE_PATH, content.replace(reg, '\n'))
// }

// export async function clearMetadataType() {
//   await fse.writeFile(EXTENSION_METADATA_TYPE_PATH, '// extension metadata declarations')
// }
