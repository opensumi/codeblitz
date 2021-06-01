/**
 * 内置插件
 * TODO: 需要更好的管理方式
 */

import { IExtensionBasicMetadata } from '@alipay/alex-shared';

export const IconSlim: IExtensionBasicMetadata = {
  extension: {
    publisher: 'kaitian',
    name: 'vsicons-slim',
    version: '1.0.5',
  },
  packageJSON: {
    name: 'vsicons-slim',
    activationEvents: ['*'],
    contributes: {
      iconThemes: [
        {
          id: 'vsicons-slim',
          label: 'VSCode Icons Slim',
          path: 'vsicons-slim.json',
        },
      ],
    },
  },
  pkgNlsJSON: {},
  nlsList: [],
  extendConfig: {},
};

export const IDETheme: IExtensionBasicMetadata = {
  extension: {
    publisher: 'kaitian',
    name: 'ide-dark-theme',
    version: '2.4.0',
  },
  packageJSON: {
    name: 'ide-dark-theme',
    contributes: {
      themes: [
        {
          id: 'ide-dark',
          label: 'IDE Dark',
          uiTheme: 'vs-dark',
          path: './themes/dark/plus.json',
        },
        {
          id: 'ide-light',
          label: 'IDE Light',
          uiTheme: 'vs',
          path: './themes/light/plus.json',
        },
      ],
    },
  },
  pkgNlsJSON: {},
  nlsList: [],
  extendConfig: {},
};

export const GeekTheme: IExtensionBasicMetadata = {
  extension: {
    publisher: 'cloud-ide',
    name: 'alipay-geek-theme',
    version: '1.8.0',
  },
  packageJSON: {
    name: '@alipay/geek-theme',
    contributes: {
      themes: [
        {
          id: 'alipay-geek-dark',
          label: 'IDE Dark',
          uiTheme: 'vs-dark',
          path: './themes/dark/plus.json',
        },
        {
          id: 'alipay-geek-light',
          label: 'IDE Light',
          uiTheme: 'vs',
          path: './themes/light/plus.json',
        },
      ],
    },
  },
  pkgNlsJSON: {},
  nlsList: [],
  extendConfig: {},
};
