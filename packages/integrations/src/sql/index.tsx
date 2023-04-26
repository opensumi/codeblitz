import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, SlotLocation } from '@alipay/alex';
import * as Alex from '@alipay/alex';
// import '@alipay/alex/languages/sql';
import { isFilesystemReady } from '@alipay/alex-core';
import { CompletionItemKind, SqlServiceModule, supportLanguage } from '@alipay/alex-sql-service';
import dtSql from '@alipay/alex/extensions/alex.dt-sql';

(window as any).alex = Alex;

isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const layoutConfig = {
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
};

const defaultContent = `SELECT * FROM table`;

const App = () => (
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
    }}
    appConfig={{
      plugins: [],
      modules: [
        SqlServiceModule.Config({
          onValidation: (ast: any, markers: any) => {
            console.log(ast, markers);
            // const filterMarkers = markers.filter((item, index) => {
            //   if (item.message == 'SEMICOLON expected.') {
            //     const markerText = editorIns.current.editor.getModel().getValueInRange({
            //       startLineNumber: item.startLineNumber,
            //       startColumn: item.startColumn,
            //       endLineNumber: item.endLineNumber,
            //       endColumn: item.endColumn,
            //     });
            //     if (!['by', 'from'].includes(markerText)) {
            //       return true;
            //     }
            //   }
            // });
            // return filterMarkers;
            return [];
          },
          onSuggestTables: (keyword, options) => {
            console.log(keyword, options);
            return Promise.resolve([
              {
                label: 'sample_one_table1',
                type: 'SAMPLE_TYPE_ONE',
                insertText: 'LD.sample_one_table1',
                kind: CompletionItemKind.Method,
                sortText: 'a',
              },
            ]);
          },
          options: {
            value: defaultContent,
            language: supportLanguage.ODPSSQL,
          },
          onChange: (value) => {
            console.log(value);
          },
          // completionTypes: {
          //   KEYWORD: {
          //     text: '关键词',
          //     kind: CompletionItemKind.Keyword,
          //   },
          //   CUSTOM: {
          //     text: '手动配置关键词',
          //     kind: CompletionItemKind.Keyword,
          //   },
          // },
        }),
      ],
      extensionMetadata: [dtSql],
      workspaceDir: `sql-service`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'opensumi-light',
      },
    }}
    runtimeConfig={{
      biz: 'sql-service',
      scenario: 'ALEX_TEST',
      defaultOpenFile: 'test.sql',
      // unregisterActivityBarExtra: true,
      hideLeftTabBar: true,
      workspace: {
        filesystem: {
          fs: 'FileIndexSystem',
          options: {
            // 初始全量文件索引
            requestFileIndex() {
              return Promise.resolve({
                'main.html': '<div id="root"></div>',
                'main.css': 'body {}',
                'main.js': 'console.log("main")',
                'test.sql': 'SELECT * FROM table',
              });
            },
          },
        },
      },
    }}
  />
);

let key = 0;
const render = () => ReactDOM.render(<App key={key++} />, document.getElementById('main'));
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy ? ReactDOM.render(<div>destroyed</div>, document.getElementById('main')) : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
  }
}
