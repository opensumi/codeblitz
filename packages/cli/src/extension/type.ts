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

/**
 * 纯 worker 插件的 metadata，部分字段有更改，在运行时转换补齐
 */
export interface IWorkExtensionMetaData {
  id: string;
  extensionId: string;
  packageJSON: { [key: string]: any };
  defaultPkgNlsJSON: { [key: string]: any } | undefined;
  allPkgNlsJSON: { [key: string]: any };
  extraMetadata: JSONType;
  extendConfig: JSONType;
}

export interface ExtraMetaData {
  [key: string]: any;
}

export interface JSONType { [key: string]: any; }
