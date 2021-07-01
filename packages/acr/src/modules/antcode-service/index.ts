import { Injectable, Optional } from '@ali/common-di';
import { action, observable, computed } from 'mobx';
import { Event, Emitter } from '@ali/ide-core-common';
import { Path } from '@ali/ide-core-common/lib/path';
import { URI } from '@ali/ide-core-browser';
import differenceBy from 'lodash/differenceBy';

import {
  IAntcodeCRProps,
  IAntcodeService,
  INoteIdToNote,
  IComment,
  IPullRequestChangeDiff,
  AntcodeEncodingType,
  IAnnotationData,
} from './base';

import {
  FileActionType,
  FileActionEncoding,
  FileAction,
  FileActionHeader,
} from './interfaces/file-action';
import { User } from './interfaces/user';
import { setUserWorkId } from '../../utils/monitor';
import { sortPathList } from '../../utils/change-file-sorter';

// antcode 所需要的 encoding 选项 key/value
export const antcodeEncodingOpts = [
  {
    label: 'UTF-8',
    value: AntcodeEncodingType.utf8,
  },
  {
    label: 'GBK',
    value: AntcodeEncodingType.gbk,
  },
];

@Injectable()
export class AntcodeService implements IAntcodeService {
  @observable
  public addLineNum: number;

  @observable
  public deleteLineNum: number;

  /* encoding start */
  @observable
  public encoding: AntcodeEncodingType;

  @action.bound
  public setEncoding(v: AntcodeEncodingType) {
    this.encoding = v;
    this.config.setEncoding(v);
  }

  private _onDidEncodingChangeEmitter = new Emitter<AntcodeEncodingType>();
  public readonly onDidEncodingChange: Event<AntcodeEncodingType> = this._onDidEncodingChangeEmitter
    .event;
  /* encoding end */

  /* projectId */
  private _projectId;
  get projectId(): number {
    return this._projectId;
  }
  set projectId(id: number) {
    this._projectId = id;
  }

  /* refs start */
  private _leftRef = '';
  get leftRef(): string {
    return this._leftRef;
  }
  set leftRef(ref: string) {
    this._leftRef = ref;
    this._onDidRefChangeEmitter.fire(null);
  }

  private _rightRef = '';
  get rightRef(): string {
    return this._rightRef;
  }
  set rightRef(ref: string) {
    this._rightRef = ref;
    this._onDidRefChangeEmitter.fire(null);
  }

  private _onDidRefChangeEmitter = new Emitter<null>();
  readonly onDidRefChange: Event<null> = this._onDidRefChangeEmitter.event;
  /* refs end */

  private _latestCommitSha = '';
  get latestCommitSha(): string {
    return this._latestCommitSha;
  }
  set latestCommitSha(sha: string) {
    this._latestCommitSha = sha;
    this._onDidRefChangeEmitter.fire(null);
  }
  private _onDidLatestCommitShaChangeEmitter = new Emitter<null>();
  readonly onDidLatestCommitShaChange: Event<null> = this._onDidLatestCommitShaChangeEmitter.event;

  // user
  public user: User;

  /* diffs start */
  @observable
  private _pullRequestChangeList: IPullRequestChangeDiff[] = [];
  get pullRequestChangeList(): IPullRequestChangeDiff[] {
    return this._pullRequestChangeList;
  }
  set pullRequestChangeList(changes: IPullRequestChangeDiff[]) {
    // 按照一定规则做排序，这样可以保持快捷键/文件树/quick-open的排序保持一致
    this._pullRequestChangeList = sortPathList(changes, (n) => n.newPath, Path.separator);
    this._onDidDiffsChangeEmitter.fire(null);
  }

  @computed
  get changeFileSize() {
    return this._pullRequestChangeList.length;
  }

  get viewedChangeFileSize() {
    return this._pullRequestChangeList.filter((change) => this.isViewedChange(change)).length;
  }

  @computed
  get isDiffOverview() {
    return this._pullRequestChangeList.some((diff) => diff.id !== undefined);
  }

  public getChangeByUri(uri: URI): IPullRequestChangeDiff | undefined {
    const newPath = uri.getParsedQuery().newPath;

    if (newPath) {
      return this.pullRequestChangeList.find((change) => change.newPath === newPath);
    }
  }

  /**
   * 推荐使用 isChangeFileURI 来判断
   * 这个方法目前主要是为了解决判断通过 lsif 打开引用文件时
   * 决定新打开的引用文件是否可编辑
   * 只有右侧 newPath 文件是可以编辑的
   * 是 change uri 且为非删除文件，则可编辑
   * @param path {URI}
   */
  public isPullRequestChange(path: string): boolean {
    let result = false;
    for (const prChange of this.pullRequestChangeList) {
      if (prChange.newPath === path) {
        // 非删除文件可编辑
        result = !prChange.deletedFile;
        break;
      }
    }

    return result;
  }

  private _onDidDiffsChangeEmitter = new Emitter<null>();
  readonly onDidDiffsChange: Event<null> = this._onDidDiffsChangeEmitter.event;
  /* diffs end */

  public getDiffById: IAntcodeCRProps['getDiffById'];
  private _onDidCommentsChangeEmitter = new Emitter<INoteIdToNote>();
  readonly onDidCommentsChange = this._onDidCommentsChangeEmitter.event;
  private _comments: IComment[] = [];
  public _annotations: IAnnotationData[] = [];
  private _onDidCommentsCreate = new Emitter<IComment[]>();
  readonly onDidCommentsCreate = this._onDidCommentsCreate.event;
  private _onDidCommentsDelete = new Emitter<number[]>();
  readonly onDidCommentsDelete = this._onDidCommentsDelete.event;

  private _onDidAnnotationsCreate = new Emitter<IAnnotationData[]>();
  readonly onDidAnnotationsCreate = this._onDidAnnotationsCreate.event;
  private _onDidAnnotationsDelete = new Emitter<number[]>();
  readonly onDidAnnotationsDelete = this._onDidAnnotationsDelete.event;

  get comments() {
    return this._comments;
  }

  get annotations() {
    return this._annotations || [];
  }

  set annotations(annotations: IAnnotationData[]) {
    const deleteAnnotations = differenceBy(
      this._annotations,
      annotations,
      (data) => data.annotation.id
    );
    const addAnnotations = differenceBy(
      annotations,
      this._annotations,
      (data) => data.annotation.id
    );

    if (deleteAnnotations.length || addAnnotations.length) {
      this._annotations = annotations;
    }

    if (deleteAnnotations.length) {
      this._onDidAnnotationsDelete.fire(deleteAnnotations.map((comment) => comment.annotation.id));
    }

    if (addAnnotations.length) {
      this._onDidAnnotationsCreate.fire(addAnnotations);
    }
  }

  /**
   * 将 Ant Code 的评论转到 Cloud IDE 组件上显示的评论
   * 过滤掉全局评论
   */
  set noteIdToNote(nodeIdToNote: INoteIdToNote) {
    const comments: IComment[] = [];
    for (const [key, value] of nodeIdToNote) {
      const lineCode = value.lineCode;
      const stDiff = value.stDiff;
      // 只展示有 lineCode 和 stDiff 的评论
      if (lineCode && stDiff) {
        comments.push({
          ...value,
          noteId: key,
          lineCode,
          stDiff,
        });
      }
    }
    const deleteComments = differenceBy(this._comments, comments, 'noteId');
    const addComments = differenceBy(comments, this._comments, 'noteId');
    if (deleteComments.length || addComments.length) {
      this._comments = comments;
    }

    if (deleteComments.length) {
      this._onDidCommentsDelete.fire(deleteComments.map((comment) => comment.noteId));
    }

    if (addComments.length) {
      this._onDidCommentsCreate.fire(addComments);
    }
  }

  // @ts-ignore
  public Menubar: React.FC = null;
  // @ts-ignore
  public DiscussionItem: React.FC = null;
  // @ts-ignore
  public Commenting: React.FC = null;
  // @ts-ignore
  public AnnotationEntry: React.FC = null;

  private _markFileAsRead: IAntcodeCRProps['markFileAsRead'];
  private _markFileAsUnread: IAntcodeCRProps['markFileAsUnread'];

  private _pullRequest: IAntcodeCRProps['pr'];
  get pullRequest(): IAntcodeCRProps['pr'] {
    return this._pullRequest;
  }
  set pullRequest(pr: IAntcodeCRProps['pr']) {
    // 只有 pr 和 pr#id 存在时，才去设值
    if (pr && pr.id) {
      this._pullRequest = pr;
    }
  }

  public projectPath: string;

  // components
  public PRMoreActionLinks: IAntcodeCRProps['PRMoreActionLinks'];

  public renderStart: number;

  public getFileContentByRef = (path: string, sha: string, charsetName?: string) => {
    // 比 antcode 那边大 10 倍
    return this.config.getFileContent(path, sha, 2500000, charsetName);
  };

  public lsifService: IAntcodeCRProps['lsifService'];

  private _isFullscreen: boolean;
  get isFullscreen(): boolean {
    return this._isFullscreen;
  }
  set isFullscreen(value: boolean) {
    this._isFullscreen = value;
    this._onDidFullscreenChangeEmitter.fire(value);
  }

  private _onDidFullscreenChangeEmitter = new Emitter<boolean>();
  readonly onDidFullscreenChange: Event<boolean> = this._onDidFullscreenChangeEmitter.event;

  public get projectMeta() {
    return {
      projectId: this.projectPath,
      prId: this.pullRequest?.iid,
      pullRequestId: this.pullRequest?.id,
    };
  }

  constructor(@Optional() private config: IAntcodeCRProps) {
    this.addLineNum = config.addLineNum;
    this.deleteLineNum = config.deleteLineNum;
    this.leftRef = config.prevSha;
    this.rightRef = config.nextSha;
    this.latestCommitSha = config.latestCommitSha;
    this.pullRequestChangeList = config.diffs as IPullRequestChangeDiff[];

    this.projectId = config.projectId;
    this.projectPath = config.projectPath;

    // @ts-ignore
    this.Menubar = config.Menubar;
    // @ts-ignore
    this.annotations = config.annotations;
    this.noteIdToNote = config.noteIdToNote;
    this.DiscussionItem = config.DiscussionItem;
    this.Commenting = config.Commenting;
    this.AnnotationEntry = config.AnnotationEntry;

    this.getDiffById = config.getDiffById;
    this._markFileAsRead = config.markFileAsRead;
    this._markFileAsUnread = config.markFileAsUnread;

    this.user = config.user;
    this.setWorkIdInMonitor(config.user);

    this.pullRequest = config.pr;

    // 默认为 utf-8
    this.encoding = (config.defaultEncoding as AntcodeEncodingType) || antcodeEncodingOpts[0].value;

    // components
    this.PRMoreActionLinks = config.PRMoreActionLinks;

    this.renderStart = config.renderStart;

    this.lsifService = config.lsifService;

    this.isFullscreen = config.isFullscreen;
  }

  /**
   * @desc update 初始配置，由于 props 传递导致的各种闭包问题，props 传递的属性应该实时更新到 config 中
   * TODO: 后续需进一步改造 props 和 antcodeService 的数据联动问题
   */
  updateConfig(newConfig: Partial<IAntcodeCRProps>) {
    Object.assign(this.config, newConfig);
  }

  /**
   * antcode 中 encoding 使用 useEffect 更新，会存在时间差，具体取决于 react 内部 scheduler 算法
   * 因此需等待 props 的 encoding 变化才 fire，不能内部 encoding 变化就 fire
   * 否则 getFileContent 取值会有问题
   */
  public fireEncodingChange(v: AntcodeEncodingType) {
    this._onDidEncodingChangeEmitter.fire(v);
  }

  public didViewChangeEmitter = new Emitter<string>();
  public onDidViewChange = this.didViewChangeEmitter.event;

  public isViewedChange(change: IPullRequestChangeDiff) {
    return this.config.getFileReadStatus(change.newPath);
  }

  public async toggleFileViewed(uri: URI) {
    const change = this.getChangeByUri(uri);
    if (!change) {
      return;
    }

    const markAsRead = !this.isViewedChange(change);
    const newPath = uri.getParsedQuery().newPath;
    try {
      await (markAsRead ? this._markFileAsRead(newPath) : this._markFileAsUnread(newPath));
    } catch (e) {
      console.error(e);
    }
  }

  // 提交文件
  public commitFiles(
    fileList: Array<Pick<FileAction, 'content' | 'filePath'>>,
    meta: Omit<FileActionHeader, 'authorEmail' | 'authorName'>
  ): ReturnType<IAntcodeCRProps['bulkChangeFiles']> {
    const actions = fileList.map((action) => ({
      actionType: FileActionType.update,
      encoding: FileActionEncoding.text,
      content: action.content,
      filePath: action.filePath,
    }));
    return this.config.bulkChangeFiles(actions, {
      ...meta,
      authorEmail: this.user.email,
      // FIXME: 使用 username or name
      authorName: this.user.name,
    });
  }

  public async getLanguages(): Promise<string[]> {
    return await this.config.getLanguages();
  }

  private setWorkIdInMonitor(user: IAntcodeCRProps['user']) {
    if (user.externUid) {
      setUserWorkId(user.externUid);
    }
  }
}
