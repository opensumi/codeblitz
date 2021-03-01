import { Injectable } from '@ali/common-di';
import {
  IContentSearchServer,
  ContentSearchOptions,
  ContentSearchResult,
  SEARCH_STATE,
  SendClientResult,
} from './base';
import { FCService } from '../../connection';

@Injectable()
export class ContentSearchService extends FCService implements IContentSearchServer {
  private searchId: number = new Date().getTime();

  async search(
    what: string,
    rootUris: string[],
    opts?: ContentSearchOptions,
    cb?: (data: any) => {}
  ): Promise<number> {
    this.searchId++;
    this.sendResultToClient([], this.searchId, SEARCH_STATE.done);
    return this.searchId;
  }

  cancel(searchId: number): Promise<void> {
    return Promise.resolve();
  }

  private sendResultToClient(
    data: ContentSearchResult[],
    id: number,
    searchState?: SEARCH_STATE,
    error?: string
  ) {
    if (this.client) {
      this.client.onSearchResult({
        data,
        id,
        searchState,
        error,
      } as SendClientResult);
    }
  }
}
