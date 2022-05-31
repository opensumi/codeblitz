import { observable } from 'mobx';
import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import {
  Decoration,
  DecorationsManager,
  IRecycleTreeHandle,
  TreeNodeType,
  WatchEvent,
  CompositeTreeNode,
} from '@opensumi/ide-components';
import {
  CommandService,
  Deferred,
  DisposableCollection,
  EDITOR_COMMANDS,
  Emitter,
  Event,
  WithEventBus,
  OnEvent,
} from '@opensumi/ide-core-browser';
import { LabelService } from '@opensumi/ide-core-browser/lib/services';
import { Path } from '@opensumi/ide-core-common/lib/path';
import pSeries from 'p-series';
import { IProgressService } from '@opensumi/ide-core-browser/lib/progress';
import { debounce } from '@opensumi/ide-core-common';

import { ChangesTreeDecorationService } from './changes-tree-decoration.service';
import { ChangeDirectory, ChangeFile } from './changes-tree-node';
import { ChangesTreeModel } from './changes-tree.model';
import { ChangesTreeService } from './changes-tree.service';

import * as styles from './changes-tree-node.module.less';
import { ChangesTreeViewId } from './common';
import { OpenChangeFilesService } from '../../../modules/open-change-files';
import { OpenDiffEditorEvent } from '../../../common/events';
import { IAntcodeService } from '../../antcode-service/base';

export interface IEditorTreeHandle extends IRecycleTreeHandle {
  hasDirectFocus: () => boolean;
}

export enum ChangesTreeTypes {
  List = 1,
  Tree,
}

@Injectable()
export class ChangesTreeModelService extends WithEventBus {
  private static DEFAULT_FLUSH_FILE_EVENT_DELAY = 100;

  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  @Autowired(ChangesTreeService)
  private readonly changesTreeService: ChangesTreeService;

  @Autowired(LabelService)
  public readonly labelService: LabelService;

  @Autowired(ChangesTreeDecorationService)
  public readonly decorationService: ChangesTreeDecorationService;

  @Autowired(CommandService)
  public readonly commandService: CommandService;

  @Autowired(IProgressService)
  public readonly progressService: IProgressService;

  @Autowired(OpenChangeFilesService)
  private readonly openChangeFilesService: OpenChangeFilesService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  private _activeTreeModel: ChangesTreeModel;
  private _whenReady: Promise<void>;

  private _activeDecorations: DecorationsManager;
  private _changeTreeHandle: IEditorTreeHandle;

  public flushEventQueueDeferred: Deferred<void> | null;
  private _eventFlushTimeout: number;
  private _changeEventDispatchQueue: string[] = [];

  // 装饰器
  private _selectedDecoration: Decoration = new Decoration(styles.mod_selected); // 选中态
  private _focusedDecoration: Decoration = new Decoration(styles.mod_focused); // 焦点态
  // private dirtyDecoration: Decoration = new Decoration(styles.mod_dirty); // 修改态
  // 即使选中态也是焦点态的节点
  private _focusedFile: ChangeDirectory | ChangeFile | undefined;
  // 选中态的节点
  private _selectedFiles: (ChangeDirectory | ChangeFile)[] = [];

  private preContextMenuFocusedFile: ChangeDirectory | ChangeFile | null;

  private disposableCollection: DisposableCollection = new DisposableCollection();

  private onDidRefreshedEmitter: Emitter<void> = new Emitter();
  private onDidTreeModelChangeEmitter: Emitter<ChangesTreeModel> = new Emitter();

  private changesTreeModelMap: Map<
    ChangesTreeTypes,
    {
      treeModel: ChangesTreeModel;
      decorations: DecorationsManager;
      selectedDecoration: Decoration;
      focusedDecoration: Decoration;
    }
  > = new Map();

  @observable
  public baseIndent: number;

  @observable
  public indent: number;

  constructor() {
    super();
    this.showProgress((this._whenReady = this.initTreeModel(this.changesTreeService.isTreeMode)));
    this.disposableCollection.push(
      this.changesTreeService.onDidTreeModeChange((isTreeMode: boolean) => {
        // 展示进度条
        this.showProgress((this._whenReady = this.initTreeModel(isTreeMode)));
      })
    );

    this.disposableCollection.push(
      this.changesTreeService.onDidTreeDataChange(() => {
        // 清理掉之前的缓存
        this.changesTreeModelMap.clear();
        this.showProgress(
          (this._whenReady = this.initTreeModel(this.changesTreeService.isTreeMode))
        );
      })
    );

    this.disposableCollection.push(
      this.labelService.onDidChange(() => {
        // 当labelService注册的对应节点图标变化时，通知视图更新
        this.refresh();
      })
    );
  }

  // 将 tree node 定位到 变更树 中间
  @OnEvent(OpenDiffEditorEvent)
  @debounce(150)
  async locationTreeNodeByUri(e: OpenDiffEditorEvent) {
    const { uri, channel } = e.payload;
    // 默认渠道 or 变更树上的打开文件则不作 location 操作
    if (!channel || channel === 'changes-tree') {
      return;
    }

    const change = this.antcodeService.getChangeByUri(uri);
    if (!change) {
      return;
    }

    const node = this.treeModel.root.getTreeNodeByPath(
      `${this.treeModel.root.path}/${change.newPath}`
    ) as ChangeFile;
    if (!node) {
      return;
    }
    // 设置激活状态
    this.activeFileDecoration(node);
    // 让 item 在可视范围
    await this.changeTreeHandle.ensureVisible(node, 'center');
  }

  private showProgress(promise: Promise<any>) {
    // 展示一个进度条
    // 延迟更新，否则在组件中更新会引起 react warning
    setTimeout(() => {
      this.progressService.withProgress({ location: ChangesTreeViewId }, async () => {
        return promise;
      });
    });
  }

  get flushEventQueuePromise() {
    return this.flushEventQueueDeferred && this.flushEventQueueDeferred.promise;
  }

  get changeTreeHandle() {
    return this._changeTreeHandle;
  }

  get selectedDecoration() {
    return this._selectedDecoration;
  }
  get focusedDecoration() {
    return this._focusedDecoration;
  }

  get decorations() {
    return this._activeDecorations;
  }

  get treeModel() {
    return this._activeTreeModel;
  }

  get whenReady() {
    return this._whenReady;
  }

  // 既是选中态，也是焦点态节点
  get focusedFile() {
    return this._focusedFile;
  }
  // 是选中态，非焦点态节点
  get selectedFiles() {
    return this._selectedFiles;
  }

  get onDidRefreshed(): Event<void> {
    return this.onDidRefreshedEmitter.event;
  }

  get onDidTreeModelChange() {
    return this.onDidTreeModelChangeEmitter.event;
  }

  public async collapseAll() {
    await this.treeModel.root.collapsedAll();
  }

  public async expandAll(parentNode: CompositeTreeNode = this.treeModel.root) {
    if (CompositeTreeNode.isRoot(parentNode)) {
      await parentNode.expandedAll();
    } else {
      parentNode.setExpanded(false, true);
    }

    // 遍历并展开子目录
    // @ts-ignore
    const childNodeList = parentNode.children.slice();
    while (childNodeList.length) {
      const node = childNodeList.pop() as CompositeTreeNode;
      if (CompositeTreeNode.is(node)) {
        this.expandAll(node);
      }
    }
  }

  async initTreeModel(isTreeMode: boolean) {
    this.setProperIndents(isTreeMode);
    const type = isTreeMode ? ChangesTreeTypes.Tree : ChangesTreeTypes.List;
    const preType = !isTreeMode ? ChangesTreeTypes.Tree : ChangesTreeTypes.List;
    if (this.changesTreeModelMap.has(type)) {
      const { treeModel, decorations, selectedDecoration, focusedDecoration } =
        this.changesTreeModelMap.get(type)!;
      this._activeTreeModel = treeModel;
      this._activeDecorations = decorations;
      this._selectedDecoration = selectedDecoration;
      this._focusedDecoration = focusedDecoration;

      this.persistFileSelection(preType);
    } else {
      // 根据是否为多工作区创建不同根节点
      const root = (await this.changesTreeService.resolveChildren(undefined, isTreeMode))[0];
      if (!root) {
        return;
      }
      this._activeTreeModel = this.injector.get<any>(ChangesTreeModel, [root]);

      this._activeDecorations = this.initDecorations(root);

      this.disposableCollection.push(this._activeDecorations);

      this.changesTreeModelMap.set(type, {
        treeModel: this._activeTreeModel,
        decorations: this._activeDecorations,
        selectedDecoration: this._selectedDecoration,
        focusedDecoration: this._focusedDecoration,
      });

      this.treeModel.onWillUpdate(() => {
        this.persistFileSelection(preType);
      });
    }

    this.onDidTreeModelChangeEmitter.fire(this._activeTreeModel);
  }

  private setProperIndents(isTreeMode: boolean) {
    if (isTreeMode) {
      this.baseIndent = 8;
      this.indent = 8;
    } else {
      this.baseIndent = 4;
      this.indent = 4;
    }
  }

  dispose() {
    this.disposableCollection.dispose();
  }

  initDecorations(root) {
    this._activeDecorations = new DecorationsManager(root as any);
    this._selectedDecoration = new Decoration(styles.mod_selected); // 选中态
    this._focusedDecoration = new Decoration(styles.mod_focused); // 焦点态
    this._activeDecorations.addDecoration(this.selectedDecoration);
    this._activeDecorations.addDecoration(this.focusedDecoration);
    return this._activeDecorations;
  }

  // 清空所有节点选中态
  clearFileSelectedDecoration = () => {
    this._selectedFiles.forEach((file) => {
      this.selectedDecoration.removeTarget(file);
    });
    this._selectedFiles = [];
  };

  // 清空其他选中/焦点态节点，更新当前焦点节点
  activeFileDecoration = (target: ChangeDirectory | ChangeFile, dispatchChange = true) => {
    if (this.preContextMenuFocusedFile) {
      this.focusedDecoration.removeTarget(this.preContextMenuFocusedFile);
      this.selectedDecoration.removeTarget(this.preContextMenuFocusedFile);
      this.preContextMenuFocusedFile = null;
    }
    if (target) {
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          this.selectedDecoration.removeTarget(file);
        });
      }
      if (this.focusedFile) {
        this.focusedDecoration.removeTarget(this.focusedFile);
      }
      this.selectedDecoration.addTarget(target);
      this.focusedDecoration.addTarget(target);
      this._focusedFile = target;
      this._selectedFiles = [target];

      // 通知视图更新
      if (dispatchChange) {
        this.treeModel.dispatchChange();
      }
    }
  };

  // 清空其他选中/焦点态节点，更新当前选中节点
  selectFileDecoration = (target: ChangeDirectory | ChangeFile, dispatchChange = true) => {
    if (this.preContextMenuFocusedFile) {
      this.focusedDecoration.removeTarget(this.preContextMenuFocusedFile);
      this.selectedDecoration.removeTarget(this.preContextMenuFocusedFile);
      this.preContextMenuFocusedFile = null;
    }
    if (target) {
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          this.selectedDecoration.removeTarget(file);
        });
      }
      if (this.focusedFile) {
        this.focusedDecoration.removeTarget(this.focusedFile);
      }
      this.selectedDecoration.addTarget(target);
      this._selectedFiles = [target];

      // 通知视图更新
      if (dispatchChange) {
        this.treeModel.dispatchChange();
      }
    }
  };

  // 选中当前指定节点，添加装饰器属性
  activeFileSelectedDecoration = (target: ChangeDirectory | ChangeFile) => {
    if (this._selectedFiles.indexOf(target) > -1) {
      return;
    }
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        this.selectedDecoration.removeTarget(file);
      });
    }
    this._selectedFiles = [target];
    this.selectedDecoration.addTarget(target);
    // 通知视图更新
    this.treeModel.dispatchChange();
  };

  private persistFileSelection(preType: ChangesTreeTypes) {
    const { selectedDecoration: preSelectedDecoration, focusedDecoration: preFocusedDecoration } =
      this.changesTreeModelMap.get(preType)!;

    // 切换时需要同步decoration状态，默认只取第一个选中的文件
    const file = this.selectedFiles[0];
    if (file) {
      preSelectedDecoration.removeTarget(file);
      preFocusedDecoration.removeTarget(file);

      const targetFile = this.changesTreeService.getCachedNodeItem(file.uri.toString());
      // this.selectFileDecoration(targetFile);
      // @ts-ignore
      this.activeFileDecoration(targetFile);
    }
  }

  // 取消选中节点焦点
  private enactiveFileDecoration = () => {
    if (this.focusedFile) {
      this.focusedDecoration.removeTarget(this.focusedFile);
      this.treeModel.dispatchChange();
    }
    this._focusedFile = undefined;
  };

  removeFileDecoration() {
    if (!this.decorations) {
      return;
    }
    this.decorations.removeDecoration(this.selectedDecoration);
    this.decorations.removeDecoration(this.focusedDecoration);
  }

  handleTreeHandler(handle: IEditorTreeHandle) {
    this._changeTreeHandle = handle;
  }

  handleTreeBlur = () => {
    // 清空焦点状态
    this.enactiveFileDecoration();
  };

  handleItemClick = (item: ChangeDirectory | ChangeFile, type: TreeNodeType) => {
    // 单选操作默认先更新选中状态
    this.activeFileDecoration(item);
    if (type === TreeNodeType.TreeNode) {
      this.openChangeFilesService.openFile((item as ChangeFile).change, 'changes-tree');
    } else {
      this.toggleDirectory(item as ChangeDirectory);
    }
  };

  toggleDirectory = async (item: ChangeDirectory) => {
    if (item.expanded) {
      this.changeTreeHandle.collapseNode(item);
    } else {
      this.changeTreeHandle.expandNode(item);
    }
  };

  /**
   * 刷新指定下的所有子节点
   */
  async refresh(node: ChangeDirectory = this.treeModel.root as ChangeDirectory) {
    if (!ChangeDirectory.is(node) && (node as ChangeDirectory).parent) {
      node = (node as ChangeDirectory).parent as ChangeDirectory;
    }
    // 这里也可以直接调用node.forceReloadChildrenQuiet，但由于文件树刷新事件可能会较多
    // 队列化刷新动作减少更新成本
    this.queueChangeEvent(node.path, () => {
      this.onDidRefreshedEmitter.fire();
    });
  }

  // 队列化Changed事件
  private queueChangeEvent(path: string, callback: any) {
    if (!this.flushEventQueueDeferred) {
      this.flushEventQueueDeferred = new Deferred<void>();
      clearTimeout(this._eventFlushTimeout);
      this._eventFlushTimeout = setTimeout(async () => {
        await this.flushEventQueue()!;
        this.flushEventQueueDeferred?.resolve();
        this.flushEventQueueDeferred = null;
        callback();
      }, ChangesTreeModelService.DEFAULT_FLUSH_FILE_EVENT_DELAY) as any;
    }
    if (this._changeEventDispatchQueue.indexOf(path) === -1) {
      this._changeEventDispatchQueue.push(path);
    }
  }

  public flushEventQueue = () => {
    if (!this._changeEventDispatchQueue || this._changeEventDispatchQueue.length === 0) {
      return;
    }
    this._changeEventDispatchQueue.sort((pathA, pathB) => {
      const pathADepth = Path.pathDepth(pathA);
      const pathBDepth = Path.pathDepth(pathB);
      return pathADepth - pathBDepth;
    });
    const roots = [this._changeEventDispatchQueue[0]];
    for (const path of this._changeEventDispatchQueue) {
      if (roots.some((root) => path.indexOf(root) === 0)) {
        continue;
      } else {
        roots.push(path);
      }
    }
    const promise = pSeries(
      roots.map((path) => async () => {
        const watcher = this.treeModel.root?.watchEvents.get(path);
        if (watcher && typeof watcher.callback === 'function') {
          await watcher.callback({ type: WatchEvent.Changed, path });
        }
        return null;
      })
    );
    // 重置更新队列
    this._changeEventDispatchQueue = [];
    return promise;
  };

  public closeFile = (node: ChangeFile) => {
    this.commandService.executeCommand(EDITOR_COMMANDS.CLOSE.id, node.uri);
  };
}
