import { Event, IClientAppOpts, URI, Emitter } from '@opensumi/ide-core-browser';
import { IPluginConfig } from '@alipay/alex-plugin';
import { IExtensionBasicMetadata } from '@alipay/alex-shared';

import {
  IPullRequestChange,
  IPullRequestChangeList,
  Annotation,
  CheckSuite,
  Note,
  FileAction,
  FileActionHeader,
  FileActionResult,
} from '../../common/antcode';
import { User } from './interfaces/user';
import { PR } from './interfaces/pr';

export interface IPullRequestChangeDiff extends Omit<IPullRequestChange, 'diff'> {
  // 如果是 Diff 则没有 id
  id?: number;
  // 如果是 DiffOverview 则没有 diff
  diff?: string;
  markAsRead?: boolean;
  updatedAfterRead?: boolean;
}

export enum AntcodeEncodingType {
  gbk = 'gbk',
  utf8 = 'utf-8',
}

export interface IAnnotationData {
  annotation: Annotation;
  checkSuite: CheckSuite;
}

export interface IAntcodeCRProps {
  projectId: number; // 当前 repo 的 projectId
  projectPath: string; // 当前 repo 的 project path，目前主要给 lsif 使用

  addLineNum: number; // 当前 diff version 下的总新增行数
  deleteLineNum: number; // 当前 diff version 下的总删除行数
  prevSha: string;
  nextSha: string;
  latestCommitSha: string; // 最新 commit

  // encoding 相关选项
  defaultEncoding: string;
  encoding: AntcodeEncodingType;
  setEncoding: (val: AntcodeEncodingType) => void;

  diffs: IPullRequestChangeList;

  // 用户信息
  user: User;

  // PR 信息
  pr: PR;

  // 可能拿到的数据为空，需要兼容这种情况
  getFileContent(
    path: string,
    sha: string,
    maxSize?: number,
    charsetName?: string
  ): Promise<string | null>;
  getDiffById: (diffId: number) => Promise<IPullRequestChange>;
  // 评论相关
  lineToNoteIdSet: Map<string /* line code */, Set<number>>; // Set 可能为空

  // todo: 通过 flag 标记更新
  DiscussionItem: React.FC<{
    noteId: number;
  }>;
  AnnotationEntry: React.FC<IAnnotationData>;
  Commenting: React.FC<{
    onClose?: () => void; // 关闭新建组件时调用
    lineCode?: string;
    discussionId?: number; // 可不传
    path?: string; // new_path
    inputRef?: React.Ref<HTMLTextAreaElement>;
  }>;
  Menubar?: React.FC;
  extraContextProvider?: IClientAppOpts['extraContextProvider'];
  noteIdToNote: INoteIdToNote;
  noteUpdateFlag: any;
  markFileAsRead: (filePath: string) => Promise<{ markAsRead: boolean; updatedAfterRead: boolean }>;
  markFileAsUnread: (
    filePath: string
  ) => Promise<{ markAsRead: boolean; updatedAfterRead: boolean }>;

  // 全屏选项
  isFullscreen: boolean;

  // antcode 返回的语言需要做一次转换到 textmate-monaco-languages
  getLanguages: () => Promise<string[]>;

  // 批量提交代码，给 web-scm 使用
  bulkChangeFiles: (actions: FileAction[], header: FileActionHeader) => Promise<FileActionResult[]>;

  locale: string;

  annotations?: IAnnotationData[];

  // components
  PRMoreActionLinks: React.ComponentType<any>;

  getFileReadStatus(filePath: string): boolean;

  fileReadMarkChange$: {
    useSubscription: (callback: (filePath: string) => void) => void;
  };

  // TODO: 暴露和 alex 一样的配置？
  appConfig?: {
    staticServicePath?: string;
    // 支持 extension 和 plugin
    plugins?: IPluginConfig;
    extensionMetadata?: IExtensionBasicMetadata[];
  };
  noteIdToReplyIdSet: Map<number | string, Set<number | string>>;
}

export interface LsifLocation {
  line: number;
  character: number;
}

// antcode 数据
export type INoteIdToNote = Map<number, Note>;

/**
 * 纯前端场景评论数据
 * lineCode 和 stDiff 肯定存在
 */
export interface IComment extends Note {
  noteId: number;
}

export type TCommitFiles = (
  fileList: Array<Pick<FileAction, 'content' | 'filePath'>>,
  meta: Omit<FileActionHeader, 'authorEmail' | 'authorName'>
) => ReturnType<IAntcodeCRProps['bulkChangeFiles']>;

export const IAntcodeService = Symbol('IAntcodeService');

export interface IAntcodeService {
  /**
   * 用来划定 workspaceDir 的位置的唯一 key
   */
  projectId: number;

  /**
   * 当前 repo 的 project path，目前主要给 lsif 使用
   */
  projectPath: string;

  addLineNum: IAntcodeCRProps['addLineNum'];
  deleteLineNum: IAntcodeCRProps['deleteLineNum'];

  leftRef: IAntcodeCRProps['prevSha'];
  rightRef: IAntcodeCRProps['nextSha'];
  onDidRefChange: Event<null>;
  latestCommitSha: IAntcodeCRProps['latestCommitSha'];
  onDidLatestCommitShaChange: Event<null>;
  // 因为需要将 diff 字符串，所以将原有的 Diff 和 DiffOverview 合并为 IPullRequestChangeDiff
  // 如果没有 diff 字符串，会在打开的时候动态获取
  pullRequestChangeList: IPullRequestChangeDiff[];
  getChangeByUri(uri: URI): IPullRequestChangeDiff | undefined;

  /**
   * 推荐使用 isChangeFileURI 来判断
   * 这个方法目前主要是为了解决判断通过 lsif 打开引用文件时
   * 决定新打开的引用文件是否可编辑
   * 只有右侧 newPath 文件是可以编辑的
   * @param path {URI}
   */
  isPullRequestChange(path: string): boolean;

  onDidDiffsChange: Event<null>;

  // 可能拿到的数据为空，需要兼容这种情况
  getFileContentByRef(path: string, sha: string, charsetName?: string): Promise<string | null>;

  DiscussionItem: IAntcodeCRProps['DiscussionItem'];
  Commenting: IAntcodeCRProps['Commenting'];
  AnnotationEntry: IAntcodeCRProps['AnnotationEntry'];
  noteIdToNote: INoteIdToNote;
  comments: IComment[];
  onDidCommentsCreate: Event<IComment[]>;
  onDidCommentsDelete: Event<number[]>;
  annotations: IAntcodeCRProps['annotations'];
  onDidAnnotationsCreate: Event<IAntcodeCRProps['annotations']>;
  onDidAnnotationsDelete: Event<number[]>;
  getDiffById: IAntcodeCRProps['getDiffById'];
  toggleFileViewed: (uri: URI) => Promise<void>;
  isViewedChange: (change: IPullRequestChangeDiff) => boolean;
  changeFileSize: number;
  viewedChangeFileSize: number;
  // 判断当前 List 是否是 diffOverview
  // 只有 diffOverview 才有 id、markAsRead
  isDiffOverview: boolean;
  getLanguages: IAntcodeCRProps['getLanguages'];

  // 包装过的 commitFiles 方法
  commitFiles: TCommitFiles;

  user: IAntcodeCRProps['user'];

  pullRequest: IAntcodeCRProps['pr'];

  encoding: IAntcodeCRProps['encoding'];
  setEncoding: IAntcodeCRProps['setEncoding'];
  onDidEncodingChange: Event<AntcodeEncodingType>;

  // 全屏模式
  isFullscreen: boolean;
  onDidFullscreenChange: Event<boolean>;

  // components
  Menubar?: IAntcodeCRProps['Menubar'];
  PRMoreActionLinks: IAntcodeCRProps['PRMoreActionLinks'];

  // others
  renderStart: number;

  didViewChangeEmitter: Emitter<string>;
  onDidViewChange: Event<string>;

  updateConfig(config: Partial<IAntcodeCRProps>): void;
  fireEncodingChange(v: AntcodeEncodingType): void;

  projectMeta: {
    projectId: string | number;
    prId: number;
    pullRequestId: number;
  };
  noteIdToReplyIdSet: IAntcodeCRProps['noteIdToReplyIdSet'];
}
