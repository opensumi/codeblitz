import { Thenable } from '../types';

export interface DocumentModel {
  /**
   * 打开的文件路径
   */
  filepath?: string;
  /**
   * 文件路径变化事件，类型跳转时会从内部打开文件
   */
  onFilepathChange?: (filepath: string) => void;
  /**
   * 文件读取接口
   * @param {string} filepath 文件路径
   * @returns 文件数据
   */
  readFile(filepath: string): Uint8Array | Thenable<Uint8Array>;
  /**
   * 文件编码
   */
  encoding?: 'gbk' | 'utf8';
  /**
   * 展示文件行号，如果传入数组，则表示多行
   */
  lineNumber?: number | [number, number];
  /**
   * 行号变更事件
   */
  onLineNumberChange?: (num: number) => void;
}

export interface FSDocumentModel extends DocumentModel {
  type?: 'fs';
}

export interface CodeDocumentModel extends DocumentModel {
  /**
   * 文档类型，code 代码平台仓库类型
   */
  type: 'code';
  /**
   * tag or branch or commit
   */
  ref: string;
  /**
   * 仓库 group 或用户
   */
  owner: string;
  /**
   * 仓库名
   */
  name: string;
}

export interface EditorConfig {
  /**
   * 编辑器是否自适应内容区高度，此时会完全展开 editor，内部不再有滚动条
   * 代码行数过多时可能会有性能问题
   */
  stretchHeight?: boolean;
  /**
   * 禁用编辑器内搜索，此时会注销内部 ctrl/cmd + f 快捷键
   */
  disableEditorSearch?: boolean;
}

export interface EditorProps {
  /**
   * editor 组件专有配置
   */
  editorConfig?: EditorConfig;
  documentModel: FSDocumentModel | CodeDocumentModel;
}

export const isCodeDocumentModel = (
  model: EditorProps['documentModel']
): model is CodeDocumentModel => {
  return 'type' in model && model.type === 'code';
};
