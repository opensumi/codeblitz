import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, SlotLocation } from '@alipay/alex';
import * as Alex from '@alipay/alex';
import '@alipay/alex/languages/sql';
import { isFilesystemReady } from '@alipay/alex-core';
import {
  CompletionItemKind,
  SqlServiceModule,
  supportLanguage,
  setMonacoEnvironment,
} from '@alipay/alex-sql-service';
import { Button } from '@opensumi/ide-components';
import * as SQLPlugin from './sql.plugin';



setMonacoEnvironment();


const layoutConfig = {
  // [SlotLocation.action]: {
  //   modules: [''],
  // },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
};

function format() {
  
  // if(SQLPlugin.)


}




const App = () => (
  <div style={{ height: '100%' }}>
    <div style={{margin: '20px'}}>
      <Button onClick={()=> format()}>格式化</Button>
      <Button>添加行</Button>
      <Button>更新preference</Button>
      <Button>打开文件</Button>
    </div>
    <AppRenderer
      onLoad={(app) => {
        window.app = app;
      }}
      appConfig={{
        plugins: [SQLPlugin],
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
            marks: [
              {
                message: '测试效果',
                startRow: 1,
                startCol: 1,
              },
            ],
            formatRules: [
              // @ts-ignore
              {
                // regex: /\w/g,
                // value: 'select',
              },
            ],
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
            onSuggestFields: (prefix, options) => {
              return Promise.resolve([
                {
                  label: 'age',
                  type: 'SAMPLE_TYPE_ONE',
                  insertText: 'age',
                  kind: CompletionItemKind.Field,
                  sortText: 'b',
                },
                {
                  label: 'banana',
                  type: 'SAMPLE_TYPE_ONE',
                  insertText: 'banana',
                  kind: CompletionItemKind.Field,
                  sortText: 'b',
                },
                {
                  label: 'sample_one_table1',
                  type: 'SAMPLE_TYPE_ONE',
                  insertText: 'id_test',
                  kind: CompletionItemKind.Field,
                  sortText: 'b',
                },
              ]);
            },
            options: {
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
                  return 'g';
              }
            },
            onChange: (data) => {
              console.log(data);
            },
            completionTypes: {
              KEYWORD: {
                text: '关键词',
                kind: CompletionItemKind.Keyword,
              },
              CONSTS: {
                text: '常量',
                kind: CompletionItemKind.Snippet,
              },
              FUNCTION: {
                text: '函数',
                kind: CompletionItemKind.Function,
              },
              TABLE: {
                text: '表名',
                kind: CompletionItemKind.Method,
              },
              TABLEALIAS: {
                text: '表别名',
                kind: CompletionItemKind.Method,
              },
              SNIPPET: {
                text: '代码块',
                kind: CompletionItemKind.Snippet,
              },
              FIELD: {
                text: '表字段',
                kind: CompletionItemKind.Field,
              },
              FIELDALIAS: {
                text: '表字段别名',
                kind: CompletionItemKind.Field,
              },
            },
          }),
        ],
        extensionMetadata: [],
        workspaceDir: `sql-service`,
        layoutConfig,
        defaultPreferences: {
          'general.theme': 'opensumi-light',
          'application.confirmExit': 'never',
          'editor.autoSave': 'afterDelay',
          'editor.guides.bracketPairs': false,
          'editor.minimap': false,
          'editor.autoSaveDelay': 500,
          'editor.fixedOverflowWidgets': true, // widget editor 默认改为 fixed
        },
      }}
      runtimeConfig={{
        biz: 'sql-service',
        hideEditorTab: true,
        scenario: 'ALEX_TEST',
        defaultOpenFile: 'test.sql',
        hideBreadcrumb: true,
        hideLeftTabBar: true,
        workspace: {
          filesystem: {
            fs: 'FileIndexSystem',
            options: {
              // 初始全量文件索引
              requestFileIndex() {
                return Promise.resolve({
                  'test.sql': 'select * from',
                });
              },
            },
          },
        },
      }}
    />
  </div>
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
