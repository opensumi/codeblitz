import { AppRenderer, SlotLocation } from '@codeblitzjs/ide-core';
import * as Alex from '@codeblitzjs/ide-core';
import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { CodeAPIModule } from '@codeblitzjs/ide-code-api';
import { CodeServiceModule } from '@codeblitzjs/ide-code-service';
import anycode from '@codeblitzjs/ide-core/extensions/codeblitz.anycode';
import anycodeCSharp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-c-sharp';
import anycodeCpp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-cpp';
import anycodeGo from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-go';
import anycodeJava from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-java';
import anycodePhp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-php';
import anycodePython from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-python';
import anycodeRust from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-rust';
import anycodeTypescript from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-typescript';
import css from '@codeblitzjs/ide-core/extensions/codeblitz.css-language-features-worker';
import emmet from '@codeblitzjs/ide-core/extensions/codeblitz.emmet';
import html from '@codeblitzjs/ide-core/extensions/codeblitz.html-language-features-worker';
import imagePreview from '@codeblitzjs/ide-core/extensions/codeblitz.image-preview';
import json from '@codeblitzjs/ide-core/extensions/codeblitz.json-language-features-worker';
import markdown from '@codeblitzjs/ide-core/extensions/codeblitz.markdown-language-features-worker';
import referencesView from '@codeblitzjs/ide-core/extensions/codeblitz.references-view';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import { isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import Modal from 'antd/lib/modal';

import { StartupModule } from './startup.module';

import { LocalExtensionModule } from '../common/local-extension.module';

import '../index.css';
import { LayoutComponent } from '@codeblitzjs/ide-core/lib/core/layout';
import styles from './code.module.less';

isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const platformConfig = {
  github: {
    owner: 'opensumi',
    name: 'codeblitz',
  },
  // for your own project
  gitlab: {
    owner: 'opensumi',
    name: 'codeblitz',
  },
  gitlink: {
    owner: 'opensumi',
    name: 'core',
  },
  atomgit: {
    owner: 'opensumi',
    name: 'codeblitz',
  },
  codeup: {
    owner: '',
    name: '',
    projectId: '',
  },
  gitee: {
    owner: 'opensumi',
    name: 'codeblitz',
  },
};

const layoutConfig = {
  [SlotLocation.top]: {
    modules: [],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer'],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.bottom]: {
    modules: [],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
};

let pathParts = location.pathname.split('/').filter(Boolean);

const platform: any = pathParts[0] in platformConfig ? pathParts[0] : 'github';

const config = platformConfig[platform];
if (pathParts[1]) {
  config.owner = pathParts[1];
}
if (pathParts[2]) {
  config.name = pathParts[2];
}
config.refPath = pathParts.slice(3).join('/');

const extensionMetadata = [
  css,
  html,
  json,
  markdown,
  typescript,
  imagePreview,
  referencesView,
  emmet,
  anycodeCSharp,
  anycodeCpp,
  anycodeGo,
  anycodeJava,
  anycodePhp,
  anycodePython,
  anycodeRust,
  anycodeTypescript,
  anycode,
];

const root = createRoot(document.getElementById('main') as HTMLElement);

const ModelWrapper = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(true);
  const [dialogStyle, setDialogStyle] = React.useState<{
    width: number;
    height: number;
  }>(() => {
    return {
      width: window.innerWidth - 300,
      height: window.innerHeight - 150,
    };
  });

  React.useEffect(() => {
    let timeout: any;
    const onHandleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDialogStyle({
          width: window.innerWidth - 100,
          height: window.innerHeight - 150,
        });
      }, 250);
    };
    window.addEventListener('resize', onHandleResize);
    return () => {
      window.removeEventListener('resize', onHandleResize);
    };
  }, []);

  const app = useMemo(() => (
    <AppRenderer
      style={{
        borderRadius: '8px',
      }}
      appConfig={{
        modules: [
          CodeServiceModule.Config({
            platform,
            owner: config.owner,
            name: config.name,
            refPath: config.refPath,
            commit: config.commit,
            hash: location.hash,
            // for codeup
            projectId: config.projectId,
            gitlink: {
              // for proxy
              endpoint: '/code-service',
            },
            atomgit: {
              // atomgit token https://atomgit.com/-/profile/tokens
              token: '',
            },
            gitee: {
              // gitee token https://gitee.com/profile/personal_access_tokens
              recursive: true,
              token: '',
            },
            codeup: {
              // for proxy
              endpoint: '/code-service',
            },
          }),
          CodeAPIModule,
          LocalExtensionModule,
          StartupModule,
        ],
        extensionMetadata,
        workspaceDir: `${platform}/${config.owner}/${config.name}`,
        layoutComponent: LayoutComponent,
        layoutConfig,
        defaultPreferences: {
          'editor.previewMode': false,
          'general.theme': 'opensumi-design-dark-theme',
        },
      }}
      runtimeConfig={{
        scenario: 'code-component',
        hideLeftTabBar: true,
        startupEditor: 'none',
        workspace: {
          filesystem: {
            fs: 'InMemory',
          },
        },
      }}
    />
  ), []);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Modal
        open={modalOpen}
        centered={true}
        width='90vw'
        maskClosable={false}
        styles={{
          header: {
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0',
          },
        }}
        className={styles['codeblitz-dialog']}
        footer={null}
        // closable={false}
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                color: '#000000d9',
                lineHeight: '24px',
                marginLeft: '24px',
                fontWeight: 500,
              }}
            >
              查看代码文件
            </div>
            <div
              style={{
                flex: 1,
              }}
            >
            </div>
          </div>
        }
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <div
          className={styles.codeblitz}
          style={{
            height: dialogStyle.height,
          }}
        >
          {app}
        </div>
      </Modal>
    </div>
  );
};

root.render(<ModelWrapper />);
