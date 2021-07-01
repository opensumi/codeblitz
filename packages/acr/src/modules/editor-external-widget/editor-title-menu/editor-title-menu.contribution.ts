import { Domain } from '@ali/ide-core-browser';
import { MenuContribution, IMenuRegistry, MenuId } from '@ali/ide-core-browser/lib/menu/next';

import { CommentFilter } from '../../comments/comment-filter.view';
import { EncodingSelect } from '../../merge-request/changes-tree/components/encoding-select';
import { ComponentMenuGroupDivider } from './component-group-divider';

@Domain(MenuContribution)
export class EditorTitleMenuContribution implements MenuContribution {
  registerMenus(menus: IMenuRegistry): void {
    menus.registerMenuItems(MenuId.EditorTitle, [
      {
        component: ComponentMenuGroupDivider,
        order: 100,
        group: 'navigation',
        when: 'resourceScheme =~ /^git$|^diff$/',
      },
      {
        component: CommentFilter,
        order: 100,
        group: 'navigation',
        when: 'resourceScheme =~ /^git$|^diff$/',
      },
      {
        component: EncodingSelect,
        order: 100,
        group: 'navigation',
        when: 'resourceScheme =~ /^git$|^diff$/',
      },
    ]);
  }
}
