import { JSONType } from '@codeblitzjs/ide-common';

export {
  IExtensionBasicMetadata,
  NLSInfo,
  IExtensionIdentity,
  IExtensionDesc,
  JSONType,
  IExtensionMetadata,
  IExtensionMode,
} from '@codeblitzjs/ide-common';

export interface IExtensionContributions extends JSONType {}

export interface IKaitianExtensionContributions extends JSONType {}

export interface IExtensionServerOptions {
  host?: string;
}
