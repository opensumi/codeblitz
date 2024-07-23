import { JSONType } from '@codeblitzjs/ide-common';

export {
  IExtensionBasicMetadata,
  IExtensionDesc,
  IExtensionIdentity,
  IExtensionMetadata,
  IExtensionMode,
  JSONType,
  NLSInfo,
} from '@codeblitzjs/ide-common';

export interface IExtensionContributions extends JSONType {}

export interface IKaitianExtensionContributions extends JSONType {}

export interface IExtensionServerOptions {
  host?: string;
}
