import { AppRenderer, SlotLocation } from '@alipay/alex';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '@alipay/alex/languages/sql';
import {
  CompletionItemKind,
  SqlServiceModule,
  supportLanguage,
  setMonacoEnvironment,
} from '@alipay/alex-sql-service';
import * as SQLPlugin from './sql.plugin';
import { Popover, Radio } from 'antd';
import 'antd/dist/antd.css';
import odcTheme from '@alipay/alex/extensions/alex-ext-public.odc-theme';
import { Button } from '@opensumi/ide-components';
import { IEditor } from '@opensumi/ide-editor';

import { KeepAlive } from './KeepAlive';
setMonacoEnvironment('http://127.0.0.1:8080/packages/toolkit/dist/odps-worker.67dbbf44.js');


let tableID = 1;

const tableMap = {
  1: [],
  2: []
}
export const SQLRender = (props) => {


  const id = useRef(props.id)

  const suggestTables = useRef(tableMap);

  useEffect(() => {
    id.current = props.id;
  }, [props.id])


  function changeTables() {
    tableID++;
    suggestTables.current[id.current] = suggestTables.current[id.current].concat([
      {
        label: {
          label: `sample_one_table_${tableID}`,
          description: 'sample_one_table',
        },
        type: 'SAMPLE_TYPE_ONE',
        insertText: 'LD.sample_one_table1',
        kind: CompletionItemKind.Method,
        sortText: 'a',
      } ,
    ])
  }
  const PluginID = props.id
  const layoutConfig = {
    [SlotLocation.main]: {
      modules: ['@opensumi/ide-editor'],
    },
  };

  const [editor, setEditor] = useState(true);
  
  return (
    <div style={{ height: '200px', display: 'flex' }}>
      <Button style={{ zIndex: '100' }} onClick={() => setEditor(false)}>销毁editor</Button>
      <Button onClick={() => changeTables()}>change suggest Tables</Button>

      {editor && (
        <div style={{ border: '2px solid red', zIndex: '10', width: '100%'}}>
          <KeepAlive visible={props.visible}>
            <AppRenderer
              key={PluginID}
              appConfig={{
                plugins: [SQLPlugin],
                modules: [
                  SqlServiceModule.Config({
                    onValidation: (ast: any, markers: any) => {
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
                    // onWokerLoad: ({language, loadTime}) => {
                    //   // worker 加载完成
                    //   console.log(language, loadTime);
                    // },
                    lowerCaseComplete: true,
                    formatRules: [
                      // @ts-ignore
                      {
                        // regex: /\w/g,
                        // value: 'select',
                      },
                    ],
                    onSuggestTables: (keyword, options) => {
                      console.log('suggest', keyword, options, suggestTables, id);
                      return suggestTables.current[id.current];
                    },
                    onSuggestFields: async(prefix, options) => {
                      console.log('fields', prefix, options);

                      return new Promise((resolve) => {
                        setTimeout(() => {
                          resolve([
                            {
                              label: 'age',
                              // type: 'SAMPLE_TYPE_ONE',
                              insertText: 'age',
                              kind: CompletionItemKind.Field,
                              sortText: 'b',
                            },
                            {
                              label: 'banana',
                              // type: 'SAMPLE_TYPE_ONE',
                              insertText: 'banana',
                              kind: CompletionItemKind.Field,
                              sortText: 'b',
                            },
                            {
                              label: 'sample_one_table1',
                              // type: 'SAMPLE_TYPE_ONE',
                              insertText: 'id_test',
                              kind: CompletionItemKind.Field,
                              sortText: 'b',
                            },
                          ])
                        },1000)
                      })
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
                      disableAsyncItemCache: true,
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
                      // console.log('change',data);
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
                extensionMetadata: [odcTheme],
                workspaceDir: `sql-service`,
                layoutConfig,
                defaultPreferences: {
                  'general.theme': 'odc-light',
                  'application.confirmExit': 'never',
                  'editor.autoSave': 'afterDelay',
                  'editor.guides.bracketPairs': false,
                  'editor.minimap': false,
                  'editor.autoSaveDelay': 1000,
                  'editor.fixedOverflowWidgets': true, // widget editor 默认改为 fixed
                  'files.encoding': 'utf8', // 默认编码
                  'editor.fontSize': 12,
                },
              }}
              runtimeConfig={{
                biz: 'sql-service',
                // hideEditorTab: true,
                scenario: 'ALEX_TEST',
                // defaultOpenFile: 'test.sql',
                hideBreadcrumb: true,
                hideLeftTabBar: true,
                registerKeybindings: [
                  {
                    command: 'editor.action.formatDocument',
                    keybinding: 'f8',
                  },
                ],
                workspace: {
                  filesystem: {
                    fs: 'FileIndexSystem',
                    options: {
                      // 初始全量文件索引
                      requestFileIndex() {
                        return Promise.resolve({
                          'test_uri1': { 'test.sql': 'select * from 111' },
                          'test_uri2': { 'test.sql': 'select * from 222' },
                        });
                      },
                    },
                  },
                },
              }}
            />
        </KeepAlive>
        </div>
      )}
    </div>
  );
};
