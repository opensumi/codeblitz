import { Injector } from '@opensumi/di';
import { IPreferences } from '@opensumi/ide-core-browser';
import { IAppConfig, getDefaultAppConfig } from '@alipay/alex';

import { renderApp } from './render-app';

// 引入公共样式文件
import '@opensumi/ide-core-browser/lib/style/entry.less';

import { layoutConfig, LayoutComponent } from './config/layout';
import { modules } from './config/module';

export default function render(
  injector: Injector,
  workspaceDir: string,
  customRenderer,
  options?: Partial<IAppConfig>,
  defaultPreferences?: IPreferences
) {
  renderApp(
    {
      modules,
      layoutConfig,
      layoutComponent: LayoutComponent,
      useCdnIcon: true,
      noExtHost: true,
      defaultPreferences: {
        'general.theme': 'alipay-geek-light',
        'general.icon': 'vsicons-slim',
        'application.confirmExit': process.env.NODE_ENV === 'production' ? 'ifRequired' : 'never',
        'editor.quickSuggestionsDelay': 100,
        'editor.quickSuggestionsMaxCount': 50,
        'editor.fontSize': 13,
        'editor.wordWrap': 'off',
        'editor.guides.bracketPairs': false,
        'diffEditor.renderSideBySide': true,
        'diffEditor.renderIndicators': false,
        'lsif.enable': true,
        'lsif.documentScheme': 'git',
        'workbench.colorCustomizations': {
          'activityBar.background': '#FFF',
        },
        'editor.scrollbar.alwaysConsumeMouseWheel': false,
        ...defaultPreferences,
      },
      workspaceDir,
      iconStyleSheets: [
        {
          iconMap: {
            alert: 'alert',
            'file-expand': 'file-expand',
            'ignore-space': 'ignore-space',
            // comment-add/comment-fill
            message: 'comment-add',
            totop: 'expandup',
            'colum-height': 'colum-height',
            fold: 'fold',
            check: 'check',
          },
          prefix: 'acr-fe acr-fe-',
          cssPath: '//at.alicdn.com/t/font_2016955_u19bhtcu1rc.css',
        },
      ],
      allowSetDocumentTitleFollowWorkspaceDir: false,
      ...(options || {}),
    },
    injector,
    customRenderer
  );
}
