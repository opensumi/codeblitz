// 被 SQLGenerics 共享的数据都存储在这里

import { IHotWords } from '../types';

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
  syncItems: [],
  asyncItems: [],
};

const SQLEditorModel = {
  visitedTable,
  historyWords,
  prevSuggestions,
};

export default SQLEditorModel;
