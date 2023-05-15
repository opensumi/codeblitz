import { AppRenderer2, SlotLocation } from '@alipay/alex';
import React, { useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '@alipay/alex/languages/sql';
import {
  CompletionItemKind,
  SqlServiceModule,
  supportLanguage,
  setMonacoEnvironment,
} from '@alipay/alex-sql-service';
import SqlPlugin from './sql.plugin';
import { Popover, Radio } from 'antd';
import 'antd/dist/antd.css';
import odcTheme from '@alipay/alex/extensions/alex.odc-theme';
import { Button } from '@opensumi/ide-components';
import { IEditor } from '@opensumi/ide-editor';


let id = 1

export const SQLRender: React.FC = (props) => {

  const PluginID = id
  const SQLPlugin = useMemo(() => {
    return new SqlPlugin(PluginID);
  }, []);

  let tableID = 123;

  const suggestTables = [
    {
      label: `sample_two_table_${tableID}`,
      type: 'SAMPLE_TYPE_TWO',
      insertText: 'LD.sample_one_table1',
      kind: CompletionItemKind.Method,
      sortText: 'a',
    },
  ];
  const layoutConfig = {
    [SlotLocation.main]: {
      modules: ['@opensumi/ide-editor'],
    },
  };

  const [editor, setEditor] = useState(true);

  id++
  console.log('render sql ==>',id)


  async function addLine() {
    const editor = (await SQLPlugin.commands?.executeCommand('alex.sql.editor')) as IEditor;
    editor?.monacoEditor.trigger('editor', 'type', { text: '\n' });
  }
  function format() {
    SQLPlugin.commands?.executeCommand('editor.action.formatDocument');
  }
  function openFile() {
    /** COMMAND alex.sql.open
     *  @param {string} uri - 文件uri
     *  @param {string} content - 文件内容 无内容时创建并注入默认内容
     */
    SQLPlugin.commands?.executeCommand('alex.sql.open', 'test1.sql', '默认内容');
  }
  async function getEditor() {
    const editor = (await SQLPlugin.commands?.executeCommand('alex.sql.editor')) as IEditor;
    console.log(editor?.monacoEditor.getValue());
  }
  
  return (
    <div style={{ height: '200px', display: 'flex' }}>
      <Button style={{ zIndex: '100' }} onClick={() => setEditor(false)}>销毁editor</Button>
      <Button style={{ zIndex: '100' }} onClick={() => format()}>格式化</Button>
      <Button style={{ zIndex: '100' }} onClick={() => addLine()}>添加行</Button>
      <Button style={{ zIndex: '100' }} onClick={() => openFile()}>打开文件</Button>
      <Button style={{ zIndex: '100' }} onClick={() => getEditor()}>获取当前内容</Button>

      {editor && (
        <div style={{ border: '2px solid red', zIndex: '10', width: '100%'}}>
        <AppRenderer2
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
                // onWokerLoad: ({language, loadTime}) => {
                //   // worker 加载完成
                //   console.log(language, loadTime);
                // },
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
                  console.log('suggest', keyword, options, suggestTables);
                  return suggestTables;
                },
                onSuggestFields: (prefix, options) => {
                  console.log('files', prefix, options);

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
            workspaceDir: `sql-service-${id}`,
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
            defaultOpenFile: 'test.sql',
            hideBreadcrumb: true,
            hideLeftTabBar: true,
            registerKeybindings: [
              {
                command: '',
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
                      'test.sql': 'select * from',
                    });
                  },
                },
              },
            },
          }}
        />
        </div>
      )}
    </div>
  );
};
