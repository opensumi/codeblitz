import { getIcon } from '@ali/ide-core-browser';

export const ChangesTreeViewId = 'changes-tree';

export class ChangesTreeCommands {
  static ToggleTree = {
    id: 'changes-tree.toggleTree',
    iconClass: getIcon('tree'),
  };

  static ExpandTree = {
    id: 'changes-tree.expandTree',
    iconClass: getIcon('expand-all'),
  };

  static CollapseTree = {
    id: 'changes-tree.collapseTree',
    iconClass: getIcon('collapse-all'),
  };

  static IgnoreSpace = {
    id: 'changes-tree.ignoreSpace',
    iconClass: getIcon('ignore-space'),
  };

  static ExpandFile = {
    id: 'misc.expandFile',
  };

  static GotoPreviousChange = {
    id: 'codereview.change.previous',
  };

  static GotoNextChange = {
    id: 'codereview.change.next',
  };
}
