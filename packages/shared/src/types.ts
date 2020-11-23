interface JSONType {
  [key: string]: any
}

export interface NLS {
  languageId: string
  filename: string
}

/**
 * 纯 worker 插件的 metadata，部分字段有更改，在运行时转换补齐
 */
export interface IExtensionBasicMetadata {
  extension: IExtensionIdentity
  packageJSON: {
    name: string
    contributes: any
  }
  defaultPkgNlsJSON: JSONType | undefined
  pkgNlsJSON: JSONType
  nlsList: NLS[]
  extendConfig: JSONType
}

export interface IExtensionIdentity {
  publisher: string
  name: string
  version: string
}
