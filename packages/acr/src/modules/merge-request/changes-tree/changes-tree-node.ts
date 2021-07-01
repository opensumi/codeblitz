import { URI } from '@ali/ide-core-browser';
import { TreeNode, CompositeTreeNode, ITree } from '@ali/ide-components';
import { ChangesTreeService } from './changes-tree.service';
import { IPullRequestChangeDiff } from '../../antcode-service/base';

export class ChangeFileRoot extends CompositeTreeNode {
  static is(node: ChangeDirectory | ChangeFileRoot): node is ChangeFileRoot {
    return !!node && !node.parent;
  }

  get name() {
    return `ChangesTree_${this.isTree ? 'Tree' : 'List'}_${this.id}`;
  }

  constructor(tree: ChangesTreeService, public raw: any, private readonly isTree?: boolean) {
    super(tree as ITree, undefined);
  }

  get expanded() {
    return true;
  }

  dispose() {
    super.dispose();
  }
}

export class ChangeDirectory extends CompositeTreeNode {
  public static is(node: ChangeDirectory | ChangeFile): node is ChangeDirectory {
    return (
      CompositeTreeNode.is(node) && Array.isArray(node.raw.children) && node.raw.children.length
    );
  }

  constructor(
    tree: ChangesTreeService,
    public raw: any,
    // @ts-ignore
    public readonly parent: CompositeTreeNode | undefined,
    public uri: URI = new URI(''),
    // @ts-ignore
    public name: string = ''
  ) {
    super(tree as ITree, parent, undefined, { name });
    // 目录节点默认全部展开
    this.setExpanded(false, true);
  }
}

export class ChangeFile extends TreeNode {
  public static is(node: ChangeDirectory | ChangeFile): node is ChangeFile {
    return TreeNode.is(node) && (!Array.isArray(node.raw.children) || !node.raw.children.length);
  }

  constructor(
    tree: ChangesTreeService,
    public raw: any,
    // @ts-ignore
    public readonly parent: CompositeTreeNode | undefined,
    public uri: URI = new URI(''),
    // @ts-ignore
    public name: string = '',
    public change: IPullRequestChangeDiff,
    public desc: string = ''
  ) {
    // @ts-ignore
    super(tree as ITree, parent, undefined, { name });
  }
}
