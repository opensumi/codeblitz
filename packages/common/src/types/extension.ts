import { Uri } from '@opensumi/ide-core-common';
import { Optional } from './util';

export interface JSONType {
  [key: string]: any;
}

export interface NLSInfo {
  languageId: string;
  filename: string;
}

export type IExtensionMode = 'local' | 'internal' | 'public';

export interface IExtensionIdentity {
  publisher: string;
  name: string;
  version: string;
  mode?: IExtensionMode;
}

export type IExtensionDesc = Optional<IExtensionIdentity, 'version'>;

export interface ExtraMetadata {
  [key: string]: any;
}

/**
 * 纯 worker 插件的 metadata，部分字段有更改，在运行时转换补齐
 */
export interface IExtensionBasicMetadata {
  extension: IExtensionIdentity;
  packageJSON: {
    publisher: string;
    name: string;
    version: string;
    icon?: string;
    displayName?: string;
    description?: string;
    repository?: any;
    activationEvents?: string[];
    sumiContributes?: JSONType;
    contributes?: JSONType;
  };
  defaultPkgNlsJSON?: JSONType;
  pkgNlsJSON: JSONType;
  nlsList: NLSInfo[];
  extendConfig: JSONType;
  webAssets: string[];
  // 自定义 uri，用于本地研发模式
  uri?: string;
  mode?: IExtensionMode;
}

/**
 * server 层插件数据，和框架测一致
 */
export interface IExtensionMetadata {
  id: string;
  extensionId: string;
  path: string;
  packageJSON: JSONType;
  defaultPkgNlsJSON: JSONType | undefined;
  packageNlsJSON: JSONType | undefined;
  extraMetadata: ExtraMetadata;
  realPath: string; // 真实路径，用于去除symbolicLink
  extendConfig: JSONType;
  isBuiltin: boolean;
  isDevelopment?: boolean;
  uri?: Uri;
}
