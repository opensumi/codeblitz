import { localize, View } from '@opensumi/ide-core-browser';
import { ChangesTreeView } from './changes-tree.view';
import { ChangesTreeViewId } from './common';

export const ChangeTreeView: View = {
  id: ChangesTreeViewId,
  name: '%changes.tree.title%',
  weight: 5,
  priority: 10,
  collapsed: true,
  component: ChangesTreeView,
};
