import { Autowired } from '@opensumi/di';
import {
  AppConfig,
  ClientAppContribution,
  CommandRegistry,
  ComponentRegistry,
  SlotLocation,
} from '@opensumi/ide-core-browser';
import { Domain } from '@opensumi/ide-core-common';
import { IMainLayoutService } from '@opensumi/ide-main-layout';

@Domain(ClientAppContribution)
// TODO 组件卸载重新渲染 渲染时注册container 会有时序问题 临时修复
export class LayoutRestoreContributation implements ClientAppContribution {
  @Autowired(AppConfig)
  private appConfig: AppConfig;
  @Autowired(IMainLayoutService)
  layoutService: IMainLayoutService;
  @Autowired(ComponentRegistry)
  componentRegistry: ComponentRegistry;
  async onDidStart() {
    const layoutConfig = this.appConfig.layoutConfig;
    const layoutDirection = [SlotLocation.left, SlotLocation.bottom, SlotLocation.right];
    layoutDirection.forEach((direction) => {
      const tabbarService = this.layoutService.getTabbarService(direction);
      layoutConfig[direction]?.modules?.forEach((module) => {
        const componentRegistry = this.componentRegistry.getComponentRegistryInfo(module);
        if (componentRegistry) {
          tabbarService.registerContainer(
            componentRegistry.options!.containerId,
            componentRegistry,
          );
        }
      });
      // @ts-ignore
      this.layoutService.restoreTabbarService(tabbarService);
    });
  }
}
