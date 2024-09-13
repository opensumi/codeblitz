import { AppProvider, CodeEditor, DiffEditor } from '@codeblitzjs/ide-core';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { SampleModule, diffsDeferred } from './module'
import '../index.css';
import './index.css'

const App = () => {
  const [diffs, setDiffs] = useState<{filePath: string, oldFileContent: string | null, newFileContent: string | null }[]>([])

  useEffect(() => {
    setTimeout(() => {
      const diffs = [{
        filePath: 'a.js',
        oldFileContent: null,
        newFileContent: 'console.log(123)'
      }, {
        filePath: 'a1.js',
        oldFileContent: 'const add = (x, y) => {\n  return x + y\n}',
        newFileContent: 'const add = (x, y) => {\n  return x + y + 1\n}'
      }]
      setDiffs(diffs)
      diffsDeferred.resolve(diffs)
    }, 1000)
  }, [])

  if (!diffs) return null

  return (
    <AppProvider
      appConfig={{
        workspaceDir: 'my-workspace',
        layoutConfig: {},
        modules: [SampleModule],
      }}
      runtimeConfig={{
        biz: 'startup',
      }}
    >
      {diffs.map(({ filePath, oldFileContent, newFileContent }) => {
        if (!oldFileContent) {
          return (
            <CodeEditor
              key={filePath}
              uri={`sample://new/${filePath}`}
              style={{ width: 1000, height: 300, marginBottom: 16 }}
              editorOptions={{
                scrollbar: {
                  alwaysConsumeMouseWheel: false
                }
              }}
            />
          )
        } else {
          return (
            <DiffEditor
              key={filePath}
              originalUri={`sample://old/${filePath}`}
              modifiedUri={`sample://new/${filePath}`}
              editorOptions={{
                scrollbar: {
                  alwaysConsumeMouseWheel: false
                }
              }}
              style={{ width: 1000, height: 300 }}
            />
          )
        }
      })}
    </AppProvider>
  )
};

createRoot(document.getElementById('main') as HTMLElement).render(<App />);
