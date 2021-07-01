import { Injectable } from '@ali/common-di';
import { FileSystemResourceProvider } from '@ali/ide-editor/lib/browser/fs-resource/fs-resource';
import { URI, MaybePromise } from '@ali/ide-core-common';
import { IResource } from '@ali/ide-editor';

@Injectable()
export class ExtendedFileSystemResourceProvider extends FileSystemResourceProvider {
  constructor() {
    super();
  }

  handlesUri(uri: URI) {
    const weight = super.handlesUri(uri);
    if (weight === 10) {
      return 100 as any;
    }
    return weight;
  }

  provideResource(uri: URI): MaybePromise<IResource<any>> {
    // 为了让 file 协议文件不要默认打开
    return (super.provideResource(uri) as Promise<IResource<any>>).then((n) => ({
      ...n,
      supportsRevive: false,
    }));
  }
}
