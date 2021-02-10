/**
 * ide 目前未引用模块
 * express-file-server, extension-manager, task, terminal-next,
 */

import * as Addons from '../modules/ali__ide-addons';
import * as Comments from '../modules/ali__ide-comments';
import * as Components from '../modules/ali__ide-components';
import * as CoreBrowser from '../modules/ali__ide-core-browser';
import * as CoreCommon from '../modules/ali__ide-core-common';
import * as Debug from '../modules/ali__ide-debug';
import * as Decoration from '../modules/ali__ide-decoration';
import * as Editor from '../modules/ali__ide-editor';
import * as Explorer from '../modules/ali__ide-explorer';
import * as ExtensionStorage from '../modules/ali__ide-extension-storage';
import * as FileScheme from '../modules/ali__ide-file-scheme';
import * as FileSearch from '../modules/ali__ide-file-search';
import * as FileService from '../modules/ali__ide-file-service';
import * as FileTreeNext from '../modules/ali__ide-file-tree-next';
import * as KaitianExtension from '../modules/ali__ide-kaitian-extension';
import * as Keymaps from '../modules/ali__ide-keymaps';
import * as Logs from '../modules/ali__ide-logs';
import * as MainLayout from '../modules/ali__ide-main-layout';
import * as Markdown from '../modules/ali__ide-markdown';
import * as Markers from '../modules/ali__ide-markers';
import * as MenuBar from '../modules/ali__ide-menu-bar';
import * as Monaco from '../modules/ali__ide-monaco';
import * as MonacoEnhance from '../modules/ali__ide-monaco-enhance';
import * as OpenedEditor from '../modules/ali__ide-opened-editor';
import * as Outline from '../modules/ali__ide-outline';
import * as Output from '../modules/ali__ide-output';
import * as Overlay from '../modules/ali__ide-overlay';
import * as Preferences from '../modules/ali__ide-preferences';
import * as QuickOpen from '../modules/ali__ide-quick-open';
import * as Scm from '../modules/ali__ide-scm';
import * as Search from '../modules/ali__ide-search';
import * as StaticResource from '../modules/ali__ide-static-resource';
import * as StatusBar from '../modules/ali__ide-status-bar';
import * as Storage from '../modules/ali__ide-storage';
import * as Theme from '../modules/ali__ide-theme';
import * as Toolbar from '../modules/ali__ide-toolbar';
import * as Variable from '../modules/ali__ide-variable';
import * as Webview from '../modules/ali__ide-webview';
import * as Workspace from '../modules/ali__ide-workspace';
import * as WorkspaceEdit from '../modules/ali__ide-workspace-edit';

// others
import * as CommonDI from '../modules/ali__common-di';
import * as AlexCore from '../modules/alipay__alex-core';

// node
import * as os from 'os';
import * as crypto from 'crypto';
import * as buffer from 'buffer';
import * as assert from 'assert';
import * as path from 'path';

export function requireModule(module: '@ali/ide-addons'): typeof Addons;
export function requireModule(module: '@ali/ide-comments'): typeof Comments;
export function requireModule(module: '@ali/ide-components'): typeof Components;
export function requireModule(module: '@ali/ide-core-browser'): typeof CoreBrowser;
export function requireModule(module: '@ali/ide-core-common'): typeof CoreCommon;
export function requireModule(module: '@ali/ide-debug'): typeof Debug;
export function requireModule(module: '@ali/ide-decoration'): typeof Decoration;
export function requireModule(module: '@ali/ide-editor'): typeof Editor;
export function requireModule(module: '@ali/ide-explorer'): typeof Explorer;
export function requireModule(module: '@ali/ide-extension-storage'): typeof ExtensionStorage;
export function requireModule(module: '@ali/ide-file-search'): typeof FileSearch;
export function requireModule(module: '@ali/ide-file-service'): typeof FileService;
export function requireModule(module: '@ali/ide-file-scheme'): typeof FileScheme;
export function requireModule(module: '@ali/ide-file-tree-next'): typeof FileTreeNext;
export function requireModule(module: '@ali/ide-kaitian-extension'): typeof KaitianExtension;
export function requireModule(module: '@ali/ide-keymaps'): typeof Keymaps;
export function requireModule(module: '@ali/ide-logs'): typeof Logs;
export function requireModule(module: '@ali/ide-main-layout'): typeof MainLayout;
export function requireModule(module: '@ali/ide-markdown'): typeof Markdown;
export function requireModule(module: '@ali/ide-markers'): typeof Markers;
export function requireModule(module: '@ali/ide-menu-bar'): typeof MenuBar;
export function requireModule(module: '@ali/ide-monaco'): typeof Monaco;
export function requireModule(module: '@ali/ide-monaco-enhance'): typeof MonacoEnhance;
export function requireModule(module: '@ali/ide-opened-editor'): typeof OpenedEditor;
export function requireModule(module: '@ali/ide-outline'): typeof Outline;
export function requireModule(module: '@ali/ide-output'): typeof Output;
export function requireModule(module: '@ali/ide-overlay'): typeof Overlay;
export function requireModule(module: '@ali/ide-preferences'): typeof Preferences;
export function requireModule(module: '@ali/ide-quick-open'): typeof QuickOpen;
export function requireModule(module: '@ali/ide-scm'): typeof Scm;
export function requireModule(module: '@ali/ide-search'): typeof Search;
export function requireModule(module: '@ali/ide-static-resource'): typeof StaticResource;
export function requireModule(module: '@ali/ide-status-bar'): typeof StatusBar;
export function requireModule(module: '@ali/ide-storage'): typeof Storage;
export function requireModule(module: '@ali/ide-theme'): typeof Theme;
export function requireModule(module: '@ali/ide-toolbar'): typeof Toolbar;
export function requireModule(module: '@ali/ide-variable'): typeof Variable;
export function requireModule(module: '@ali/ide-webview'): typeof Webview;
export function requireModule(module: '@ali/ide-workspace'): typeof Workspace;
export function requireModule(module: '@ali/ide-workspace-edit'): typeof WorkspaceEdit;

export function requireModule(module: '@ali/common-di'): typeof CommonDI;
export function requireModule(module: '@alipay/alex-core'): typeof AlexCore;

export function requireModule(module: 'fs'): typeof AlexCore.fs;
export function requireModule(module: 'fs-extra'): typeof AlexCore.fsExtra;
export function requireModule(module: 'os'): typeof os;
export function requireModule(module: 'crypto'): typeof crypto;
export function requireModule(module: 'buffer'): typeof buffer;
export function requireModule(module: 'process'): typeof process;
export function requireModule(module: 'assert'): typeof assert;
export function requireModule(module: 'path'): typeof path;

export function requireModule(module: string): any {
  switch (module) {
    case '@ali/ide-addons':
      return Addons;
    case '@ali/ide-comments':
      return Comments;
    case '@ali/ide-components':
      return Components;
    case '@ali/ide-core-browser':
      return CoreBrowser;
    case '@ali/ide-core-common':
      return CoreCommon;
    case '@ali/ide-debug':
      return Debug;
    case '@ali/ide-decoration':
      return Decoration;
    case '@ali/ide-editor':
      return Editor;
    case '@ali/ide-explorer':
      return Explorer;
    case '@ali/ide-extension-storage':
      return ExtensionStorage;
    case '@ali/ide-file-search':
      return FileSearch;
    case '@ali/ide-file-service':
      return FileService;
    case '@ali/ide-file-scheme':
      return FileScheme;
    case '@ali/ide-file-tree-next':
      return FileTreeNext;
    case '@ali/ide-kaitian-extension':
      return KaitianExtension;
    case '@ali/ide-keymaps':
      return Keymaps;
    case '@ali/ide-logs':
      return Logs;
    case '@ali/ide-main-layout':
      return MainLayout;
    case '@ali/ide-markdown':
      return Markdown;
    case '@ali/ide-markers':
      return Markers;
    case '@ali/ide-menu-bar':
      return MenuBar;
    case '@ali/ide-monaco':
      return Monaco;
    case '@ali/ide-monaco-enhance':
      return MonacoEnhance;
    case '@ali/ide-opened-editor':
      return OpenedEditor;
    case '@ali/ide-outline':
      return Outline;
    case '@ali/ide-output':
      return Output;
    case '@ali/ide-overlay':
      return Overlay;
    case '@ali/ide-preferences':
      return Preferences;
    case '@ali/ide-quick-open':
      return QuickOpen;
    case '@ali/ide-scm':
      return Scm;
    case '@ali/ide-search':
      return Search;
    case '@ali/ide-static-resource':
      return StaticResource;
    case '@ali/ide-status-bar':
      return StatusBar;
    case '@ali/ide-storage':
      return Storage;
    case '@ali/ide-theme':
      return Theme;
    case '@ali/ide-toolbar':
      return Toolbar;
    case '@ali/ide-variable':
      return Variable;
    case '@ali/ide-webview':
      return Webview;
    case '@ali/ide-workspace':
      return Workspace;
    case '@ali/ide-workspace-edit':
      return WorkspaceEdit;

    case '@ali/common-di':
      return CommonDI;
    case '@alipay/alex-core':
      return AlexCore;

    case 'fs':
      return AlexCore.fs;
    case 'fs-extra':
      return AlexCore.fsExtra;
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
