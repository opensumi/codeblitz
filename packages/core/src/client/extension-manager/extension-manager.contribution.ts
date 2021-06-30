import { Autowired } from '@ali/common-di';
import { Domain, localize } from '@ali/ide-core-common';
import { getIcon } from '@ali/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@ali/ide-core-browser/lib/layout';
import { MainLayoutContribution, IMainLayoutService } from '@ali/ide-main-layout';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  ResourceService,
} from '@ali/ide-editor/lib/browser';

import { EXTENSION_SCHEME, enableExtensionsContainerId, IExtensionManagerService } from './base';
import { ExtensionResourceProvider } from './extension-resource-provider';
import ExtensionPanelView from './extension-panel.view';
import { ExtensionDetailView } from './extension-detail.view';
import { ExtensionManagerService } from './extension-manager.service';

@Domain(ComponentContribution, MainLayoutContribution, BrowserEditorContribution)
export class ExtensionManagerContribution
  implements ComponentContribution, MainLayoutContribution, BrowserEditorContribution {
  @Autowired()
  private readonly resourceProvider: ExtensionResourceProvider;

  @Autowired(IMainLayoutService)
  private readonly mainLayoutService: IMainLayoutService;

  @Autowired(IExtensionManagerService)
  private readonly extensionManagerService: ExtensionManagerService;

  registerResource(resourceService: ResourceService) {
    resourceService.registerResourceProvider(this.resourceProvider);
  }

  registerEditorComponent(editorComponentRegistry: EditorComponentRegistry) {
    const EXTENSIONS_DETAIL_COMPONENT_ID = `${EXTENSION_SCHEME}_detail`;
    editorComponentRegistry.registerEditorComponent({
      component: ExtensionDetailView,
      uid: EXTENSIONS_DETAIL_COMPONENT_ID,
      scheme: EXTENSION_SCHEME,
    });

    editorComponentRegistry.registerEditorComponentResolver(EXTENSION_SCHEME, (_, __, resolve) => {
      resolve([
        {
          type: 'component',
          componentId: EXTENSIONS_DETAIL_COMPONENT_ID,
        },
      ]);
    });
  }

  registerComponent(registry: ComponentRegistry): void {
    registry.register('@ali/ide-extension-manager', [], {
      iconClass: getIcon('extension'),
      title: localize('marketplace.extension.container'),
      priority: 5,
      containerId: enableExtensionsContainerId,
      component: ExtensionPanelView,
      activateKeyBinding: 'ctrlcmd+shift+x',
    });
  }

  onDidRender() {
    const handler = this.mainLayoutService.getTabbarHandler(enableExtensionsContainerId);
    if (handler) {
      // 在激活的时候获取数据
      handler.onActivate(() => {
        this.extensionManagerService.init();
      });
    }
  }
}
