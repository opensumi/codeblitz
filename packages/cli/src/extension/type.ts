export interface IExtensionContributions {
  [key: string]: any
}

export interface IKaitianExtensionContributions {
  [key: string]: any
}

export interface IExtensionMetaData {
  id: string;
  extensionId: string;
  // 支持使用自定义uri
  path: string;
  uri?: {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
  };
  packageJSON: { [key: string]: any };
  defaultPkgNlsJSON: { [key: string]: any } | undefined;
  packageNlsJSON: { [key: string]: any } | undefined;
  extraMetadata: JSONType;
  realPath: string; // 真实路径，用于去除symbolicLink
  extendConfig: JSONType;
  isBuiltin: boolean;
  isDevelopment?: boolean;
}

export interface NLS {
  languageId: string
  filename: string
}

/**
 * 纯 worker 插件的 metadata，部分字段有更改，在运行时转换补齐
 */
export interface IWorkerExtensionMetaData {
  id: string;
  extensionId: string;
  packageJSON: { contributes: any };
  defaultPkgNlsJSON: { [key: string]: any } | undefined;
  pkgNlsJSON: { [key: string]: any };
  nlsList: NLS[]
  extendConfig: JSONType;
}

export interface JSONType { [key: string]: any; }

export interface IExtension {
  publisher: string
  name: string
  version: string
}
