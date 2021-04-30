/**
 * codeEditorService monaco 是单例且缓存的，kaitian injector 机制导致每次重置 IDE 时示例会变化
 * 因此这里创建一个单例，然后 proxy 到最新的 codeEditorService
 */

// TODO: PR 到 kaitian 中

import { Injector } from '@ali/common-di';
import { MonacoCodeService } from '@ali/ide-editor/lib/browser/editor.override';
import { CodeEditorServiceImpl } from '@ali/monaco-editor-core/esm/vs/editor/browser/services/codeEditorServiceImpl';
import { StaticServices } from '@ali/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';

export const IMonacoCodeService = Symbol('IMonacoCodeService');

export { MonacoCodeService };

class CodeEditorService extends CodeEditorServiceImpl {
  private injector: Injector | null = null;
  private uid = 0;

  constructor() {
    super(StaticServices.standaloneThemeService.get());
  }

  setInjector(injector: Injector) {
    this.injector = injector;
    this.uid++;
    const currentUId = this.uid;
    return () => {
      if (currentUId === this.uid) {
        this.injector = null;
      }
    };
  }

  getActiveCodeEditor() {
    return this.injector!.get(IMonacoCodeService).getActiveCodeEditor();
  }

  openCodeEditor(...args: any[]) {
    return this.injector!.get(IMonacoCodeService).openCodeEditor(...args);
  }
}

export const codeServiceEditor = new CodeEditorService();
