import type { IFileSearchService as _IFileSearchService } from '@opensumi/ide-file-search/lib/common';

export interface IFileSearchService extends _IFileSearchService {}

export const IFileSearchService = Symbol('FileSearchService');

export const FileSearchServicePath = 'FileSearchServicePath';
