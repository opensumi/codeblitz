import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, EditorRenderer } from '@alipay/alex/lib/editor';
import * as Alex from '@alipay/alex/lib/editor';
// 引入 extension
import '@alipay/alex/lib/editor.extension';
import '../common/languages';

import 'antd/dist/antd.css';
import Select from 'antd/lib/select';
import Cascader from 'antd/lib/cascader';
import Button from 'antd/lib/button';
import './style.less';
import * as EditorPlugin from './plugin';
import { StartupModule } from './editor.module';

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
  'chaxuan.wh/qiankun-mirror': {
    master: ['src/globalState.ts'],
  },
  'wealth_release/finstrategy': {
    f577528518c7c0279f8cdf3de59ae24a80a16607: [
      'app/biz/service-impl/src/main/java/com/alipay/finstrategy/biz/service/impl/portfolio/msg/TradeMessageListener.java',
    ],
  },
  'kaitian/ide-framework': {
    develop: [
      'packages/addons/src/browser/file-drop.service.ts',
      'packages/addons/src/common/index.ts',
      'OWNERS',
    ],
  },
  'ide-s/TypeScript-Node-Starter': {
    'feat/123123': ['gbk.ts'],
  },
});

const App = () => {
  const [key, setKey] = useState(0);
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
        <Button onClick={() => setKey((k) => k + 1)} size="small" style={{ marginRight: 8 }}>
          RESET
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
        <Button
          onClick={() => {
            const commands = EditorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('plugin.command.test', 1, 2);
            }
          }}
          size="small"
        >
          command test
        </Button>
        <Button
          onClick={() => {
            const commands = EditorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('alex.settings');
            }
          }}
          size="small"
          style={{ marginLeft: 8 }}
        >
          更改偏好设置
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', minHeight: 500 }}>
          {project ? (
            <EditorRenderer
              key={`${project}-${key}`}
              onLoad={(app) => {
                window.app = app;
              }}
              appConfig={{
                modules: [StartupModule],
                plugins: [EditorPlugin],
                workspaceDir: project,
                defaultPreferences: {
                  'general.theme': 'alipay-geek-light',
                  'editor.scrollBeyondLastLine': false,
                  'lsif.documentScheme': 'file',
                  'lsif.enable': true,
                  'lsif.env': 'prod',
                  // 'editor.forceReadOnly': true,
                  // 'editor.wordWrap': 'on',
                },
              }}
              runtimeConfig={{
                biz: 'editor',
                scenario: null,
                startupEditor: 'none',
                // hideEditorTab: true,
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
          ) : null}
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
