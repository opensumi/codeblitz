import { Autowired, Injectable } from '@ali/common-di';
import { Path } from '@ali/ide-core-common/lib/path';

import { IAntcodeService, IPullRequestChangeDiff } from '../../antcode-service/base';
import { IPullRequestChangeItem } from '../../../common';

const PathSeparator = Path.separator;

export enum ChangeTreeMode {
  Tree,
  List,
}

interface TreeNode {
  name: string;
  children: TreeNode[];
}

@Injectable()
export class ChangesTreeAPI {
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  public getChangeByFilepath(filePath: string) {
    return (this.antcodeService.pullRequestChangeList as Array<IPullRequestChangeItem>).find(
      (change) => change.newPath === filePath
    );
  }

  public async init(mode: ChangeTreeMode = ChangeTreeMode.Tree) {
    if (
      !Array.isArray(this.antcodeService.pullRequestChangeList) ||
      !this.antcodeService.pullRequestChangeList.length
    ) {
      return [];
    }

    return mode === ChangeTreeMode.Tree
      ? this.pathToTree(this.antcodeService.pullRequestChangeList)
      : this.pathToList(this.antcodeService.pullRequestChangeList);
  }

  private pathToList(changes: IPullRequestChangeDiff[]) {
    return changes.map((change) => ({
      name: change.newPath,
      children: [],
      change,
    }));
  }

  private _initPlainCounterObject(key: symbol, value: Array<any>) {
    // 创建一个没有原型的对象
    // 避免文件 path 中带有 constructor/toString 等对象原型方法的 key 导致出错
    const obj = Object.create(null);
    obj[key] = value;
    return obj;
  }

  private pathToTree(changes: IPullRequestChangeDiff[]) {
    // // https://stackoverflow.com/questions/54424774/how-to-convert-an-array-of-paths-into-tree-object
    const result: Array<TreeNode> = [];
    // helper 的对象
    const kResult = Symbol('result');
    const accumulator = this._initPlainCounterObject(kResult, result);

    changes.forEach((change) => {
      const path = change.newPath;
      // 初始的 accumulator 为 level
      path.split(PathSeparator).reduce((acc, cur, index, pathList) => {
        // 每次返回 path 对应的 desc 作为下一个 path 的 parent
        // 不存在 path 对应的 desc 则创建一个新的挂载到 acc 上
        if (!acc[cur]) {
          acc[cur] = this._initPlainCounterObject(kResult, []);
          const element = {
            name: cur,
            children: acc[cur][kResult],
          };

          // 说明是文件
          if (index === pathList.length - 1) {
            (element as any).change = change;
          }
          acc[kResult].push(element);
        }
        // 返回当前 path 对应的 desc 作为下一次遍历的 parent
        return acc[cur];
      }, accumulator);
    });
    this.walkTreeToFold(result);
    return result;
  }

  private walkTreeToFold(children: TreeNode[]) {
    const stack = [...children];
    while (stack.length) {
      const item = stack.pop();
      // @ts-ignore
      this.foldOnlyChild(item);
      // @ts-ignore
      stack.push(...item.children);
    }
  }

  private foldOnlyChild(item: TreeNode) {
    // 只有一个 child 并且不为文件，文件对应的 item 的 children 为空
    while (item.children.length === 1 && item.children[0].children.length) {
      const {
        children: [{ name: childName, children }],
        name,
      } = item;
      item.name = `${name}${PathSeparator}${childName}`;
      item.children = children;
    }
  }
}
