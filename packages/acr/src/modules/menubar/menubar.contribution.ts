import { Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@ali/ide-core-browser/lib/layout';

import { MenuBarId } from './index';
import { CustomMenubar } from './custom-menubar';
import { IAntcodeService } from '../antcode-service/base';

@Domain(ComponentContribution)
export class MenubarContribution implements ComponentContribution {
  // MR Explorer 只注册容器
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      MenuBarId,
      {
        id: MenuBarId,
        component: CustomMenubar as any, // FIXME: 框架里面这里的类型写的不对
      },
      { size: 44 }
    );
  }
}
