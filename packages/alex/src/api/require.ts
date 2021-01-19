import * as Addons from '../modules/addons';
import * as Comments from '../modules/comments';
import * as Components from '../modules/components';
import * as CoreBrowser from '../modules/core-browser';
import * as CoreCommon from '../modules/core-common';
import * as Debug from '../modules/debug';
import * as Decoration from '../modules/decoration';
import * as Editor from '../modules/editor';
import * as Explorer from '../modules/explorer';
import * as ExpressFileServer from '../modules/express-file-server';
import * as ExtensionManager from '../modules/extension-manager';
import * as ExtensionStorage from '../modules/extension-storage';
import * as FileScheme from '../modules/file-scheme';
import * as FileSearch from '../modules/file-search';
import * as FileService from '../modules/file-service';
import * as FileTreeNext from '../modules/file-tree-next';
import * as KaitianExtension from '../modules/kaitian-extension';
import * as Keymaps from '../modules/keymaps';
import * as Logs from '../modules/logs';
import * as MainLayout from '../modules/main-layout';
import * as Markdown from '../modules/markdown';
import * as Markers from '../modules/markers';
import * as MenuBar from '../modules/menu-bar';
import * as Monaco from '../modules/monaco';
import * as MonacoEnhance from '../modules/monaco-enhance';
import * as OpenedEditor from '../modules/opened-editor';
import * as Outline from '../modules/outline';
import * as Output from '../modules/output';
import * as Overlay from '../modules/overlay';
import * as Preferences from '../modules/preferences';
import * as QuickOpen from '../modules/quick-open';
import * as Scm from '../modules/scm';
import * as Search from '../modules/search';
import * as Startup from '../modules/startup';
import * as StaticResource from '../modules/static-resource';
import * as StatusBar from '../modules/status-bar';
import * as Storage from '../modules/storage';
// import * as Task from '../ide/task'
// import * as TerminalNext from '../ide/terminal-next'
import * as Theme from '../modules/theme';
import * as Toolbar from '../modules/toolbar';
import * as Variable from '../modules/variable';
import * as Webview from '../modules/webview';
import * as Workspace from '../modules/workspace';
import * as WorkspaceEdit from '../modules/workspace-edit';

// others
import * as CommonDI from '../modules/common-di';
import * as AlexCore from '../modules/alex-core';

export function requireModule(module: '@ali/ide-addons'): typeof Addons;
export function requireModule(module: '@ali/ide-comments'): typeof Comments;
export function requireModule(module: '@ali/ide-components'): typeof Components;
export function requireModule(module: '@ali/ide-core-browser'): typeof CoreBrowser;
export function requireModule(module: '@ali/ide-core-common'): typeof CoreCommon;
export function requireModule(module: '@ali/ide-debug'): typeof Debug;
export function requireModule(module: '@ali/ide-decoration'): typeof Decoration;
export function requireModule(module: '@ali/ide-editor'): typeof Editor;
export function requireModule(module: '@ali/ide-explorer'): typeof Explorer;
export function requireModule(module: '@ali/ide-express-file-server'): typeof ExpressFileServer;
export function requireModule(module: '@ali/ide-extension-manager'): typeof ExtensionManager;
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
export function requireModule(module: '@ali/ide-startup'): typeof Startup;
export function requireModule(module: '@ali/ide-static-resource'): typeof StaticResource;
export function requireModule(module: '@ali/ide-status-bar'): typeof StatusBar;
export function requireModule(module: '@ali/ide-storage'): typeof Storage;
// export function requireModule(module: '@ali/ide-task'): typeof Task;
// export function requireModule(module: '@ali/ide-terminal-next'): typeof TerminalNext;
export function requireModule(module: '@ali/ide-theme'): typeof Theme;
export function requireModule(module: '@ali/ide-toolbar'): typeof Toolbar;
export function requireModule(module: '@ali/ide-variable'): typeof Variable;
export function requireModule(module: '@ali/ide-webview'): typeof Webview;
export function requireModule(module: '@ali/ide-workspace'): typeof Workspace;
export function requireModule(module: '@ali/ide-workspace-edit'): typeof WorkspaceEdit;

export function requireModule(module: '@ali/common-di'): typeof CommonDI;
export function requireModule(module: '@alipay/alex-core'): typeof AlexCore;
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
    case '@ali/ide-express-file-server':
      return ExpressFileServer;
    case '@ali/ide-extension-manager':
      return ExtensionManager;
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
    case '@ali/ide-startup':
      return Startup;
    case '@ali/ide-static-resource':
      return StaticResource;
    case '@ali/ide-status-bar':
      return StatusBar;
    case '@ali/ide-storage':
      return Storage;
    case '@ali/ide-task':
    //   return Task;
    // case '@ali/ide-terminal-next':
    //   return TerminalNext;
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

    default:
      throw new Error(`not found module ${module}`);
  }
}
