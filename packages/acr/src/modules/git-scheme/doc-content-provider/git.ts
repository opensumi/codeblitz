import { Autowired, Injectable } from '@ali/common-di';
import { IEditorDocumentModelContentProvider } from '@ali/ide-editor/lib/browser';
import { Emitter, Event, URI, DisposableCollection } from '@ali/ide-core-common';

import { AbstractSCMDocContentProvider } from './base-scm';

import { IAntcodeService } from '../../antcode-service/base';
import { fromSCMUri } from '../../../utils/scm-uri';

@Injectable()
// @ts-ignore
export class GitDocContentProvider
  extends AbstractSCMDocContentProvider
  implements IEditorDocumentModelContentProvider {
  // TODO: 需要增加对文件变更后的监听，以保持文件内容最新
  scheme = 'git';

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private disposableCollection = new DisposableCollection();

  private _onDidChangeContent: Emitter<URI> = new Emitter();
  public onDidChangeContent: Event<URI> = this._onDidChangeContent.event;

  constructor() {
    super();
    this.disposableCollection.push(
      this.antcodeService.onDidEncodingChange(() => {
        // 通知已打开的编辑器，文件内容更新了
        const uriStrList = Array.from(this._openedEditorResources.keys());
        // 清理掉缓存数据
        this._openedEditorResources.clear();
        for (const uriStr of uriStrList) {
          this._onDidChangeContent.fire(new URI(uriStr));
        }
      })
    );
  }

  public dispose() {
    this.disposableCollection.dispose();
  }

  // @ts-ignore
  async fetchContentFromSCM(uri: URI) {
    const info = fromSCMUri(uri);
    // @ts-ignore
    return this.antcodeService.getFileContentByRef(info.path, info.ref);
  }
}
