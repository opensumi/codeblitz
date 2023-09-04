import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, SlotLocation, BoxPanel, SlotRenderer } from '@codeblitzjs/ide-core';
import '@codeblitzjs/ide-core/languages/cpp';
import '@codeblitzjs/ide-core/languages/java';
import '@codeblitzjs/ide-core/languages/javascript';
import '@codeblitzjs/ide-core/languages/typescript';
import '@codeblitzjs/ide-core/languages/php';
import '@codeblitzjs/ide-core/languages/html';
import '@codeblitzjs/ide-core/languages/css';
import '@codeblitzjs/ide-core/languages/ruby';
import '@codeblitzjs/ide-core/languages/go';
import '@codeblitzjs/ide-core/languages/python';

import css from '@codeblitzjs/ide-core/extensions/codeblitz.css-language-features-worker';
import html from '@codeblitzjs/ide-core/extensions/codeblitz.html-language-features-worker';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import collaboration from '@codeblitzjs/ide-core/extensions/codeblitz.collaboration';

import * as plugin from './plugin';

import Modal from 'antd/lib/modal'
import 'antd/lib/modal/style'
import Input from 'antd/lib/input'
import 'antd/lib/input/style'
import Button from 'antd/lib/button'

export const layoutConfig = {
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
};

const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
  </BoxPanel>
);

function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}

const App = () => {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')

  const handleOk = () => {
    const name = value.trim()
    if (name) {
      sessionStorage.setItem('collaboration-name', name)
      plugin.initSocket(name)
      setReady(true)
      setOpen(false)
    }
  }

  useEffect(() => {
    const name = sessionStorage.getItem('collaboration-name')
    if (name) {
      setReady(true)
      plugin.initSocket(name)
    } else {
      setOpen(true)
    }
  }, [])

  return (
    <div style={{ width: '50%', margin: 'auto', height: 700, position: 'relative' }}>
      <Modal
        open={open}
        title="请输入您的名字"
        closable={false}
        onCancel={() => setReady(false)}
        footer={[
          <Button onClick={handleOk}>确定</Button>
        ]}
      >
        <Input autoFocus value={value} onChange={e => setValue(e.target.value)} onPressEnter={handleOk} />
      </Modal>
      {ready && (
        <AppRenderer
          appConfig={{
            plugins: [plugin],
            workspaceDir: 'live',
            layoutConfig,
            layoutComponent: LayoutComponent,
            defaultPreferences: {
              'general.theme': 'opensumi-dark',
              'general.language': 'zh-CN',
              'editor.fontSize': 14,
              'editor.tabSize': 2,
              'editor.scrollBeyondLastLine': false,
              'editor.autoSave': 'afterDelay',
              'editor.autoSaveDelay': 1000, // one second
              'editor.wordBasedSuggestions': true,
              'alitcode.locale': 'zh-CN',
              'alitcode.debug': true,
            },
            extensionMetadata: [html, css, typescript, collaboration],
          }}
          runtimeConfig={{
            biz: 'live',
            scenario: null,
            startupEditor: 'none',
            hideEditorTab: true,
            hideBreadcrumb: true,
            unregisterKeybindings: [
              'ctrlcmd+,',
              'ctrlcmd+shift+p',
              'ctrlcmd+p',
              'F1',
              'alt+n',
              'alt+shift+t',
              'alt+shift+w',
              'ctrlcmd+\\',
            ],
          }}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
