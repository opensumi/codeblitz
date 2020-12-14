import * as fse from 'fs-extra';
import * as path from 'path';
import { EXTENSION_METADATA_DIR } from '../util/constant';

const referenceFile = '_reference.d.ts';

async function createReference() {
  const refPath = path.join(EXTENSION_METADATA_DIR, referenceFile);
  if (!(await fse.pathExists(refPath))) {
    await fse.writeFile(
      refPath,
      `
import { IExtensionBasicMetadata } from '@alipay/spacex-shared'
declare const metadata: IExtensionBasicMetadata;
export { metadata }
    `.trim() + '\n'
    );
  }
}

export async function createMetadataType(extensionId: string) {
  const content =
    `
import { metadata } from './_reference';
export = metadata;
  `.trim() + '\n';
  await createReference();
  return fse.writeFile(path.join(EXTENSION_METADATA_DIR, `${extensionId}.d.ts`), content);
}
