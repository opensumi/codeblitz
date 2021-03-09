import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, EditorRenderer } from '../../editor';
import * as Alex from '../../editor';
import '../startup/languages';

import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import Select from 'antd/lib/select';
import 'antd/lib/select/style/index.css';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/index.css';

(window as any).alex = Alex;

const owner = 'ide-s';
const name = 'TypeScript-Node-Starter';
const project = encodeURIComponent(`${owner}/${name}`);

const App = () => {
  const [ref, setRef] = useState('');
  const [filepath, setFilePath] = useState('');
  const [encoding, setEncoding] = useState<'utf8' | 'gbk' | undefined>('utf8');

  const readFile = async (filepath: string) => {
    const res = await fetch(
      `/code-service/api/v3/projects/${project}/repository/blobs/${encodeURIComponent(
        ref
      )}?filepath=${filepath}`
    );
    if (res.status >= 200 && res.status < 300) {
      return res.arrayBuffer();
    }
    throw new Error(`${res.status} - ${res.statusText}`);
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: 8 }}>
      <div style={{ display: 'flex' }}>
        <Select
          value={ref || undefined}
          onChange={setRef}
          size="small"
          style={{ width: 200, marginRight: 8 }}
          placeholder="选择分支"
        >
          {['master', 'feat/123123'].map((path) => (
            <Select.Option key={path} value={path}>
              {path}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={filepath || undefined}
          onChange={setFilePath}
          size="small"
          style={{ width: 200, marginRight: 8 }}
          placeholder="选择文件"
        >
          {['package.json', 'src/app.ts', 'gbk.ts'].map((path) => (
            <Select.Option key={path} value={path}>
              {path}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={encoding}
          onChange={setEncoding}
          size="small"
          style={{ width: 120, marginRight: 8 }}
          placeholder="更改编码"
        >
          {['utf8', 'gbk'].map((encoding) => (
            <Select.Option key={encoding} value={encoding}>
              {encoding}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ width: '50%', height: 'calc(100% - 100px)' }}>
        <EditorRenderer
          onLoad={(app) => {
            window.app = app;
          }}
          Landing={() => (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spin />
            </div>
          )}
          appConfig={{
            workspaceDir: 'editor',
            defaultPreferences: {
              'general.theme': 'ide-light',
              'editor.scrollBeyondLastLine': false,
              'lsif.documentScheme': 'file',
            },
          }}
          runtimeConfig={{
            biz: 'editor',
            scenario: null,
            startupEditor: 'none',
            // hideEditorTab: true,
          }}
          documentModel={{
            type: 'code',
            ref,
            owner,
            name,
            filepath,
            readFile,
            encoding,
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));

// for test
window.destroy = () => {
  ReactDOM.render(<div>destroyed</div>, document.getElementById('main'));
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
  }
}
