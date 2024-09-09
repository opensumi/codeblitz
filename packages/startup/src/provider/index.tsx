import { AppProvider, CodeEditor, DiffEditor } from '@codeblitzjs/ide-core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { SampleModule } from './module'
import '../index.css';
import './index.css'

const App = () => (
  <AppProvider
    appConfig={{
      workspaceDir: 'my-workspace',
      layoutConfig: {},
      modules: [SampleModule],
    }}
    runtimeConfig={{
      biz: 'startup',
      workspace: {
        filesystem: {
          fs: 'FileIndexSystem',
          options: {
            // 初始全量文件索引
            requestFileIndex() {
              return Promise.resolve({
                'main.html': '<div id="root"></div>',
                'main.css': 'body {}',
                'main.js': 'console.log("main")',
                'package.json': '{\n  "name": "startup"\n}',
              });
            },
          },
        }
      },
    }}
  >
    <CodeEditor
      uri="main.js"
      style={{ width: 1000, height: 300, marginBottom: 16 }}
      editorOptions={{
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      }}
    />
    <CodeEditor
      uri="main.css"
      style={{ width: 1000, height: 300 }}
      editorOptions={{
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      }}
    />
    <DiffEditor
      originalUri="sample:/a1.js"
      modifiedUri="sample:/a2.js"
      editorOptions={{
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      }}
      style={{ width: 1000, height: 300 }}
    />
  </AppProvider>
);

createRoot(document.getElementById('main') as HTMLElement).render(<App />);
