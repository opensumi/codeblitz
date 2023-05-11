// 被 SQLGenerics 共享的数据都存储在这里

import { IHotWords } from '../types';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

const visitedTable: any[] = [];

const historyWords = {
  /** 历史访问热词 */
  HotWords: [] as IHotWords[],
  EditingWord: {
    line: 0,
    offset: 0,
  },
};

const prevSuggestions = {
  syncItems: [] as monaco.languages.CompletionItem[],
  asyncItems: []  as monaco.languages.CompletionItem[],
};

const SQLEditorModel = {
  visitedTable,
  historyWords,
  prevSuggestions,
};

export default SQLEditorModel;
