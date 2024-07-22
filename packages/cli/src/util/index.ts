import { IExtensionDesc } from '../extension/type';

export const formatExtension = (ext: IExtensionDesc) =>
  `${ext.publisher}.${ext.name}${ext.version ? `@${ext.version}` : ''}`;

export const stripSourceMappingURL = (content: string) => content.replace(/\n\/\/# sourceMappingURL=(.*)$/gm, '');
