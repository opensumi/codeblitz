import { ExtraMetadata, IExtensionMetadata } from '@alipay/alex-shared';

import {
  IExtensionNodeClientService,
  ExtensionNodeServiceServerPath,
} from '@opensumi/ide-extension';

// https://medium.com/javascript-in-plain-english/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
// https://blog.logrocket.com/whats-new-in-typescript-3-8/
export type { ExtraMetadata, IExtensionMetadata };

export { IExtensionNodeClientService, ExtensionNodeServiceServerPath };
