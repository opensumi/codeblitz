import { Uri } from '@ali/ide-core-common'

export interface JSONType {
  [key: string]: any
}

export interface ExtraMetaData {
  [key: string]: any
}

export const ExtensionNodeServiceServerPath = 'ExtensionNodeServiceServerPath'

export interface IExtensionMetaData {
  id: string
  extensionId: string
  // 支持使用自定义uri
  path: string
  uri?: Uri
  packageJSON: { [key: string]: any }
  defaultPkgNlsJSON: { [key: string]: any } | undefined
  packageNlsJSON: { [key: string]: any } | undefined
  extraMetadata: JSONType
  realPath: string // 真实路径，用于去除symbolicLink
  extendConfig: JSONType
  isBuiltin: boolean
  isDevelopment?: boolean
}

export const IExtensionNodeClientService = Symbol('IExtensionNodeClientService')
export interface IExtensionNodeClientService {
  getElectronMainThreadListenPath(clientId: string): Promise<string>
  getAllExtensions(
    scan: string[],
    extensionCandidate: string[],
    localization: string,
    extraMetaData: ExtraMetaData
  ): Promise<IExtensionMetaData[]>
  createProcess(clientId: string): Promise<void>
  getExtension(
    extensionPath: string,
    localization: string,
    extraMetaData?: ExtraMetaData
  ): Promise<IExtensionMetaData | undefined>
  infoProcessNotExist(): void
  infoProcessCrash(): void
  disposeClientExtProcess(clientId: string, info: boolean): Promise<void>
  updateLanguagePack(
    languageId: string,
    languagePackPath: string,
    storagePath: string
  ): Promise<void>
}
