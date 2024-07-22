import { IExtensionProps } from '@opensumi/ide-core-common';

export const EXTENSION_SCHEME = 'extension';
export const enableExtensionsContainerId = 'extensions';
export const enableExtensionsTarbarHandlerId = 'extensions.enable';

export const IExtensionManagerService = Symbol('IExtensionManagerService');

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// IExtensionProps 属性为 readonly，改为 writeable
export type IExtension = Writeable<IExtensionProps> & {
  installed: boolean;
};

export const DEFAULT_ICON_URL = 'https://gw.alipayobjects.com/mdn/rms_d8fa74/afts/img/A*upJXQo96It8AAAAAAAAAAABkARQnAQ';

export interface BaseExtension {
  extensionId: string; // 插件市场 extensionId
  name: string;
  version: string;
  path: string;
  publisher: string;
  isBuiltin?: boolean;
}

export interface RawExtension extends BaseExtension {
  id: string; // publisher.name
  displayName: string;
  description: string;
  installed: boolean;
  icon: string;
  enable: boolean;
  isBuiltin: boolean;
  isDevelopment?: boolean;
  // 启用范围
  engines: {
    vscode: string;
    opensumi: string;
  };
}

// 插件详情页显示
export interface ExtensionDetail extends RawExtension {
  readme: string;
  changelog: string;
  license: string;
  categories: string;
  packageJSON: any;
  // 代码仓库
  repository: string;
  contributes: {
    [name: string]: any;
  };
}

export interface OpenExtensionOptions {
  publisher: string;
  name: string;
  preview: boolean;
  displayName?: string;
  version?: string;
  icon?: string;
}
