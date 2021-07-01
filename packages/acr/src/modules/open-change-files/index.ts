import { Autowired, Injectable } from '@ali/common-di';
import {
  Disposable,
  IEventBus,
  URI,
  PreferenceService,
  PreferenceChange,
} from '@ali/ide-core-browser';
import { basename } from '@ali/ide-core-common/lib/path';
import { IResourceOpenOptions, WorkbenchEditorService } from '@ali/ide-editor';

import { FileOpenMethod, DiffChangeEvent, OpenDiffEditorEvent } from '../../common';
import { reportOpenFileOperation } from '../../utils/monitor';
import { IAntcodeService, IPullRequestChangeDiff } from '../antcode-service/base';
import {
  fromDiffUri,
  fromGitUri,
  isChangeFileURI,
  splitChangeToTwoUris,
} from '../merge-request/changes-tree/util';

import './index.module.less';

@Injectable()
export class OpenChangeFilesService extends Disposable {
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  private _currentOpenedChangeFileUri: URI;

  private _isFoldingEnabled: boolean;

  constructor() {
    super();
    const _foldingEnableKey = 'acr.foldingEnabled';
    this._isFoldingEnabled = !!this.preferenceService.get<boolean>(_foldingEnableKey);
    this.addDispose(
      this.preferenceService.onPreferenceChanged((data: PreferenceChange) => {
        if (data.preferenceName === _foldingEnableKey) {
          this._isFoldingEnabled = data.newValue;
        }
      })
    );
  }

  /**
   * 当前打开的 change file 的 uri
   */
  public get currentOpenedChangeFileUri() {
    return this._currentOpenedChangeFileUri;
  }

  private getFileName(uri: URI) {
    // keep hash part
    return basename(uri.withoutScheme().withoutQuery().toString(true));
  }

  public openFile = async (change: IPullRequestChangeDiff, channel?: FileOpenMethod) => {
    const leftRef = this.antcodeService.leftRef;
    const rightRef = this.antcodeService.rightRef;
    const { uris, desc, status } = splitChangeToTwoUris(change, leftRef, rightRef);
    const [left, right] = uris;

    const options: IResourceOpenOptions = {
      preserveFocus: true,
      preview: false,
      // 默认打开在首个 tab 位置
      index: 0,
    };
    const title = `${this.getFileName(right)}${desc && ` (${desc})`}`;
    let targetUri: URI;
    if (!left) {
      targetUri = right;
      options.label = title;
    } else {
      if (status === 'renamed') {
        options.label = `${this.getFileName(left)} -> ${this.getFileName(right)}${
          desc && ` (${desc})`
        }`;
        if (change.delLineNum === 0 && change.addLineNum === 0) {
          // 真正的重命名
          // 如果只是重命名而没有修改内容，则直接使用 git 协议打开
          targetUri = right;
        } else {
          // 重命名文件同时存在变更内容时，用 diff 协议打开
          targetUri = URI.from({
            scheme: 'diff',
            query: URI.stringifyQuery({
              name: title,
              original: left,
              modified: right,
              newPath: change.newPath,
            }),
          });
        }
      } else {
        targetUri = URI.from({
          scheme: 'diff',
          query: URI.stringifyQuery({
            name: title,
            original: left,
            modified: right,
            newPath: change.newPath,
          }),
        });

        options.revealFirstDiff = !this._isFoldingEnabled;
      }
    }

    const { currentResource } = this.workbenchEditorService;
    // 打开已存在的 uri 则跳过
    if (currentResource?.uri.isEqual(targetUri)) {
      this.reportOpenFile(targetUri, channel, true);
      return;
    }

    /**
     * https://yuque.antfin.com/ide-framework/lsxfi3/rq2ko1
     * 如果当前 editor tab index 为 0 的 uri 是 change file 则通过 replace 打开
     * 否则默认将成为新的 index 0
     */
    const currentIndexZeroResourceUri = this.workbenchEditorService.editorGroups[0]?.resources[0]
      ?.uri;
    options.replace = Boolean(
      currentIndexZeroResourceUri && isChangeFileURI(currentIndexZeroResourceUri)
    );

    // 需要获取 diff 以便 folding 能正常工作
    await this.fetchDiff(change.newPath);

    // 标记为当前打开的文件
    this._currentOpenedChangeFileUri = targetUri;
    await this.workbenchEditorService.open(targetUri, options);
    this.reportOpenFile(targetUri, channel, false);

    // 将当前 targetUri 的 tab close-icon 隐藏掉
    // const tabElement = document.querySelector(
    //   `[class^=kt_editor_tab__][data-uri="${targetUri.toString()}"]`
    // );
    // if (tabElement) {
    //   tabElement.classList.add(styles.kt_editor_tab_no_close);
    // }
    this.eventBus.fire(
      new OpenDiffEditorEvent({
        uri: targetUri,
        channel,
      })
    );
  };

  // 数据上报
  private reportOpenFile(uri: URI, channel?: FileOpenMethod, isOpened = false) {
    // 排除掉 *自动打开首个文件* 等场景
    if (!channel) {
      return;
    }

    let rightUri = uri;
    if (uri.scheme === 'diff') {
      const { right } = fromDiffUri(uri);
      rightUri = right;
    }

    if (rightUri.scheme === 'git') {
      const { ref, path } = fromGitUri(rightUri);
      reportOpenFileOperation(path, uri.toString(), channel, isOpened, {
        projectId: this.antcodeService.projectPath,
        prId: this.antcodeService.pullRequest?.iid,
        commitId: ref,
      });
    }
  }

  private async fetchDiff(path: string) {
    // 如果没有 diff 信息，则去请求
    const changeDiff = this.antcodeService.pullRequestChangeList.find(
      (changeDiff) => changeDiff.newPath === path
    );
    // @ts-ignore
    if (!changeDiff.diff) {
      // @ts-ignore
      const data = await this.antcodeService.getDiffById(changeDiff.id);
      // @ts-ignore
      changeDiff.diff = data.diff;
      this.eventBus.fire(new DiffChangeEvent(data));
    }
  }
}
