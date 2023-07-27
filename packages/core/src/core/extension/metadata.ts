/**
 * 内置插件
 * TODO: 需要更好的管理方式
 */

import { IExtensionBasicMetadata } from '@codeblitzjs/ide-common';

export const IconSlim: IExtensionBasicMetadata = {
  extension: {
    publisher: 'alex-ext-public',
    name: 'vsicons-slim',
    version: '1.0.5',
  },
  packageJSON: {
    publisher: 'kaitian',
    name: 'vsicons-slim',
    version: '1.0.5',
    displayName: 'vsicons-slim',
    description: 'Icons for Visual Studio Code',
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
  webAssets: [],
  mode: 'public',
};

export const IDETheme: IExtensionBasicMetadata = {
  extension: {
    publisher: 'alex-ext-public',
    name: 'ide-dark-theme',
    version: '2.4.0',
  },
  packageJSON: {
    publisher: 'kaitian',
    name: 'ide-dark-theme',
    version: '2.4.0',
    displayName: 'IDE UI Theme',
    description: 'IDE UI Theme',
    contributes: {
      themes: [
        {
          id: 'opensumi-dark',
          label: 'OpenSumi Dark',
          uiTheme: 'vs-dark',
          path: './themes/dark/plus.json',
        },
        {
          id: 'opensumi-light',
          label: 'OpenSumi Light',
          uiTheme: 'vs',
          path: './themes/light/plus.json',
        },
      ],
    },
  },
  pkgNlsJSON: {},
  nlsList: [],
  extendConfig: {},
  webAssets: [],
  mode: 'public',
};
