export { IExtensionBasicMetadata, NLS, IExtensionIdentity } from '@alipay/spacex-shared';

export interface IExtensionId {
  publisher: string;
  name: string;
  version?: string;
}

export interface JSONType {
  [key: string]: any;
}

export interface IExtensionContributions extends JSONType {}

export interface IKaitianExtensionContributions extends JSONType {}
export interface IExtensionMetaData {
  id: string;
  extensionId: string;
  path: string;
  packageJSON: { [key: string]: any };
  defaultPkgNlsJSON: { [key: string]: any } | undefined;
  packageNlsJSON: { [key: string]: any } | undefined;
  extraMetadata: JSONType;
  realPath: string; // 真实路径，用于去除symbolicLink
  extendConfig: JSONType;
  isBuiltin: boolean;
  isDevelopment?: boolean;
  uri?: {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
  };
}
