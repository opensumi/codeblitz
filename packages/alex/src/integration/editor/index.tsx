import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, EditorRenderer } from '../../editor';
import * as Alex from '../../editor';
import '../startup/languages';

import 'antd/dist/antd.css';
import Select from 'antd/lib/select';
import Cascader from 'antd/lib/cascader';
import './style.less';

(window as any).alex = Alex;

const fileOptions = [
  {
    value: 'chaxuan.wh/qiankun-mirror',
    label: 'chaxuan.wh/qiankun-mirror',
    children: [
      {
        value: 'master',
        label: 'master',
        children: [
          {
            value: 'src/globalState.ts',
            label: 'src/globalState.ts',
          },
        ],
      },
    ],
  },
  {
    value: 'wealth_release/finstrategy',
    label: 'wealth_release/finstrategy',
    children: [
      {
        value: 'f577528518c7c0279f8cdf3de59ae24a80a16607',
        label: 'f577528518c7c0279f8cdf3de59ae24a80a16607',
        children: [
          {
            value:
              'app/biz/service-impl/src/main/java/com/alipay/finstrategy/biz/service/impl/portfolio/msg/TradeMessageListener.java',
            label:
              'app/biz/service-impl/src/main/java/com/alipay/finstrategy/biz/service/impl/portfolio/msg/TradeMessageListener.java',
          },
        ],
      },
    ],
  },
  {
    value: 'kaitian/ide-framework',
    label: 'kaitian/ide-framework',
    children: [
      {
        value: 'develop',
        label: 'develop',
        children: [
          {
            value: 'packages/addons/src/browser/file-drop.service.ts',
            label: 'packages/addons/src/browser/file-drop.service.ts',
          },
          {
            value: 'packages/addons/src/common/index.ts',
            label: 'packages/addons/src/common/index.ts',
          },
          {
            value: 'OWNERS',
            label: 'OWNERS',
          },
        ],
      },
    ],
  },
];

const App = () => {
  const [project, setProject] = useState('');
  const [ref, setRef] = useState('');
  const [filepath, setFilePath] = useState('');
  const [encoding, setEncoding] = useState<'utf8' | 'gbk' | undefined>('utf8');
  const [lineNumber, setLineNumber] = useState<number | [number, number] | undefined>();

  const readFile = async (filepath: string) => {
    const res = await fetch(
      `/code-service/api/v3/projects/${encodeURIComponent(
        project
      )}/repository/blobs/${encodeURIComponent(ref)}?filepath=${filepath}`
    );
    if (res.status >= 200 && res.status < 300) {
      return res.arrayBuffer();
    }
    throw new Error(`${res.status} - ${res.statusText}`);
  };

  const onFileChange = ([project, ref, filepath]) => {
    setProject(project);
    setRef(ref);
    setFilePath(filepath);
  };
  console.log(123);

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Cascader
          style={{ width: '100%' }}
          size="small"
          options={fileOptions}
          onChange={onFileChange}
          placeholder="Please select"
        />
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
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
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', minHeight: 300 }}>
          <EditorRenderer
            key={project}
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
                'lsif.env': 'prod',
                'editor.forceReadOnly': true,
                'editor.wordWrap': 'on',
              },
            }}
            runtimeConfig={{
              biz: 'editor',
              scenario: null,
              startupEditor: 'none',
              hideEditorTab: true,
            }}
            editorConfig={{
              disableEditorSearch: true,
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
