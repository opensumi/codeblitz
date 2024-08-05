import { Autowired } from '@opensumi/di';
import { ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser';
import { Domain } from '@opensumi/ide-core-common';
import { TabbarRightExtraContentId } from '@opensumi/ide-editor';
import { IDiffViewerProps } from '../common';

@Domain(ComponentContribution)
export class DiffViewerComponentContribution implements ComponentContribution {
  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  registerComponent(registry: ComponentRegistry) {
    if (this.diffViewerProps.tabBarRightExtraContent) {
      registry.register(TabbarRightExtraContentId, {
        id: TabbarRightExtraContentId,
        component: this.diffViewerProps.tabBarRightExtraContent.component,
        initialProps: this.diffViewerProps.tabBarRightExtraContent.initialProps,
      });
    }
  }
}
