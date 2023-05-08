import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, SlotLocation } from '@alipay/alex';
import * as Alex from '@alipay/alex';
import '@alipay/alex/languages/sql';
import { isFilesystemReady } from '@alipay/alex-core';
import { CompletionItemKind, SqlServiceModule, supportLanguage, setMonacoEnvironment } from '@alipay/alex-sql-service';
// import dtSql from '@alipay/alex/extensions/alex.dt-sql';
// import css from '@alipay/alex/extensions/alex-ext-public.css-language-features-worker';
// import html from '@alipay/alex/extensions/alex-ext-public.html-language-features-worker';
// import json from '@alipay/alex/extensions/alex-ext-public.json-language-features-worker';
// import markdown from '@alipay/alex/extensions/alex-ext-public.markdown-language-features-worker';
// import typescript from '@alipay/alex/extensions/alex-ext-public.typescript-language-features-worker';

(window as any).alex = Alex;
setMonacoEnvironment()
isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const layoutConfig = {
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer'],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
};

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
            // console.log(ast, markers);
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
            return markers;
          },
          lowerCaseComplete: true,
          marks:[
            {
              message: "测试效果",
              startRow: 1,
              startCol: 1
            }
          ],
          // @ts-ignore
          formatRules: [{
            // regex: /\w/g,
            // value: 'select',
          }],
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
          onSuggestFields: (prefix, options) =>{
            return Promise.resolve([
              {
                label: "age",
                type: "SAMPLE_TYPE_ONE",
                insertText: "age",
                kind: CompletionItemKind.Field,
                sortText: "b"
              },
              {
                label: "banana",
                type: "SAMPLE_TYPE_ONE",
                insertText: "banana",
                kind: CompletionItemKind.Field,
                sortText: "b"
              },
              {
                label: "sample_one_table1",
                type: "SAMPLE_TYPE_ONE",
                insertText: "id_test",
                kind: CompletionItemKind.Field,
                sortText: "b"
              }
            ])
          },
          options: {
            // value: defaultContent,
            language: supportLanguage.ODPSSQL,
          },
          sorter: (type) => {
            switch (type) {
              case 'TABLEALIAS':
              case 'TABLE':
                return 'c';
              case 'FIELD':
              case 'FIELDALIAS':
                return 'd';
              case 'KEYWORD':
              case 'CONSTS':
                return 'e';
              case 'FUNCTION':
                return 'f';
              default:
                return 'g'
            }
          },
          // onChange: (value) => {
          //   console.log(value);
          // },
          completionTypes: {
            KEYWORD: {
              text: "关键词",
              kind: CompletionItemKind.Keyword
            },
            CONSTS: {
              text: "常量",
              kind: CompletionItemKind.Snippet
            },
            FUNCTION: {
              text: "函数",
              kind: CompletionItemKind.Function
            },
            TABLE: {
              text: "表名",
              kind: CompletionItemKind.Method
            },
            TABLEALIAS: {
              text: "表别名",
              kind: CompletionItemKind.Method
            },
            SNIPPET: {
              text: "代码块",
              kind: CompletionItemKind.Snippet
            },
            FIELD: {
              text: "表字段",
              kind: CompletionItemKind.Field
            },
            FIELDALIAS: {
              text: "表字段别名",
              kind: CompletionItemKind.Field
            }
          },
        }),
      ],
      extensionMetadata: [
        // dtSql,
        // css,
        // html,
        // json,
        // markdown,
        // typescript

      ],
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
                'test.sql': 'select * from',
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
