/**
 * 收敛 kaitian 的 patch
 */

import { Injector } from '@opensumi/di';
import { StaticServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { ModesRegistry } from '@opensumi/monaco-editor-core/esm/vs/editor/common/modes/modesRegistry';
import { DirtyDiffWidget } from '@opensumi/ide-scm/lib/browser/dirty-diff/dirty-diff-widget';
import { AbstractResourcePreferenceProvider } from '@opensumi/ide-preferences/lib/browser/abstract-resource-preference-provider';
import {
  CompositeTreeNode,
  spliceArray,
} from '@opensumi/ide-components/lib/recycle-tree/tree/TreeNode';

export const disposableCollection: ((injector: Injector) => void)[] = [];

// TODO: 不使用 private 如何清除副作用
export const disposeMode = () => {
  const modeService: any = StaticServices.modeService;

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

// TODO: kaitian 已修复 https://code.alipay.com/kaitian/ide-framework/pull_requests/578
// 先临时修复，待发版后移除
CompositeTreeNode.prototype.insertItem = function (this: any, item: any) {
  if (item.parent !== this) {
    item.mv(this, item.name);
    return;
  }
  if (this.children) {
    for (let i = 0; i < this.children.length; i++) {
      // path / id 是节点唯一标识
      if (this.children[i].path === item.path) {
        this.children[i] = item;
        return;
      }
    }
  }
  const branchSizeIncrease =
    1 + (item instanceof CompositeTreeNode && item.expanded ? (item as any)._branchSize : 0);
  if (this._children) {
    this._children.push(item);
    // @ts-ignore
    this._children.sort(this._tree.sortComparator || CompositeTreeNode.defaultSortComparator);
  }
  this._branchSize += branchSizeIncrease;
  let master: any = this;
  // 如果该节点无叶子节点，则继续往上查找合适的插入位置
  while (!master._flattenedBranch) {
    if (master.parent) {
      master = master.parent as CompositeTreeNode;
      master._branchSize += branchSizeIncrease;
    }
  }
  if (!this._children) {
    return;
  }
  let relativeInsertionIndex = this._children!.indexOf(item);
  let absInsertionIndex;
  const leadingSibling = this._children![relativeInsertionIndex - 1];
  if (leadingSibling) {
    const siblingIdx = master._flattenedBranch.indexOf(leadingSibling.id);
    // @ts-ignore
    relativeInsertionIndex =
      siblingIdx +
      (leadingSibling instanceof CompositeTreeNode && leadingSibling.expanded
        ? (leadingSibling as any)._branchSize
        : 0);
  } else {
    relativeInsertionIndex = master._flattenedBranch.indexOf(this.id);
  }
  if (relativeInsertionIndex === -1) {
    if (this._branchSize === 1) {
      // 在空Tree中插入节点时，相对插入位置为0
      relativeInsertionIndex = 0;
    }
  }
  // 非空Tree情况下需要+1，为了容纳自身节点位置，在插入节点下方插入新增节点
  absInsertionIndex = relativeInsertionIndex + 1;
  // 空 Tree 情况下需要重置为 0，避免设置 Uint32Array 时超出范围
  if (master._flattenedBranch.length === 0) {
    absInsertionIndex = 0;
  }
  let branch: number[] = [item.id];

  // @ts-ignore
  if (item instanceof CompositeTreeNode && item.expanded && item._flattenedBranch) {
    // @ts-ignore
    branch = branch.concat(item._flattenedBranch);
    // @ts-ignore
    (item as CompositeTreeNode).setFlattenedBranch(null);
  }
  master.setFlattenedBranch(spliceArray(master._flattenedBranch, absInsertionIndex, 0, branch));
};
