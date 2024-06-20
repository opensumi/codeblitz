import * as fse from 'fs-extra';
import * as path from 'path';
import { IExtensionInstallationConfig, resolveExtensionInstallationConfig } from '../util/constant';

const referenceFile = '_reference.d.ts';

async function createReference(config: IExtensionInstallationConfig) {
  const refPath = path.join(config.extensionMetadataDir, referenceFile);
  if (!(await fse.pathExists(refPath))) {
    await fse.writeFile(
      refPath,
      `
import { IExtensionBasicMetadata } from '@codeblitzjs/ide-common'
declare const metadata: IExtensionBasicMetadata;
export { metadata }
    `.trim() + '\n'
    );
  }
}

export async function createMetadataType(extensionId: string) {
  const config = resolveExtensionInstallationConfig();
  const content =
    `
import { metadata } from './_reference';
export = metadata;
  `.trim() + '\n';
  await createReference(config);
  return fse.writeFile(path.join(config.extensionMetadataDir, `${extensionId}.d.ts`), content);
}
