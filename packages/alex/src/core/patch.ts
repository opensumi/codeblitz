/**
 * 收敛 kaitian 的 patch
 */

import { StaticServices } from '@ali/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { ModesRegistry } from '@ali/monaco-editor-core/esm/vs/editor/common/modes/modesRegistry';
import { ExtensionServiceImpl } from '@ali/ide-kaitian-extension/lib/browser/extension.service';
import { DirtyDiffWidget } from '@ali/ide-scm/lib/browser/dirty-diff/dirty-diff-widget';

// TODO：待 kaitian 中去掉，临时覆盖掉实现，这样 loader 可移除了
ExtensionServiceImpl.prototype.initCommonBrowserDependency = () => Promise.resolve();
ExtensionServiceImpl.prototype.initKaitianBrowserAPIDependency = () => Promise.resolve();

// TODO: 不使用 private 如何清除副作用
export const disposeMode = () => {
  const { modeService } = StaticServices;

  // 需要把 LanguageRegistry dispose，否则二次加载会重复触发事件，导致加载越来越慢
  (<any>modeService)._value._registry.dispose();
  (<any>modeService)._value = null;
  (<any>ModesRegistry)._languages = [];
};

// TODO: 此处 diff 的 stage 和 revertChange 应该是 git 注册的，框架中直接添加了按钮，耦合，需要修复实现 scm/change/title
const _addAction = (<any>DirtyDiffWidget).prototype._addAction;
(<any>DirtyDiffWidget).prototype._addAction = function (icon: string, type: any) {
  if (icon === 'plus' || icon === 'rollback') return;
  _addAction.call(this, icon, type);
};
