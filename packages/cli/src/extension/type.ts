import { JSONType } from '@alipay/alex-shared';

export {
  IExtensionBasicMetadata,
  NLSInfo,
  IExtensionIdentity,
  IExtensionDesc,
  JSONType,
  IExtensionMetadata,
  IExtensionMode,
} from '@alipay/alex-shared';

export interface IExtensionContributions extends JSONType {}

export interface IKaitianExtensionContributions extends JSONType {}

export interface IExtensionServerOptions {
  host?: string;
}
