import { URI, BasicEvent } from '@opensumi/ide-core-common';
import { Diff } from './antcode';
import { FileOpenMethod } from './types';

/**
 * 分支切换
 */
export class BranchChangeEvent extends BasicEvent<string> {}

/**
 * 打开对应的 diff 编辑器
 */
export class OpenDiffEditorEvent extends BasicEvent<{
  /**
   * 打开的文件 URI
   */
  uri: URI;
  /**
   * 打开文件的方式, 默认可不填写
   */
  channel?: FileOpenMethod;
}> {}

/**
 * 展开某行所有代码
 */
export class ShowAllCodeEvent extends BasicEvent<URI> {}

/**
 * 初始化完毕打开默认 Diff 视图
 */
export class OpenDefaultUriEvent extends BasicEvent<void> {}

/**
 * 动态获取 AntCode Diff 内容
 */
export class DiffChangeEvent extends BasicEvent<Diff> {}
