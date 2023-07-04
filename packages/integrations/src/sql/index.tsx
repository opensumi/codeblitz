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
import { ICodeEditor, IEditor } from '@opensumi/ide-editor';
import { Popover, Radio, Menu } from 'antd';
import 'antd/dist/antd.css';
import { SQLRender } from './sqlRender';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { ODPSTokens } from '@alipay/alex-sql-service/lib/config';
import { ILanguageService } from '@opensumi/monaco-editor-core/esm/vs/editor/common/languages/language';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';

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

  async function format() {
    const editor = (await SQLPlugin.api.commands?.executeCommand('alex.sql.editor')) as IEditor;
    if (editor) {
      const monacoEditor = editor.monacoEditor;
      const selectText = monacoEditor
        .getModel()
        ?.getValueInRange(
          monacoEditor.getSelection() || {
            startColumn: 1,
            startLineNumber: 1,
            endColumn: 1,
            endLineNumber: 1,
          }
        );
      if (selectText) {
        // 格式化选中内容
        SQLPlugin.api.commands?.executeCommand('editor.action.formatSelection');
      } else {
        // 格式化全部文本
        SQLPlugin.api.commands?.executeCommand('editor.action.formatDocument');
      }
    }
  }

  function updatePrefeence(perferenceName, value) {
    // 设置首选项
    SQLPlugin.api.commands?.executeCommand('alex.setDefaultPreference', perferenceName, value);
  }

  async function addLine() {
    const editor = (await SQLPlugin.api.commands?.executeCommand('alex.sql.editor')) as IEditor;
    editor?.monacoEditor.trigger('editor', 'type', { text: '\n' });
  }

  async function openFile() {
    /** COMMAND alex.sql.open
     *  @param {string} uri - 文件uri
     *  @param {string} content - 文件内容 无内容时创建并注入默认内容
     */
    const result = await SQLPlugin.api.commands?.executeCommand(
      'alex.sql.open',
      'test1.sql',
      '默认内容'
    );
    console.log('open', result);
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
    setCurrent(e.key);
    // 每次切换tab 打开对应的文件
    if (e.key === '1') {
      SQLPlugin.api.commands?.executeCommand('alex.sql.open', 'test_uri1/test.sql', '');
    } else {
      SQLPlugin.api.commands?.executeCommand('alex.sql.open', 'test_uri3/test.sql');
    }
  };

  // 渲染 monaco 原生编辑器
  const WhiteTheme: any = {
    base: 'vs',
    inherit: true,
    colors: {
      'editor.background': '#FFFFFF', // 背景色
      'editor.lineHighlightBackground': '#e8f3ff', // 行高亮色
      'editorCursor.foreground': '#171617', // 光标颜色
      'editor.selectionBackground': '#8AA7F8', // 选中文本框颜色
      'editorIndentGuide.background': '#e8f3ff', // 层级提示颜色
      'editorBracketMatch.background': '#8AA7F8', // 选中括号的背景色
      'editor.selectionHighlightBackground': '#CBD4F2', // 已选中的其他内容的高亮颜色
      'editor.findMatchBackground': '#FFA011',
    },
    rules: [
      { token: '', foreground: '171617', background: 'EBEAEF' }, // 默认字体颜色,以及右侧 minimap 背景色
      { token: 'keywords', foreground: '770088', fontStyle: 'bold' }, // 关键词颜色
      { token: 'customKeywords', foreground: '196FD8' }, // 自定义关键词颜色
      { token: 'number', foreground: '2E7F01' }, // 数值颜色
      { token: 'comment', foreground: 'ab5808' }, // 注释颜色
      { token: 'builtinFunctions', foreground: 'CB3BC1' }, // 内置函数
      { token: 'function', foreground: 'CB3BC1' }, // 函数颜色
      { token: 'operator', foreground: '232226' }, // 运算符颜色
      { token: 'string', foreground: 'D45E00' }, // 字符串颜色
    ],
    encodedTokensColors: [
      null,
      '#333333',
      '#FFFFFF',
      '#CB3BC1',
      '#AB5808',
      '#0000FF',
      '#811F3F',
      '#FF0000',
      '#09885A',
      '#0451A5',
      '#196FD8',
      '#267F99',
      '#795E26',
      '#800000',
      '#001080',
      '#CD3131',
      '#770088',
      '#AF00DB',
      '#000000',
      '#D16969',
      '#000080',
      '#A31515',
      '#2E7F01',
      '#232226',
      '#D45E00',
    ],
  };

  function initMonaco() {
    initMonacoTheme();
    createMonao();
    initMonacoLanguage();
  }
  function initMonacoTheme() {
    monaco.editor.defineTheme('monaco-light', WhiteTheme);
    monaco.editor.setTheme('monaco-light');
    monaco.languages.setMonarchTokensProvider('odc-sql', ODPSTokens());
  }

  function initMonacoLanguage() {
    const LanguageService = StandaloneServices.get(ILanguageService);
    LanguageService['_registry']['_registerLanguages']([
      {
        id: 'odc-sql',
      },
    ]);
    monaco.languages.registerCompletionItemProvider('odc-sql', {
      provideCompletionItems: (model, position, context, token) => {
        // TODO 关键词排序
        const suggestions = ['select', 'from'].map((key) => {
          return {
            label: key,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: key,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - 1,
              endColumn: position.column,
            },
          } as monaco.languages.CompletionItem;
        });
        return {
          suggestions: suggestions,
        };
      },
    });
  }

  function createMonao() {
    monaco.editor.create(document.getElementById('monaco') as HTMLElement, {
      language: 'odc-sql',
      value: 'select * from',
      folding: true,
      theme: 'monaco-light',
      lineNumbersMinChars: 3.5,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      minimap: {
        enabled: false,
      },
      formatOnPaste: true,
      renderValidationDecorations: 'on',
    });
  }

  return (
    <div style={{ height: '100%', overflow: 'scroll' }}>
      <div style={{ height: '300px' }}>
        <Button onClick={() => format()}>格式化</Button>
        <Button onClick={() => format()}>格式化选中行</Button>
        <Button onClick={() => addLine()}>添加行</Button>
        <Button onClick={async () => await openFile()}>打开文件</Button>
        <Button onClick={() => editor()}>获取当前内容</Button>
        <Button onClick={() => initMonaco()}>原生编辑器</Button>

        {/* <Button onClick={() => changeTables()}>change suggest Tables</Button> */}
        <Popover content={content} placement="top">
          <Button>设置</Button>
        </Popover>
        {/* <Button onClick={() => changeTables()}>change suggest Tables</Button> */}
        <Button onClick={() => window.reset()}>reset </Button>
        {/* <Button onClick={() => editorNumberUpdate()}>添加编辑器</Button> */}
        <Menu onClick={menuCick} selectedKeys={[current]} mode="horizontal" items={items} />
        <div style={{ display: `${current === '1' ? 'block' : 'none'}` }}>
          <SQLRender id={current} visible={current === '1'} />
        </div>
        <div style={{ display: `${current === '2' ? 'block' : 'none'}` }}>
          <SQLRender id={current} visible={current === '2'} />
        </div>
      </div>
      <div style={{ height: '300px', margin: '20px', border: '2px soldi' }} id="monaco"></div>
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
