import { EditorRenderer, IAppInstance } from '@codeblitzjs/ide-core/lib/editor';
import * as Alex from '@codeblitzjs/ide-core/lib/editor';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
// 引入 extension
import '@codeblitzjs/ide-core/lib/editor.extension';
import '@codeblitzjs/ide-core/languages';

import 'antd/dist/antd.css';
import Button from 'antd/lib/button';
import Cascader from 'antd/lib/cascader';
import Select from 'antd/lib/select';
import './style.less';
import { request } from '@codeblitzjs/ide-common';
import { LocalExtensionModule } from '../common/local-extension.module';
import * as editorPlugin from './plugin';

(window as any).alex = Alex;

const fileOptions = (function transform(obj) {
  return Object.keys(obj).map((key) => {
    return {
      value: key,
      label: key,
      children: Array.isArray(obj[key])
        ? obj[key].map((v) => ({ value: v, label: v }))
        : transform(obj[key]),
    };
  });
})({
  'opensumi/core': {
    main: ['README.md', 'package.json'],
  },
});

const App = () => {
  const [key, setKey] = useState(0);
  const [project, setProject] = useState('');
  const [ref, setRef] = useState('');
  const [filepath, setFilePath] = useState('');
  const [encoding, setEncoding] = useState<'utf8' | 'gbk' | undefined>('utf8');
  const [lineNumber, setLineNumber] = useState<
    number | [number, number] | Array<[number, number]> | undefined
  >([
    [10, 20],
    [30, 40],
  ]);

  const readFile = async (filepath: string) => {
    const res = await request(
      `https://api.github.com/repos/${project}/contents/${filepath}?ref=${ref}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
        },
        responseType: 'arrayBuffer',
      },
    );
    if (res) {
      return res;
    }
    throw new Error(`readFile`);
  };

  const onFileChange = ([project, ref, filepath]) => {
    setProject(project);
    setRef(ref);
    setFilePath(filepath);
  };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Cascader
          style={{ width: '100%' }}
          size='small'
          options={fileOptions}
          onChange={onFileChange}
          placeholder='Please select'
        />
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Button onClick={() => setKey((k) => k + 1)} size='small' style={{ marginRight: 8 }}>
          RESET
        </Button>
        <Select
          value={encoding}
          onChange={setEncoding}
          size='small'
          style={{ width: 120, marginRight: 8 }}
          placeholder='更改编码'
        >
          {['utf8', 'gbk'].map((encoding) => (
            <Select.Option key={encoding} value={encoding}>
              {encoding}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={JSON.stringify(lineNumber)}
          onChange={(value) => setLineNumber(JSON.parse(value))}
          size='small'
          style={{ width: 120, marginRight: 8 }}
          placeholder='更改选中行'
        >
          {[
            10,
            30,
            100,
            [10, 20],
            [
              [30, 35],
              [40, 50],
              [66, 77],
            ],
          ].map((line, index) => (
            <Select.Option key={index} value={JSON.stringify(line)}>
              {JSON.stringify(line)}
            </Select.Option>
          ))}
        </Select>
        <Button
          onClick={() => {
            const commands = editorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('plugin.command.add', 1);
            }
          }}
          size='small'
        >
          command test
        </Button>
        <Button
          onClick={() => {
            const commands = editorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('plugin.command.changeTheme', 'opensumi-design-dark');
            }
          }}
          size='small'
        >
          theme change
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '80%', minHeight: 500 }}>
          {project
            ? (
              <EditorRenderer
                key={`${project}-${key}`}
                onLoad={(app) => {
                  window.app = app;
                }}
                appConfig={{
                  modules: [LocalExtensionModule],
                  plugins: [editorPlugin],
                  workspaceDir: project,
                  defaultPreferences: {
                    'general.theme': 'opensumi-design-light',
                    'editor.scrollBeyondLastLine': false,
                    'lsif.documentScheme': 'file',
                    'lsif.enable': true,
                    'lsif.env': 'prod',
                    // 'editor.forceReadOnly': true,
                    // 'editor.wordWrap': 'on',
                  },
                }}
                runtimeConfig={{
                  scenario: null,
                  startupEditor: 'none',
                  // hideEditorTab: true,
                  resolveFileType(path) {
                    return 'text';
                  },
                }}
                editorConfig={{
                  adjustFindWidgetTop: true,
                  disableCache: true,
                  // disableEditorSearch: true,
                  // stretchHeight: true,
                }}
                documentModel={{
                  type: 'code',
                  ref,
                  owner: project.split('/')[0],
                  name: project.split('/')[1],
                  filepath,
                  onFilepathChange(newFilepath) {
                    setFilePath(newFilepath);
                  },
                  readFile,
                  encoding,
                  lineNumber,
                  onLineNumberChange(num) {
                    setLineNumber(num);
                  },
                }}
              />
            )
            : null}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);

root.render(<App />);

// for test
window.destroy = () => {
  root.render(<div>destroyed</div>);
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
  }
}
