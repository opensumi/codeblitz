/**
 * ide 目前未引用模块
 * express-file-server, extension-manager, task, terminal-next,
 */

import * as Addons from '../modules/opensumi__ide-addons';
import * as Comments from '../modules/opensumi__ide-comments';
import * as Components from '../modules/opensumi__ide-components';
import * as CoreBrowser from '../modules/opensumi__ide-core-browser';
import * as CoreCommon from '../modules/opensumi__ide-core-common';
import * as Debug from '../modules/opensumi__ide-debug';
import * as Decoration from '../modules/opensumi__ide-decoration';
import * as Editor from '../modules/opensumi__ide-editor';
import * as Explorer from '../modules/opensumi__ide-explorer';
import * as OpenSumiExtension from '../modules/opensumi__ide-extension';
import * as ExtensionStorage from '../modules/opensumi__ide-extension-storage';
import * as FileScheme from '../modules/opensumi__ide-file-scheme';
import * as FileSearch from '../modules/opensumi__ide-file-search';
import * as FileService from '../modules/opensumi__ide-file-service';
import * as FileTreeNext from '../modules/opensumi__ide-file-tree-next';
import * as Keymaps from '../modules/opensumi__ide-keymaps';
import * as Logs from '../modules/opensumi__ide-logs';
import * as MainLayout from '../modules/opensumi__ide-main-layout';
import * as Markdown from '../modules/opensumi__ide-markdown';
import * as Markers from '../modules/opensumi__ide-markers';
import * as MenuBar from '../modules/opensumi__ide-menu-bar';
import * as Monaco from '../modules/opensumi__ide-monaco';
import * as MonacoEnhance from '../modules/opensumi__ide-monaco-enhance';
import * as OpenedEditor from '../modules/opensumi__ide-opened-editor';
import * as Outline from '../modules/opensumi__ide-outline';
import * as Output from '../modules/opensumi__ide-output';
import * as Overlay from '../modules/opensumi__ide-overlay';
import * as Preferences from '../modules/opensumi__ide-preferences';
import * as QuickOpen from '../modules/opensumi__ide-quick-open';
import * as Scm from '../modules/opensumi__ide-scm';
import * as Search from '../modules/opensumi__ide-search';
import * as StatusBar from '../modules/opensumi__ide-status-bar';
import * as Storage from '../modules/opensumi__ide-storage';
import * as Theme from '../modules/opensumi__ide-theme';
import * as Toolbar from '../modules/opensumi__ide-toolbar';
import * as Variable from '../modules/opensumi__ide-variable';
import * as Webview from '../modules/opensumi__ide-webview';
import * as Workspace from '../modules/opensumi__ide-workspace';
import * as WorkspaceEdit from '../modules/opensumi__ide-workspace-edit';

// others
import * as CodeApi from '../modules/codeblitz__code-api';
import * as CodeService from '../modules/codeblitz__code-service';
import * as SumiCore from '../modules/codeblitz__ide-sumi-core';
import * as CommonDI from '../modules/opensumi__common-di';

// node
import * as assert from 'assert';
import * as buffer from 'buffer';
import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';

export function requireModule(module: '@opensumi/ide-addons'): typeof Addons;
export function requireModule(module: '@opensumi/ide-comments'): typeof Comments;
export function requireModule(module: '@opensumi/ide-components'): typeof Components;
export function requireModule(module: '@opensumi/ide-core-browser'): typeof CoreBrowser;
export function requireModule(module: '@opensumi/ide-core-common'): typeof CoreCommon;
export function requireModule(module: '@opensumi/ide-debug'): typeof Debug;
export function requireModule(module: '@opensumi/ide-decoration'): typeof Decoration;
export function requireModule(module: '@opensumi/ide-editor'): typeof Editor;
export function requireModule(module: '@opensumi/ide-explorer'): typeof Explorer;
export function requireModule(module: '@opensumi/ide-extension-storage'): typeof ExtensionStorage;
export function requireModule(module: '@opensumi/ide-file-search'): typeof FileSearch;
export function requireModule(module: '@opensumi/ide-file-service'): typeof FileService;
export function requireModule(module: '@opensumi/ide-file-scheme'): typeof FileScheme;
export function requireModule(module: '@opensumi/ide-file-tree-next'): typeof FileTreeNext;
export function requireModule(module: '@opensumi/ide-extension'): typeof OpenSumiExtension;
export function requireModule(module: '@opensumi/ide-keymaps'): typeof Keymaps;
export function requireModule(module: '@opensumi/ide-logs'): typeof Logs;
export function requireModule(module: '@opensumi/ide-main-layout'): typeof MainLayout;
export function requireModule(module: '@opensumi/ide-markdown'): typeof Markdown;
export function requireModule(module: '@opensumi/ide-markers'): typeof Markers;
export function requireModule(module: '@opensumi/ide-menu-bar'): typeof MenuBar;
export function requireModule(module: '@opensumi/ide-monaco'): typeof Monaco;
export function requireModule(module: '@opensumi/ide-monaco-enhance'): typeof MonacoEnhance;
export function requireModule(module: '@opensumi/ide-opened-editor'): typeof OpenedEditor;
export function requireModule(module: '@opensumi/ide-outline'): typeof Outline;
export function requireModule(module: '@opensumi/ide-output'): typeof Output;
export function requireModule(module: '@opensumi/ide-overlay'): typeof Overlay;
export function requireModule(module: '@opensumi/ide-preferences'): typeof Preferences;
export function requireModule(module: '@opensumi/ide-quick-open'): typeof QuickOpen;
export function requireModule(module: '@opensumi/ide-scm'): typeof Scm;
export function requireModule(module: '@opensumi/ide-search'): typeof Search;
export function requireModule(module: '@opensumi/ide-status-bar'): typeof StatusBar;
export function requireModule(module: '@opensumi/ide-storage'): typeof Storage;
export function requireModule(module: '@opensumi/ide-theme'): typeof Theme;
export function requireModule(module: '@opensumi/ide-toolbar'): typeof Toolbar;
export function requireModule(module: '@opensumi/ide-variable'): typeof Variable;
export function requireModule(module: '@opensumi/ide-webview'): typeof Webview;
export function requireModule(module: '@opensumi/ide-workspace'): typeof Workspace;
export function requireModule(module: '@opensumi/ide-workspace-edit'): typeof WorkspaceEdit;

export function requireModule(module: '@opensumi/di'): typeof CommonDI;
export function requireModule(module: '@codeblitzjs/ide-sumi-core'): typeof SumiCore;
export function requireModule(module: '@codeblitzjs/ide-code-api'): typeof CodeApi;
export function requireModule(module: '@codeblitzjs/ide-code-service'): typeof CodeService;

export function requireModule(module: 'fs'): typeof SumiCore.fs;
export function requireModule(module: 'fs-extra'): typeof SumiCore.fsExtra;
export function requireModule(module: 'os'): typeof os;
export function requireModule(module: 'crypto'): typeof crypto;
export function requireModule(module: 'buffer'): typeof buffer;
export function requireModule(module: 'process'): typeof process;
export function requireModule(module: 'assert'): typeof assert;
export function requireModule(module: 'path'): typeof path;

export function requireModule(module: string): any {
  switch (module) {
    case '@opensumi/ide-addons':
      return Addons;
    case '@opensumi/ide-comments':
      return Comments;
    case '@opensumi/ide-components':
      return Components;
    case '@opensumi/ide-core-browser':
      return CoreBrowser;
    case '@opensumi/ide-core-common':
      return CoreCommon;
    case '@opensumi/ide-debug':
      return Debug;
    case '@opensumi/ide-decoration':
      return Decoration;
    case '@opensumi/ide-editor':
      return Editor;
    case '@opensumi/ide-explorer':
      return Explorer;
    case '@opensumi/ide-extension-storage':
      return ExtensionStorage;
    case '@opensumi/ide-file-search':
      return FileSearch;
    case '@opensumi/ide-file-service':
      return FileService;
    case '@opensumi/ide-file-scheme':
      return FileScheme;
    case '@opensumi/ide-file-tree-next':
      return FileTreeNext;
    case '@opensumi/ide-extension':
      return OpenSumiExtension;
    case '@opensumi/ide-keymaps':
      return Keymaps;
    case '@opensumi/ide-logs':
      return Logs;
    case '@opensumi/ide-main-layout':
      return MainLayout;
    case '@opensumi/ide-markdown':
      return Markdown;
    case '@opensumi/ide-markers':
      return Markers;
    case '@opensumi/ide-menu-bar':
      return MenuBar;
    case '@opensumi/ide-monaco':
      return Monaco;
    case '@opensumi/ide-monaco-enhance':
      return MonacoEnhance;
    case '@opensumi/ide-opened-editor':
      return OpenedEditor;
    case '@opensumi/ide-outline':
      return Outline;
    case '@opensumi/ide-output':
      return Output;
    case '@opensumi/ide-overlay':
      return Overlay;
    case '@opensumi/ide-preferences':
      return Preferences;
    case '@opensumi/ide-quick-open':
      return QuickOpen;
    case '@opensumi/ide-scm':
      return Scm;
    case '@opensumi/ide-search':
      return Search;
    case '@opensumi/ide-status-bar':
      return StatusBar;
    case '@opensumi/ide-storage':
      return Storage;
    case '@opensumi/ide-theme':
      return Theme;
    case '@opensumi/ide-toolbar':
      return Toolbar;
    case '@opensumi/ide-variable':
      return Variable;
    case '@opensumi/ide-webview':
      return Webview;
    case '@opensumi/ide-workspace':
      return Workspace;
    case '@opensumi/ide-workspace-edit':
      return WorkspaceEdit;

    case '@opensumi/di':
      return CommonDI;
    case '@codeblitzjs/ide-sumi-core':
      return SumiCore;
    case '@codeblitzjs/ide-code-api':
      return CodeApi;
    case '@codeblitzjs/ide-code-service':
      return CodeService;
    case 'fs':
      return SumiCore.fs;
    case 'fs-extra':
      return SumiCore.fsExtra;
    case 'os':
      return os;
    case 'crypto':
      return crypto;
    case 'buffer':
      return buffer;
    case 'process':
      return process;
    case 'assert':
      return assert;
    case 'path':
      return path;

    default:
      throw new Error(`not found module ${module}`);
  }
}
