import { ExtraMetadata, IExtensionMetadata } from '@alipay/alex-shared';

// https://medium.com/javascript-in-plain-english/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
// https://blog.logrocket.com/whats-new-in-typescript-3-8/
export type { ExtraMetadata, IExtensionMetadata };

export const ExtensionNodeServiceServerPath = 'ExtensionNodeServiceServerPath';

export const IExtensionNodeClientService = Symbol('IExtensionNodeClientService');
export interface IExtensionNodeClientService {
  getElectronMainThreadListenPath(clientId: string): Promise<string>;
  getAllExtensions(
    scan: string[],
    extensionCandidate: string[],
    localization: string,
    extraMetaData: ExtraMetadata
  ): Promise<IExtensionMetadata[]>;
  createProcess(clientId: string): Promise<void>;
  getExtension(
    extensionPath: string,
    localization: string,
    extraMetaData?: ExtraMetadata
  ): Promise<IExtensionMetadata | undefined>;
  infoProcessNotExist(): void;
  infoProcessCrash(): void;
  disposeClientExtProcess(clientId: string, info: boolean): Promise<void>;
  updateLanguagePack(
    languageId: string,
    languagePackPath: string,
    storagePath: string
  ): Promise<void>;
}
