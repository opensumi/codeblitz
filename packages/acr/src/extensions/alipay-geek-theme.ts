export const alipayGeekThemeExt = {
  pkgJSON: {
    name: 'alipay-geek-theme',
    publisher: 'cloud-ide',
    version: '1.8.2',
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
};
