import type { IContentSearchServer as _IContentSearchServer } from '@ali/ide-search/lib/common';

export {
  ContentSearchOptions,
  ContentSearchResult,
  SEARCH_STATE,
  SendClientResult,
} from '@ali/ide-search/lib/common';

export const IContentSearchServer = Symbol('ContentSearchService');

export interface IContentSearchServer extends _IContentSearchServer {}

export const ContentSearchServerPath = 'ContentSearchServerPath';
