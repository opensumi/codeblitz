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

const owner = 'zhouang.za';
const name = 'redcoast-cross-test';
// const owner = 'ide-s';
// const name = 'TypeScript-Node-Starter';
const project = encodeURIComponent(`${owner}/${name}`);

const App = () => {
  const [key, setKey] = useState(0);
  const [ref, setRef] = useState('');
  const [filepath, setFilePath] = useState('');
  const [encoding, setEncoding] = useState<'utf8' | 'gbk' | undefined>('utf8');
  const [lineNumber, setLineNumber] = useState<number | undefined>();

  const setContent = () => {
    setRef('3977cf5ccb607beedce3824f6686fa97e2244506');
    setFilePath('src/main/java/com/alipay/languagebase/service/lsif/impl/CommitServiceImpl.java');
    setLineNumber(30);
  };
  // const setContent = () => {
  //   setRef('feat/123123');
  //   setFilePath('gbk.ts');
  //   // setLineNumber(30);
  // };

  const readFile = async (filepath: string) => {
    const res = await fetch(
      `/code-test/api/v3/projects/${project}/repository/blobs/${encodeURIComponent(
        ref
      )}?filepath=${filepath}`
    );
    if (res.status >= 200 && res.status < 300) {
      return res.arrayBuffer();
    }
    console.log('>>>>res', res);
    throw new Error(`${res.status} - ${res.statusText}`);
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: 8 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Select
          value={ref || undefined}
          onChange={setRef}
          size="small"
          style={{ width: 400, marginRight: 8 }}
          placeholder="选择分支"
        >
          {['3977cf5ccb607beedce3824f6686fa97e2244506'].map((path) => (
            <Select.Option key={path} value={path}>
              {path}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={filepath || undefined}
          onChange={setFilePath}
          size="small"
          style={{ width: 600, marginRight: 8 }}
          placeholder="选择文件"
        >
          {[
            'src/main/java/com/alipay/languagebase/service/lsif/impl/CommitServiceImpl.java',
            'src/main/java/com/alipay/languagebase/service/lsif/CommitService.java',
          ].map((path) => (
            <Select.Option key={path} value={path}>
              {path}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Button size="small" onClick={() => setKey((k) => k + 1)} style={{ marginRight: 8 }}>
          重置
        </Button>
        <Button size="small" onClick={() => setContent()} style={{ marginRight: 8 }}>
          一键设置文件
        </Button>
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
        <Select
          value={lineNumber}
          onChange={setLineNumber}
          size="small"
          style={{ width: 120, marginRight: 8 }}
          placeholder="更改选中行"
        >
          {[10, 30, 100].map((line) => (
            <Select.Option key={line} value={line}>
              {line}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ height: 'calc(100% - 100px)', display: 'flex' }}>
        <div style={{ width: '50%', height: '100%' }}>
          <EditorRenderer
            key={key}
            onLoad={(app) => {
              window.app = app;
            }}
            appConfig={{
              workspaceDir: 'editor',
              defaultPreferences: {
                'general.theme': 'alipay-geek-light',
                'editor.scrollBeyondLastLine': false,
                'lsif.documentScheme': 'file',
                'lsif.enable': true,
                // 'lsif.env': 'prod',
                'editor.forceReadOnly': true,
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
        </div>
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
