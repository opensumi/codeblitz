import { Domain, URI, localize } from '@ali/ide-core-browser';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  EditorComponentRenderMode,
} from '@ali/ide-editor/lib/browser';
import { LabelService } from '@ali/ide-core-browser/lib/services';
import { ResourceService, IResource, WorkbenchEditorService } from '@ali/ide-editor';
import { IIconService, IconType } from '@ali/ide-theme';
import { Autowired } from '@ali/common-di';
import { IWorkspaceService } from '@ali/ide-workspace';
import { RuntimeConfig, AppConfig } from '@alipay/alex-core';
import { EditorWelcomeComponent } from './welcome.view';
import { CommonConfig } from '../../common/config';
import styles from './welcome.module.less';
import * as path from 'path';

@Domain(BrowserEditorContribution)
export class WelcomeContribution implements BrowserEditorContribution {
  @Autowired(IWorkspaceService)
  workspaceService: IWorkspaceService;

  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  @Autowired(LabelService)
  labelService: LabelService;

  @Autowired(IIconService)
  iconService: IIconService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorComponent({
      uid: 'welcome',
      component: EditorWelcomeComponent,
      renderMode: EditorComponentRenderMode.ONE_PER_WORKBENCH,
    });

    registry.registerEditorComponentResolver('welcome', (_resource, results) => {
      results.push({
        type: 'component',
        componentId: 'welcome',
      });
    });
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider({
      scheme: 'welcome',
      provideResource: async (uri: URI): Promise<IResource> => {
        const iconClass = this.iconService.fromIcon('', CommonConfig.icon, IconType.Background);
        return {
          uri,
          name: localize('menu.help.welcome'),
          icon: `${iconClass} ${styles.tabIcon}`,
        };
      },
    });
  }

  onDidRestoreState() {
    const { defaultOpenFile } = this.runtimeConfig;
    if (defaultOpenFile) {
      const openFile = Array.isArray(defaultOpenFile) ? defaultOpenFile : [defaultOpenFile];
      openFile.forEach((file) => {
        this.editorService.open(URI.file(path.join(this.appConfig.workspaceDir, file)), {
          preview: false,
        });
      });
    } else if (!this.editorService.getAllOpenedUris().length) {
      this.editorService.open(new URI('welcome://'), {
        preview: false,
      });
    }
  }
}
