import { Keybinding } from '@opensumi/ide-core-browser';
import { IReporter } from '@opensumi/ide-core-common';
import { FileSystemConfiguration, FileSystemInstance } from '../server/node';

export { AppConfig } from '@opensumi/ide-core-browser';

export type RootFS = FileSystemInstance<'MountableFileSystem'>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}

export const RuntimeConfig = Symbol('RuntimeConfig');

/**
 * 运行时相关配置
 * 同时可作为应用的全局配置，可通过类型融合来扩展字段。(https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 */
export interface RuntimeConfig {
  /*
   * 业务标识，用于内部埋点
   */
  biz: string;

  /**
   * 场景标识，目前用于 indexedDB store name 标识，暂不强制
   * 不填表示为默认场景，此时同一域名会共享 indexedDB
   * 如果指定为 null，表示不作为一个场景，此时不使用 indexedDB，也即不缓存工作空间及全局偏好设置等数据
   */
  scenario?: string | null;
  /** 工作空间配置 */
  workspace?: {
    /**
     * 文件系统配置
     */
    filesystem: FileSystemConfiguration;
    /**
     * 文档保存事件
     * @param data.filepath 文档相对工作空间路径
     * @param data.content 文档内容
     */
    onDidSaveTextDocument?: (data: { filepath: string; content: string }) => void;
    /**
     * 文档更改事件
     * @param data.filepath 文档相对工作空间路径
     * @param data.content 文档内容
     */
    onDidChangeTextDocument?: (data: { filepath: string; content: string }) => void;
    /**
     * 文件创建事件
     * @param files 相对工作空间文件路径
     */
    onDidCreateFiles?: (files: string[]) => void;
    /**
     * 文件删除事件
     * @param files 相对工作空间文件路径
     */
    onDidDeleteFiles?: (files: string[]) => void;
    /**
     * 文件变更事件
     * @param data.filepath 相对工作空间文件路径
     * @param data.content 文件内容
     */
    onDidChangeFiles?: (data: { filepath: string; content: string }[]) => void;
  };
  /** 默认打开的文件，多个文件时，会展示最右边的文件 */
  defaultOpenFile?: string | string[];
  /** 禁止文件树更改，此时无法新增、删除、重命名文件 */
  disableModifyFileTree?: boolean;
  /** 禁止文件树，删除、重命名文件 待文件系统完善后加入删除重命名功能 */
  scmFileTree?: boolean;
  /** 注销左下角 bar */
  unregisterActivityBarExtra?: boolean;
  /** 隐藏左侧 tabbar */
  hideLeftTabBar?: boolean;
  /**
   * 启动时打开的 editor
   * none 不打开任何 editor
   * welcomePage 打开欢迎页
   * 后续考虑支持 'newUntitledFile', 'welcomePageInEmptyWorkbench', 'gettingStarted'
   * @default welcomePage
   */
  startupEditor?: 'none' | 'welcomePage' | 'readme';
  /**
   * 隐藏编辑器区 tab
   */
  hideEditorTab?: boolean;
  /**
   * 取消左侧选中行高亮
   */
  disableHighlightLine?: boolean;
  /**
   * 隐藏编辑器的面包屑导航
   */
  hideBreadcrumb?: boolean;
  /**
   * reporter 服务，可获取内部上报的埋点相关数据
   */
  reporter?: IReporter;
  /**
   * 配置需注销的快捷键
   */
  unregisterKeybindings?: string[];
  /**
   * 配置快捷键
   * 可以通过 plugin 注册对应 command 执行的命令
   * opensumi keybinding 
   * https://opensumi.com/zh/docs/integrate/universal-integrate-case/custom-keybinding
   */
  registerKeybindings?: Keybinding[];
  /**
   * 文本搜索相关的配置，用于开启了左侧搜索面板的配置选项
   */
  textSearch?: {
    /**
     * 搜索组件配置，默认均开启支持
     * true 代码支持，false 代表不支持，不支持时界面相关 UI 会被隐藏
     * 对于支持 local 的选项，代码支持本地过滤，开启此项配置代表本地会对返回的结果做进一步过滤
     */
    config?: {
      /**
       * 正则匹配
       */
      regexp?: Boolean;
      /**
       * 大小写匹配
       */
      caseSensitive?: SearchMode;
      /**
       * 单词匹配
       */
      wordMatch?: SearchMode;
      /**
       * 是否支持替换，对于只读系统该选项会自动设置为 false
       */
      replace?: Boolean;
      /**
       * 文件包含
       */
      include?: SearchMode;
      /**
       * 文件排除
       */
      exclude?: SearchMode;
    };

    /**
     * 提供给定文本模式匹配的结果
     * @param query 查询参数
     * @param options 搜索选项
     * @param progress 所有结果都必须调用的进度回调
     */
    provideResults(
      query: TextSearchQuery,
      options: TextSearchOptions,
      progress: Progress<TextSearchResult>
    ): ProviderResult<void>;
  };

  fileSearch?: {
    /**
     * 搜索模式配置
     */
    config?: {
      /**
       * 文件包含
       */
      include?: SearchMode;
      /**
       * 文件排除
       */
      exclude?: SearchMode;
    };
    /**
     * 提供匹配特定文件路径模式的一组文件
     * @param query 查询参数
     * @param options 搜索选项
     */
    provideResults(
      query: { pattern: string },
      options: FileSearchOptions
    ): ProviderResult<string[]>;
  };
  /**
   * 欢迎页自定义内容
   */
  WelcomePage?: React.FC;
  /**
   * 空白页自定义内容
   */
  EditorEmpty?: React.FC;
  /**
   * 当文件后缀名判断格式 不满足条件时，可通过此配置项进行自定义
   * 优先会从语法服务中获取类型
   * https://aone.alipay.com/v2/project/1158176/bug/100102353
   */
  resolveFileType?: (path: string) => 'image' | 'text' | 'video' | undefined;
}

export type SearchMode = Boolean | 'local';

export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

// search 相关的类型
export interface TextSearchQuery {
  /**
   * 搜索的文案
   */
  pattern: string;

  /**
   * `pattern` 是否应该被解释为正则表达式.
   */
  isRegExp?: boolean;

  /**
   * 搜索是否应该区分大小写
   */
  isCaseSensitive?: boolean;

  /**
   * 是否只搜索全词匹配。
   */
  isWordMatch?: boolean;
}

type GlobString = string;

interface SearchOptions {
  /**
   * 与 `includes` glob 模式匹配的文件应包含在搜索中
   */
  includes: GlobString[];
  /**
   * 与 `excludes` glob 模式匹配的文件应排除在搜索中
   */
  excludes: GlobString[];
}

export interface TextSearchOptions extends SearchOptions {
  /**
   * 要返回的最大结果数。
   */
  maxResults: number;
}

export interface Progress<T> {
  /**
   * 报告进度更新
   */
  report(value: T): void;
}

export type TextSearchResult = TextSearchMatch;

export interface TextSearchMatch {
  /**
   * 文件路径
   */
  path: string;

  /**
   * 行号
   */
  lineNumber: number;

  /**
   * 文本匹配的预览
   */
  preview: {
    /**
     * 匹配的文本行，或包含匹配项的匹配行的一部分。
     */
    text: string;

    /**
     * `text` 内与匹配文本对应的字符范围，索引从 0 开始
     */
    matches: [number, number][];
  };
}

export interface FileSearchOptions extends SearchOptions {
  /**
   * 要返回的最大结果数
   */
  maxResults?: number;
}
