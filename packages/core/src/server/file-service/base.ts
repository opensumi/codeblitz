import {
  IDiskFileProvider as _IDiskFileProvider,
  IFileService as _IFileService,
} from '@opensumi/ide-file-service/lib/common';

export { DiskFileServicePath, FileServicePath } from '@opensumi/ide-file-service/lib/common';

export const IDiskFileProvider = Symbol('IDiskFileProvider');

export interface IDiskFileProvider extends _IDiskFileProvider {}

export const IFileService = Symbol('IFileService');

export interface IFileService extends _IFileService {}

export interface EncodingInfo {
  id: string; // encoding identifier
  labelLong: string; // long label name
  labelShort: string; // short label name
}
