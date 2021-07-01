import { Autowired, Injectable } from '@ali/common-di';
import { IDisposable, URI } from '@ali/ide-core-common';
import { ITreeNodeOrCompositeTreeNode, Tree, TreeNodeType } from '@ali/ide-components';
import * as paths from '@ali/ide-core-common/lib/path';
import { IContextKey, IContextKeyService, Emitter, Event } from '@ali/ide-core-browser';

import { ChangeFileRoot, ChangeDirectory, ChangeFile } from './changes-tree-node';
import { ChangesTreeAPI, ChangeTreeMode } from './changes-tree.api';
import { IAntcodeService } from '../../antcode-service/base';
import { sortTwoPaths, stringComparator } from '../../../utils/change-file-sorter';

@Injectable()
export class ChangesTreeService extends Tree {
  @Autowired(ChangesTreeAPI)
  private changesTreeAPI: ChangesTreeAPI;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private treeModeContextKey: IContextKey<boolean>;

  // 切换 tree 模式
  private readonly onDidTreeModeChangeEmitter: Emitter<boolean> = new Emitter();
  public get onDidTreeModeChange(): Event<boolean> {
    return this.onDidTreeModeChangeEmitter.event;
  }

  // 切换 tree 数据俩元
  private readonly onDidTreeDataChangeEmitter: Emitter<void> = new Emitter();
  public get onDidTreeDataChange(): Event<void> {
    return this.onDidTreeDataChangeEmitter.event;
  }

  /**
   * tree 模式的 默认值
   */
  private _isTreeMode = true;

  private disposableList = new Array<IDisposable>();

  private cachedTreeNodeMap: Map<string, ChangeFile> = new Map();
  private cachedListNodeMap: Map<string, ChangeFile> = new Map();

  constructor() {
    super();
    this.treeModeContextKey = this.globalContextKeyService.createKey(
      'changes-tree-mode',
      this._isTreeMode
    );

    this.antcodeService.onDidDiffsChange(
      () => {
        // 清理掉缓存
        this.clearCachedNodeItem();
        this.onDidTreeDataChangeEmitter.fire();
      },
      this,
      this.disposableList
    );
  }

  public dispose() {
    this.disposableList.forEach((disposable) => {
      disposable.dispose();
    });
    this.disposableList = [];
  }

  public get isTreeMode() {
    return this._isTreeMode;
  }

  /**
   *  中间的状态值由ChangesTreeService处理，让ChangesTreeAPI功能更简单
   */
  public toggleTreeMode() {
    const nextValue = !this._isTreeMode;
    this._isTreeMode = nextValue;
    this.treeModeContextKey.set(nextValue);
    this.onDidTreeModeChangeEmitter.fire(nextValue);
  }

  /**
   * 重新初始化数据
   * 目前用来展开全部 已不生效
   */
  public refresh() {
    this.onDidTreeModeChangeEmitter.fire(this.isTreeMode);
  }

  public async resolveChildren(
    parent?: ChangeFileRoot | ChangeDirectory,
    isTree?: boolean
  ): Promise<(ChangeFileRoot | ChangeFile | ChangeDirectory)[]> {
    let children: (ChangeFileRoot | ChangeDirectory | ChangeFile)[] = [];

    if (!parent) {
      const rootTree = await this.changesTreeAPI.init(
        this._isTreeMode ? ChangeTreeMode.Tree : ChangeTreeMode.List
      );
      this._root = new ChangeFileRoot(this, { children: rootTree }, isTree);
      children = [this._root as ChangeFileRoot];
    } else {
      if (parent.raw) {
        // 这里针对 children 做一个排序
        children = parent.raw.children.map((child) => {
          const node = this.toNode(child, parent);
          if (ChangeFile.is(node)) {
            const parentPath = parent.raw.name ? parent.raw.name + '/' : '';
            const fsPath = parentPath + child.name;
            const uri = new URI(fsPath).toString();
            this.cacheNodeItem(uri, node);
          }
          return node;
        });
      }
    }
    return children;
  }

  public getCachedNodeItem(uriStr: string) {
    return this.isTreeMode
      ? this.cachedTreeNodeMap.get(uriStr)
      : this.cachedListNodeMap.get(uriStr);
  }

  // 排序: 文件夹在前 + 文件在后
  public sortComparator = (a: ITreeNodeOrCompositeTreeNode, b: ITreeNodeOrCompositeTreeNode) => {
    if (this._isTreeMode) {
      return this.treeSortComparator(a, b);
    }

    // list 模式采用统一的 sort 规则
    return sortTwoPaths(a, b, (n) => n.name);
  };

  private treeSortComparator(a: ITreeNodeOrCompositeTreeNode, b: ITreeNodeOrCompositeTreeNode) {
    if (a.constructor === b.constructor) {
      return stringComparator(a.name, b.name);
    }
    return a.type === TreeNodeType.CompositeTreeNode
      ? -1
      : b.type === TreeNodeType.CompositeTreeNode
      ? 1
      : 0;
  }

  private clearCachedNodeItem() {
    this.cachedListNodeMap.clear();
    this.cachedTreeNodeMap.clear();
  }

  private cacheNodeItem(uriStr: string, node: ChangeFile) {
    return this.isTreeMode
      ? this.cachedTreeNodeMap.set(uriStr, node)
      : this.cachedListNodeMap.set(uriStr, node);
  }

  private toNode(child: any, parent) {
    // FIXME: 这里没法判断文件类型，暂时当children为[]时判断为文件
    // URI也无法获取,
    // 避免 prefix 的额外 slash
    const pathPrefix = parent.uri ? parent.uri.path + '/' : '';
    const fsPath = pathPrefix + child.name;
    if (Array.isArray(child.children) && child.children.length === 0) {
      const desc = !this.isTreeMode ? paths.dirname(fsPath) : '';
      return new ChangeFile(
        this,
        child,
        parent,
        new URI(fsPath),
        child.name,
        child.change,
        desc === '.' ? '' : desc /* 根目录下的文件的 dirname 是 `.`，需要特殊处理掉 */
      );
    } else {
      return new ChangeDirectory(this, child, parent, new URI(fsPath), child.name);
    }
  }
}
