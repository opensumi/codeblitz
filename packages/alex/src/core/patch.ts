/**
 * 收敛 kaitian 的 patch
 */

import { Injector } from '@opensumi/di';
import { URI } from '@opensumi/ide-core-common';
import { ModesRegistry } from '@opensumi/monaco-editor-core/esm/vs/editor/common/languages/modesRegistry';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { ILanguageService } from '@opensumi/monaco-editor-core/esm/vs/editor/common/languages/language';
import { DirtyDiffWidget } from '@opensumi/ide-scm/lib/browser/dirty-diff/dirty-diff-widget';
import { AbstractResourcePreferenceProvider } from '@opensumi/ide-preferences/lib/browser/abstract-resource-preference-provider';
import { DiskFsProviderClient } from '@opensumi/ide-file-service/lib/browser/file-service-provider-client';
import { DebugConfigurationManager } from '@opensumi/ide-debug/lib/browser';
import { IconService } from '@opensumi/ide-theme/lib/browser';

export const disposableCollection: ((injector: Injector) => void)[] = [];

// TODO: 不使用 private 如何清除副作用
export const disposeMode = () => {
  const modeService: any = StandaloneServices.get(ILanguageService);

  // 需要把 LanguageRegistry dispose，否则二次加载会重复触发事件，导致加载越来越慢
  modeService._value?._registry?.dispose?.();
  modeService._value = null;
  (<any>ModesRegistry)._languages = [];
};

// TODO: 此处 diff 的 stage 和 revertChange 应该是 git 注册的，框架中直接添加了按钮，耦合，需要修复实现 scm/change/title
const _addAction = (<any>DirtyDiffWidget).prototype._addAction;
(<any>DirtyDiffWidget).prototype._addAction = function (icon: string, type: any) {
  if (icon === 'plus' || icon === 'rollback') return;
  _addAction.call(this, icon, type);
};

// TODO: 目前 preference 在 dispose 时会重置，而这个时机目前是在 dispose 所有实例时才会触发，此时 reset 无意义，
// 还会导致因 reset 触发事件获取 injector 实例发生错误（因为一些实例可能早已销毁）
Object.defineProperty(AbstractResourcePreferenceProvider.prototype, 'reset', {
  value: () => {},
  configurable: true,
});
// 临时修复
DiskFsProviderClient.prototype.getCurrentUserHome = function () {
  return this.fileServiceProvider?.getCurrentUserHome();
};
// 极速版暂不支持断点
DebugConfigurationManager.prototype.canSetBreakpointsIn = () => false;

// TODO: 临时 patch icon 路径不对问题，蚂蚁链上线依赖
// OpenSumi 集成 2.10 后删除该 patch 逻辑
// @ts-ignore
IconService.prototype.getPath = function (basePath: string, relativePath: string) {
  if (relativePath.startsWith('./')) {
    const uri = new URI(basePath).resolve(relativePath.replace(/^\.\//, ''));
    return uri.scheme ? uri : URI.file(uri.toString());
  } else if (/^http(s)?/.test(relativePath)) {
    return new URI(relativePath);
  } else if (basePath) {
    const uri = new URI(basePath).resolve(relativePath);
    return uri.scheme ? uri : URI.file(uri.toString());
  } else if (/^file:\/\//.test(relativePath)) {
    return new URI(relativePath);
  } else {
    return URI.file(relativePath);
  }
};

// @ts-ignore
IconService.prototype.getMaskStyleSheetWithStaticService = function (
  path: URI,
  className: string,
  baseTheme?: string
) {
  const iconUrl = this.staticResourceService.resolveStaticResource(path).toString();
  // @ts-ignore
  return this.getMaskStyleSheet(iconUrl, className, baseTheme);
};

// @ts-ignore
IconService.prototype.getBackgroundStyleSheetWithStaticService = function (
  path: URI,
  className: string,
  baseTheme?: string
) {
  const iconUrl = this.staticResourceService.resolveStaticResource(path).toString();
  // @ts-ignore
  return this.getBackgroundStyleSheet(iconUrl, className, baseTheme);
};
