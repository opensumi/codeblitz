import {
  IDiskFileProvider as _IDiskFileProvider,
  IFileService as _IFileService,
} from '@ali/ide-file-service/lib/common';

export { DiskFileServicePath, FileServicePath } from '@ali/ide-file-service/lib/common';

export const IDiskFileProvider = Symbol('IDiskFileProvider');

export interface IDiskFileProvider extends _IDiskFileProvider {}

export const IFileService = Symbol('IFileService');

export interface IFileService extends _IFileService {}
