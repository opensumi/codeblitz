import { Autowired } from '@opensumi/di';
import {
  ClientAppContribution,
  CommandContribution,
  CommandRegistry,
  Domain,
  getIcon,
  IPreferenceSettingsService,
  localize,
  TabBarToolbarContribution,
  ToolbarRegistry,
  IRange,
} from '@opensumi/ide-core-browser';
import { IMenuRegistry, MenuId, MenuContribution } from '@opensumi/ide-core-browser/lib/menu/next';
import { PreferenceScope, Disposable } from '@opensumi/ide-core-common';

import { IAntcodeService } from '../../antcode-service/base';
import { OpenChangeFilesService } from '../../open-change-files';
import { ChangesTreeModelService } from './changes-tree-model.service';
import { ChangesTreeService } from './changes-tree.service';
import { ChangesTreeCommands, ChangesTreeViewId } from './common';
import { reportWarmBoot, reportCoolBoot } from '../../../utils/monitor';
import { isFirstRendered, markFirstRendered } from '../../../rendered-marker';
import {
  BrowserEditorContribution,
  IEditorFeatureRegistry,
} from '@opensumi/ide-editor/lib/browser';
import { isChangeFileURI } from './util';

@Domain(
  CommandContribution,
  TabBarToolbarContribution,
  ClientAppContribution,
  BrowserEditorContribution,
  MenuContribution
)
export class ChangesTreeContribution
  extends Disposable
  implements
    CommandContribution,
    TabBarToolbarContribution,
    ClientAppContribution,
    BrowserEditorContribution,
    MenuContribution
{
  @Autowired()
  private readonly changesTreeModelService: ChangesTreeModelService;

  @Autowired()
  private readonly changeTreeService: ChangesTreeService;

  @Autowired(IPreferenceSettingsService)
  private readonly preferenceSettings: IPreferenceSettingsService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired()
  private readonly openChangeFilesService: OpenChangeFilesService;

  constructor() {
    super();
  }

  registerEditorFeature(registry: IEditorFeatureRegistry) {
    registry.registerEditorFeatureContribution({
      contribute: () => {
        return Disposable.NULL;
      },
      provideEditorOptionsForUri: async (uri) => {
        if (!isChangeFileURI(uri)) {
          return {};
        }

        // 查看变更文件时，去掉编辑器顶部的大空白
        return {
          scrollBeyondLastLine: false,
        };
      },
    });
  }

  async onDidStart() {
    const [pullRequestChange] = this.antcodeService.pullRequestChangeList;
    if (pullRequestChange) {
      this.openChangeFilesService.openFile(pullRequestChange, 'auto-open');

      // 做首次打开表更文件第一个文件时的启动速度采集
      if (isFirstRendered()) {
        reportCoolBoot(performance.now() - this.antcodeService.renderStart);
        // 标记开始初次渲染
        markFirstRendered();
      } else {
        reportWarmBoot(performance.now() - this.antcodeService.renderStart);
      }
    }

    // 当 ref 变化时打开首个变更文件
    this.addDispose(
      this.antcodeService.onDidDiffsChange(() => {
        const [pullRequestChange] = this.antcodeService.pullRequestChangeList;
        if (pullRequestChange) {
          this.openChangeFilesService.openFile(pullRequestChange, 'auto-open');
        }
      })
    );
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(ChangesTreeCommands.ToggleTree, {
      execute: () => {
        this.changeTreeService.toggleTreeMode();
      },
    });

    commands.registerCommand(ChangesTreeCommands.ExpandTree, {
      execute: () => {
        if (!this.changeTreeService.isTreeMode) {
          return;
        }
        // 展开全部节点
        this.changesTreeModelService.expandAll();
      },
    });

    commands.registerCommand(ChangesTreeCommands.CollapseTree, {
      execute: () => {
        if (!this.changeTreeService.isTreeMode) {
          return;
        }
        // 折叠全部节点
        this.changesTreeModelService.collapseAll();
      },
    });

    commands.registerCommand(ChangesTreeCommands.IgnoreSpace, {
      execute: () => {
        const settingField = 'diffEditor.ignoreTrimWhitespace';
        const value = !!this.preferenceSettings.getPreference(settingField, PreferenceScope.User)
          .value as boolean;
        return this.preferenceSettings.setPreference(settingField, !value, PreferenceScope.User);
      },
    });

    commands.registerCommand(
      {
        id: ChangesTreeCommands.OpenFile.id,
      },
      {
        execute: async (fileChange, range?: Partial<IRange> & { original?: boolean }) => {
          this.openChangeFilesService.openFile(fileChange, 'changes-tree', range);
        },
      }
    );
  }

  registerMenus(menus: IMenuRegistry): void {
    menus.registerMenuItem(MenuId.EditorTitle, {
      command: {
        id: ChangesTreeCommands.IgnoreSpace.id,
        label: localize('misc.diffEditor.ignoreTrimWhitespace'),
      },
      iconClass: getIcon('ignore-space'),
      group: 'navigation',
      when: 'isInDiffEditor',
      toggledWhen: 'config.diffEditor.ignoreTrimWhitespace',
      order: 4,
    });

    menus.registerMenuItem(MenuId.EditorTitle, {
      command: {
        id: ChangesTreeCommands.ExpandFile.id,
        label: localize('misc.expandFile'),
      },
      iconClass: getIcon('file-expand'),
      group: 'navigation',
      when: 'isInDiffEditor && config.acr.foldingEnabled && !misc.isDiffData',
      toggledWhen: 'config.misc.isExpand',
      order: 5,
    });
  }

  registerToolbarItems(registry: ToolbarRegistry) {
    registry.registerItem({
      id: ChangesTreeCommands.ToggleTree.id,
      command: ChangesTreeCommands.ToggleTree.id,
      viewId: ChangesTreeViewId,
      label: localize('codereview.tree.showTreeModel', 'treeMode'),
      toggledWhen: 'changes-tree-mode',
      order: 4,
    });

    // 被改坏了，先不加了
    registry.registerItem({
      id: ChangesTreeCommands.ExpandTree.id,
      command: ChangesTreeCommands.ExpandTree.id,
      viewId: ChangesTreeViewId,
      label: localize('changes.tree.expandAll'),
      when: `view == ${ChangesTreeViewId} && changes-tree-mode`,
      order: 1,
    });

    registry.registerItem({
      id: ChangesTreeCommands.CollapseTree.id,
      command: ChangesTreeCommands.CollapseTree.id,
      viewId: ChangesTreeViewId,
      label: localize('changes.tree.collapseAll'),
      when: `view == ${ChangesTreeViewId} && changes-tree-mode`,
      order: 2,
    });
  }
}
