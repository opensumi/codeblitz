import { Injector } from '@ali/common-di';
import { IClientAppOpts, IPreferences } from '@ali/ide-core-browser';

import { renderApp } from './render-app';

// 引入公共样式文件
import '@ali/ide-core-browser/lib/style/entry.less';

import { layoutConfig, LayoutComponent } from './config/layout';
import { modules } from './config/module';

export default function render(
  injector: Injector,
  workspaceDir: string,
  customRenderer,
  options?: Partial<IClientAppOpts>,
  defaultPreferences?: IPreferences
) {
  renderApp(
    {
      modules,
      layoutConfig,
      layoutComponent: LayoutComponent,
      useCdnIcon: true,
      // noExtHost: true,
      // extWorkerHost: 'https://dev.g.alicdn.com/tao-ide/ide-lite/0.0.1/worker-host.js',
      defaultPreferences: {
        // 'general.theme': 'Default Dark+',
        // 'general.icon': 'vscode-icons',
        'application.confirmExit': process.env.NODE_ENV === 'production' ? 'ifRequired' : 'never',
        'editor.quickSuggestionsDelay': 100,
        'editor.quickSuggestionsMaxCount': 50,
        'editor.fontSize': 13,
        'editor.wordWrap': 'off',
        'diffEditor.renderSideBySide': true,
        'diffEditor.renderIndicators': false,
        'lsif.enable': true,
        'lsif.documentScheme': 'git',
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
