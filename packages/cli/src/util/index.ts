import { IExtensionId } from '../extension/type';

export const formatExtension = (ext: IExtensionId) =>
  `${ext.publisher}.${ext.name}${ext.version ? `@${ext.version}` : ''}`;
