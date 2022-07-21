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

  get openedEditorResources() {
    return this._openedEditorResources;
  }

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
    const query = uri.getParsedQuery();
    const isLeft = query.ref === this.antcodeService.leftRef;
    const isRight = query.ref === this.antcodeService.rightRef;
    let leftQuery, rightQuery;
    if (isLeft) {
      leftQuery = query;
      rightQuery = {
        ...query,
        ref: this.antcodeService.rightRef,
      };
    } else if (isRight) {
      rightQuery = query;
      leftQuery = {
        ...query,
        ref: this.antcodeService.leftRef,
      };
    } else {
      throw new Error('ref Error');
    }
    const leftUri = uri.withQuery(URI.stringifyQuery(leftQuery));
    const rightUri = uri.withQuery(URI.stringifyQuery(rightQuery));

    // diff 要同时请求两侧数据
    if (this.openChangeFilesService.isDiffScheme) {
      // 同时请求两边数据

      let [leftContent, rightContent] = await Promise.all([
        this.antcodeService.getFileContentByRef(leftQuery.path, leftQuery.ref),
        this.antcodeService.getFileContentByRef(rightQuery.path, rightQuery.ref),
      ]);
      // 两边有一边为null 404
      const isDiffData =
        (!leftContent && typeof leftContent === 'object') ||
        (!rightContent && typeof rightContent === 'object');
      if (isDiffData) {
        const diffChange = await this.openChangeFilesService.fetchDiff(info.path);
        if (diffChange?.diff) {
          const diffContent = diffToContent(diffChange.diff);
          this._openedEditorResources.set(leftUri.toString(), diffContent.original.join('\n'));
          this._openedEditorResources.set(rightUri.toString(), diffContent.modified.join('\n'));
          this.diffData.set(rightUri.toString(), diffContent.modifiedFoldingRanges);
          this.diffData.set(leftUri.toString(), diffContent.originalFoldingRanges);
        } else {
          this.messageService.info(localize('misc.analyse.diff.none'));
        }
      } else {
        this._openedEditorResources.set(leftUri.toString(), leftContent as string);
        this._openedEditorResources.set(rightUri.toString(), rightContent as string);
      }
    } else {
      let content = await this.antcodeService.getFileContentByRef(query.path, query.ref);
      if (!content && typeof content === 'object') {
        const diffChange = await this.openChangeFilesService.fetchDiff(info.path);
        if (diffChange?.diff) {
          const diffContent = diffToContent(diffChange.diff);
          if (isLeft) {
            content = diffContent.original.join('\n');
          } else {
            content = diffContent.modified.join('\n');
          }
          this.diffData.set(uri.toString(), diffContent.originalFoldingRanges);
        } else {
          this.messageService.info(localize('misc.analyse.diff.none'));
        }
      }
      this._openedEditorResources.set(uri.toString(), content as string);
    }
  }
}
