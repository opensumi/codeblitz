import type { IContentSearchServer as _IContentSearchServer } from '@opensumi/ide-search/lib/common';

export {
  ContentSearchOptions,
  ContentSearchResult,
  SEARCH_STATE,
  SendClientResult,
} from '@opensumi/ide-search/lib/common';

export const IContentSearchServer = Symbol('IContentSearchServer');

export interface IContentSearchServer extends _IContentSearchServer {}

export const ContentSearchServerPath = 'ContentSearchServerPath';
