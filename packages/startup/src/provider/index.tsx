import { AppProvider, CodeEditor, DiffEditor } from '@codeblitzjs/ide-core';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { SampleModule, diffService } from './module'
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
      diffService.updateData(diffs)
    }, 1000)

    return () => {
      diffService.clear()
    }
  }, [])

  const update = () => {
    const diffs = [{
      filePath: 'a1.js',
      oldFileContent: 'const add = (x, y) => {\n  return x + y\n}',
      newFileContent: 'const add = (x, y) => {\n  return x + y + 2\n}'
    }, {
      filePath: 'a2.js',
      oldFileContent: 'const add = (x, y) => {\n  return x + y\n}',
      newFileContent: 'const sub = (x, y) => {\n  return x - y\n}'
    }]
    setDiffs(diffs)
    diffService.updateData(diffs)
  }

  return (
    <>
      <button onClick={update} style={{ marginBottom: 16 }}>更新</button>
      <AppProvider
        appConfig={{
          workspaceDir: 'my-workspace',
          modules: [SampleModule],
          defaultPreferences: {
            'editor.autoSave': 'afterDelay',
            'editor.autoSaveDelay': 1000
          }
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
                style={{ width: 1000, height: 300, marginBottom: 16 }}
              />
            )
          }
        })}
      </AppProvider>
    </>
  )
};

createRoot(document.getElementById('main') as HTMLElement).render(<App />);
