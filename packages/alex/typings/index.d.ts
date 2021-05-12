/// <reference path="thenable.d.ts" />

declare module '@alipay/alex/languages';
declare module '@alipay/alex/languages/*';

declare module '@alipay/alex/extensions/*' {
  import { IExtensionBasicMetadata } from '@alipay/alex-shared';
  const metadata: IExtensionBasicMetadata;
  export = metadata;
}
