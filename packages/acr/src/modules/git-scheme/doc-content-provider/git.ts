import { Autowired, Injectable } from '@opensumi/di';
import { IEditorDocumentModelContentProvider } from '@opensumi/ide-editor/lib/browser';
import {
  Emitter,
  Event,
  URI,
  DisposableCollection,
  localize,
  IRange,
} from '@opensumi/ide-core-common';

import { AbstractSCMDocContentProvider } from './base-scm';

import { IAntcodeService } from '../../antcode-service/base';
import { fromSCMUri } from '../../../utils/scm-uri';
import { OpenChangeFilesService } from '../../open-change-files';
import { diffToContent } from '../../comments/utils';
import { IMessageService } from '@opensumi/ide-overlay';

@Injectable()
// @ts-ignore
export class GitDocContentProvider
  extends AbstractSCMDocContentProvider
  implements IEditorDocumentModelContentProvider
{
  // TODO: 需要增加对文件变更后的监听，以保持文件内容最新
  scheme = 'git';

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired()
  private readonly openChangeFilesService: OpenChangeFilesService;

  private disposableCollection = new DisposableCollection();

  private _onDidChangeContent: Emitter<URI> = new Emitter();
  public onDidChangeContent: Event<URI> = this._onDidChangeContent.event;

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  public diffData = new Map<string, IRange[]>();

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

  async fetchContentFromSCM(uri: URI) {
    const info = fromSCMUri(uri);
    let content = await this.antcodeService.getFileContentByRef(info.path, info.ref);
    // 修复 接口404情况
    if (!content && typeof content === 'object') {
      const diffChange = await this.openChangeFilesService.fetchDiff(info.path);
      content = '';
      if (diffChange?.diff) {
        const diffContent = diffToContent(diffChange.diff);

        if (info.ref === this.antcodeService.leftRef) {
          content = diffContent.original.join('\n');
          if (!this.diffData.has(uri.toString())) {
            this.diffData.set(uri.toString(), diffContent.originalFoldingRanges);
          }
        } else if (info.ref === this.antcodeService.rightRef) {
          content = diffContent.modified.join('\n');
          if (!this.diffData.has(uri.toString())) {
            this.diffData.set(uri.toString(), diffContent.modifiedFoldingRanges);
          }
        }
      } else {
        this.messageService.info(localize('misc.analyse.diff.none'));
        // throw new Error(formatLocalize('misc.analyse.diff.error', diffChange?.newPath))
      }
    }
    return content;
  }
}
