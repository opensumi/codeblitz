import React, { useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, SlotLocation } from '@alipay/alex';
import '@alipay/alex/languages/sql';
import {
  CompletionItemKind,
  SqlServiceModule,
  supportLanguage,
  setMonacoEnvironment,
} from '@alipay/alex-sql-service';
import { Button } from '@opensumi/ide-components';
import * as SQLPlugin from './sql.plugin';
import { IEditor } from '@opensumi/ide-editor';
import { Popover, Radio, Menu } from 'antd';
import 'antd/dist/antd.css';
import odcTheme from '@alipay/alex/extensions/alex.odc-theme';
import { SQLRender } from './sqlRender';

setMonacoEnvironment();

const App = () => {

  const [fontValue, setFontValue] = useState(16);
  const [encoding, setEncoding] = useState('utf8');
  const [editorNumber, setEditorNumber] = useState(1);

  let tableID = 1;

  const suggestTables = useRef([
    {
      label: `sample_one_table_${tableID}`,
      type: 'SAMPLE_TYPE_ONE',
      insertText: 'LD.sample_one_table1',
      kind: CompletionItemKind.Method,
      sortText: 'a',
    },
  ]);

  function changeTables() {
    tableID++;
    suggestTables.current = suggestTables.current.concat([
      {
        label: `sample_one_table_${tableID}`,
        type: 'SAMPLE_TYPE_ONE',
        insertText: 'LD.sample_one_table1',
        kind: CompletionItemKind.Method,
        sortText: 'a',
      },
    ]);
  }

  const onChangeFont = (e) => {
    setFontValue(e.target.value);
    updatePrefeence('editor.fontSize', e.target.value);
  };
  const onChangeEnoding = (e) => {
    setEncoding(e.target.value);
    updatePrefeence('files.encoding', e.target.value);
  };

  function editorNumberUpdate() {
    console.log('editorNumberUpdate', editorNumber);
    setEditorNumber(editorNumber + 1);
  }

  function format() {
    SQLPlugin.api.commands?.executeCommand('editor.action.formatDocument');
  }

  function updatePrefeence(perferenceName, value) {
    // 设置首选项
    SQLPlugin.api.commands?.executeCommand('alex.setDefaultPreference', perferenceName, value);
  }

  async function addLine() {
    const editor = (await SQLPlugin.api.commands?.executeCommand('alex.sql.editor')) as IEditor;
    editor?.monacoEditor.trigger('editor', 'type', { text: '\n' });
  }

  function openFile() {
    /** COMMAND alex.sql.open
     *  @param {string} uri - 文件uri
     *  @param {string} content - 文件内容 无内容时创建并注入默认内容
     */
    SQLPlugin.api.commands?.executeCommand('alex.sql.open', 'test1.sql', '默认内容');
  }

  async function editor() {
    const editor = (await SQLPlugin.api.commands?.executeCommand('alex.sql.editor')) as IEditor;
    console.log(editor?.monacoEditor.getValue());
  }

  const content = () => (
    <div>
      <p>编码</p>
      <Radio.Group onChange={onChangeEnoding} value={encoding}>
        <Radio value={'utf8'}>utf8</Radio>
        <Radio value={'gbk'}>gbk</Radio>
        <Radio value={'utf16le'}>utf16le</Radio>
      </Radio.Group>
      <p>字体大小</p>
      <Radio.Group onChange={onChangeFont} value={fontValue}>
        <Radio value={10}>10</Radio>
        <Radio value={16}>16</Radio>
      </Radio.Group>
    </div>
  );
  const items = [
    {
      label: 'Navigation One',
      key: '1',
    },
    {
      label: 'Navigation Two',
      key: '2',
    },
  ];
  const [current, setCurrent] = useState('1');

  const menuCick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    // 每次切换tab 打开对应的文件
    if(e.key === '1') {
      SQLPlugin.api.commands?.executeCommand('alex.sql.open', 'test_uri1/test.sql');
    }else {
      SQLPlugin.api.commands?.executeCommand('alex.sql.open', 'test_uri2/test.sql');

    }
  };

  return (
    <div style={{ height: '100%', overflow: 'scroll' }}>
      <div style={{ height: '300px' }}>
        <div style={{ margin: '20px' }}>
          <Button onClick={() => format()}>格式化</Button>
          <Button onClick={() => addLine()}>添加行</Button>
          <Button onClick={() => openFile()}>打开文件</Button>
          <Button onClick={() => editor()}>获取当前内容</Button>
          {/* <Button onClick={() => changeTables()}>change suggest Tables</Button> */}
          <Popover content={content} placement="top">
            <Button>设置</Button>
          </Popover>
          {/* <Button onClick={() => changeTables()}>change suggest Tables</Button> */}
          <Button onClick={() => window.reset()}>reset </Button>
          {/* <Button onClick={() => editorNumberUpdate()}>添加编辑器</Button> */}
          <Menu onClick={menuCick} selectedKeys={[current]} mode="horizontal" items={items} />
          <div style={{ display: `${current === '1' ? 'block' : 'none'}` }}>
              <SQLRender  id={current} visible={current === '1'} />
          </div>
          <div style={{ display: `${current === '2' ? 'block' : 'none'}` }}>
              <SQLRender  id={current} visible={current === '2'} />
          </div>
        </div>

        {/* <AppRenderer2
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
                  console.log('suggest', keyword, options, suggestTables.current);
                  return suggestTables.current;
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
        /> */}
      </div>
    </div>
  );
};

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
