export { IExtensionBasicMetadata, NLS, IExtensionIdentity } from '@alipay/spacex-shared';

export interface IExtensionContributions {
  [key: string]: any;
}

export interface IKaitianExtensionContributions {
  [key: string]: any;
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

export interface JSONType {
  [key: string]: any;
}
