import { AppRenderer, getDefaultLayoutConfig, IAppInstance, SlotLocation } from '@codeblitzjs/ide-core';
import * as Alex from '@codeblitzjs/ide-core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { CodeAPIModule, CodePlatform } from '@codeblitzjs/ide-code-api';
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
import codeRunner from '@codeblitzjs/ide-core/extensions/codeblitz.code-runner-for-web';
import codeswing from '@codeblitzjs/ide-core/extensions/codeblitz.codeswing';
import css from '@codeblitzjs/ide-core/extensions/codeblitz.css-language-features-worker';
import emmet from '@codeblitzjs/ide-core/extensions/codeblitz.emmet';
import graph from '@codeblitzjs/ide-core/extensions/codeblitz.git-graph';
import gitlens from '@codeblitzjs/ide-core/extensions/codeblitz.gitlens';
import html from '@codeblitzjs/ide-core/extensions/codeblitz.html-language-features-worker';
import imagePreview from '@codeblitzjs/ide-core/extensions/codeblitz.image-preview';
import json from '@codeblitzjs/ide-core/extensions/codeblitz.json-language-features-worker';
import markdown from '@codeblitzjs/ide-core/extensions/codeblitz.markdown-language-features-worker';
import mergeConflict from '@codeblitzjs/ide-core/extensions/codeblitz.merge-conflict';
import referencesView from '@codeblitzjs/ide-core/extensions/codeblitz.references-view';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import webSCM from '@codeblitzjs/ide-core/extensions/codeblitz.web-scm';
import { IEditorInlineChat, isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { AILayout } from '@opensumi/ide-ai-native/lib/browser/layout/ai-layout';
import { DESIGN_MENUBAR_CONTAINER_VIEW_ID } from '@opensumi/ide-design';
import { StartupModule } from './startup.module';

import { LocalExtensionModule } from '../common/local-extension.module';
import * as Plugin from '../editor/plugin';
import * as SCMPlugin from './web-scm.plugin';

import '../index.css';
import {
  CancellationToken,
  ComponentRegistryImpl,
  IAIBackServiceOption,
  sleep,
} from '@codeblitzjs/ide-core/lib/modules/opensumi__ide-core-browser';
import { ChatReadableStream } from '@codeblitzjs/ide-sumi-core/lib/server/ai-native/ai-back-service';

(window as any).alex = Alex;

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

const layoutConfig = getDefaultLayoutConfig();
layoutConfig[SlotLocation.left].modules.push(
  '@opensumi/ide-extension-manager',
  '@opensumi/ide-scm',
);

ComponentRegistryImpl.addLayoutModule(layoutConfig, SlotLocation.top, DESIGN_MENUBAR_CONTAINER_VIEW_ID);

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
  gitlens,
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
];

if (platform !== CodePlatform.atomgit) {
  extensionMetadata.push(graph);
}

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
      layoutComponent: AILayout,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'opensumi-design-dark',
      },
    }}
    runtimeConfig={{
      scmFileTree: true,
      scenario: 'ALEX_TEST',
      aiNative: {
        enable: true,
        providerEditorInlineChat(): IEditorInlineChat[] {
          return [
            {
              operational: {
                id: 'test',
                name: 'test',
                codeAction: {},
                title: 'Test',
              },
              handler: {
                execute(editor, ...args) {
                  editor.getModel()?.pushEditOperations(
                    [],
                    [
                      {
                        range: editor.getSelection()!,
                        text: 'test',
                      },
                    ],
                    () => null,
                  );
                },
              },
            },
          ];
        },
        service: {
          async request() {
            return {};
          },

          async requestStream(
            input: string,
            options: IAIBackServiceOption,
            cancelToken?: CancellationToken,
          ): Promise<ChatReadableStream> {
            return new ChatReadableStream();
          },
          async requestCompletion(input) {
            await sleep(500 + Math.random() * 500);
            return {
              sessionId: '1234',
              codeModelList: [
                {
                  content: 'Hello, Codeblitz!\n\n',
                },
              ],
            };
          },
        },
      },
    }}
  />
);

let key = 0;

const root = createRoot(document.getElementById('main') as HTMLElement);

const render = () => root.render(<App key={key++} />);
render();
// for dispose test
window.reset = (destroy = false) => (destroy ? root.render(<div>destroyed</div>) : render());

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
