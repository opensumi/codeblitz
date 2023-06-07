import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, getDefaultLayoutConfig, SlotLocation } from '@alipay/alex';
import * as Alex from '@alipay/alex';
import '@alipay/alex/languages';
import { CodeServiceModule } from '@alipay/alex-code-service';
import { CodeAPIModule } from '@alipay/alex-code-api';
import { isFilesystemReady } from '@alipay/alex-core';
import { StartupModule } from './startup.module';
import css from '@alipay/alex/extensions/alex-ext-public.css-language-features-worker';
import html from '@alipay/alex/extensions/alex-ext-public.html-language-features-worker';
import json from '@alipay/alex/extensions/alex-ext-public.json-language-features-worker';
import markdown from '@alipay/alex/extensions/alex-ext-public.markdown-language-features-worker';
import typescript from '@alipay/alex/extensions/alex-ext-public.typescript-language-features-worker';
import gitlens from '@alipay/alex/extensions/alex.gitlens';
import graph from '@alipay/alex/extensions/alex.git-graph';
import codeservice from '@alipay/alex/extensions/alex.code-service';
import imagePreview from '@alipay/alex/extensions/alex.image-preview';
import webSCM from '@alipay/alex/extensions/cloud-ide-ext.web-scm';
import anycode from '@alipay/alex/extensions/opensumi-lite-extensions.anycode';
import anycodeCSharp from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-c-sharp';
import anycodeCpp from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-cpp';
import anycodeGo from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-go';
import anycodeJava from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-java';
import anycodePhp from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-php';
import anycodePython from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-python';
import anycodeRust from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-rust';
import anycodeTypescript from '@alipay/alex/extensions/opensumi-lite-extensions.anycode-typescript';
import referencesView from '@alipay/alex/extensions/opensumi-lite-extensions.references-view';
import emmet from '@alipay/alex/extensions/opensumi-lite-extensions.emmet';
import codeswing from '@alipay/alex/extensions/vscode-extensions.codeswing';
import codeRunner from '@alipay/alex/extensions/opensumi-lite-extensions.code-runner-for-web';
import vditor from '@alipay/alex/extensions/alex.vditor-markdown';
import mergeConflict from '@alipay/alex/extensions/opensumi-lite-extensions.merge-conflict';

import { LocalExtensionModule } from '../common/local-extension.module';
import * as Plugin from '../editor/plugin';
import * as SCMPlugin from './web-scm.plugin';
import { WorkbenchEditorService } from '@opensumi/ide-editor';

(window as any).alex = Alex;

isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const platformConfig = {
  antcode: {
    owner: 'kaitian',
    name: 'ide-framework',
  },
  github: {
    owner: 'microsoft',
    name: 'vscode',
  },
  gitlab: {
    owner: 'kaitian',
    name: 'ide-framework',
  },
  gitlink: {
    owner: 'qingyou',
    name: 'test',
  },
  // 平台地址: https://atomgit.com/
  atomgit: {
    owner: 'ricbet',
    name: 'atomgit-repo-test'
  }
};

const layoutConfig = getDefaultLayoutConfig();
layoutConfig[SlotLocation.left].modules.push(
  '@opensumi/ide-extension-manager',
  '@opensumi/ide-scm'
);

let pathParts = location.pathname.split('/').filter(Boolean);

const platform: any = pathParts[0] in platformConfig ? pathParts[0] : 'antcode';

const config = platformConfig[platform];
if (pathParts[1]) {
  config.owner = pathParts[1];
}
if (pathParts[2]) {
  config.name = pathParts[2];
}
config.refPath = pathParts.slice(3).join('/');

const App = () => (
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
      window.testPlugin = () => {
        const commands = Plugin.api.commands;
        if (commands) {
          commands.executeCommand('plugin.command.test', 1, 2);
        }
      };
      Plugin.api.commands?.registerCommand('alex.gty.getActiveTextDocument', () => {
        const workbenchEditorService = (app.injector.get(WorkbenchEditorService) as WorkbenchEditorService)
        const currentUri = workbenchEditorService.currentEditorGroup?.currentResource?.uri.codeUri
        return currentUri || ''
      });
    }}
    appConfig={{
      plugins: [Plugin, SCMPlugin],
      modules: [
        CodeServiceModule.Config({
          platform,
          owner: config.owner,
          name: config.name,
          refPath: config.refPath,
          commit: config.commit,
          hash: location.hash,
          antcode: {
            endpoint: '/code-service',
            // for test environment
            // endpoint: '/code-test',
            // origin: 'http://code.test.alipay.net:9009/code-test'
          },
          gitlink: {
            endpoint: '/code-service',
            // origin: 'https://testforgeplus.trustie.net'
          },
        }),
        CodeAPIModule,
        LocalExtensionModule,
        StartupModule,
      ],
      extensionMetadata: [
        css,
        html,
        json,
        markdown,
        vditor,
        typescript,
        codeservice,
        gitlens,
        // graph,
        imagePreview,
        webSCM,
        referencesView,
        codeswing,
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
        codeRunner,
        mergeConflict,
      ],
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'opensumi-dark',
      },
    }}
    runtimeConfig={{
      biz: 'alex',
      scmFileTree: true,
      scenario: 'ALEX_TEST',
      // unregisterActivityBarExtra: true,
      // hideLeftTabBar: true
      // workspace: {
      //   filesystem: {
      //     fs: 'IndexedDB',
      //     options: {
      //       storeName: 'ALEX_HOME'
      //       // cacheSize?: number;
      //     }
      //   }
      // }
    }}
  />
);

let key = 0;
const render = () => ReactDOM.render(<App key={key++} />, document.getElementById('main'));
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy ? ReactDOM.render(<div>destroyed</div>, document.getElementById('main')) : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
