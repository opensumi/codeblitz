import { AppRenderer, getDefaultLayoutConfig, IAppInstance, SlotLocation } from '@codeblitzjs/ide-core';
import * as Alex from '@codeblitzjs/ide-core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { CodePlatform } from '@codeblitzjs/ide-code-api';
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
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream';

import { LocalExtensionModule } from '../common/local-extension.module';
import * as Plugin from '../editor/plugin';

import '../index.css';
import { DiffViewerRenderer } from '@codeblitzjs/ide-core/lib/api/renderDiffViewer';
import { LayoutComponent } from '@codeblitzjs/ide-core/lib/core/layout';
import {
  CancellationToken,
  IAIBackServiceOption,
  IChatProgress,
  sleep,
} from '@codeblitzjs/ide-core/lib/modules/opensumi__ide-core-browser';

(window as any).alex = Alex;

isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const layoutConfig = {
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
};

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

const App = () => (
  <DiffViewerRenderer
    onRef={(handle) => {
      console.log('=====', handle);
    }}
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
      plugins: [Plugin],
      modules: [
        LocalExtensionModule,
      ],
      extensionMetadata,
    }}
  />
);

let key = 0;

const root = createRoot(document.getElementById('main') as HTMLElement);

const render = () => root.render(<App key={key++} />);
render();
window.reset = (destroy = false) => (destroy ? root.render(<div>destroyed</div>) : render());

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
