import { Autowired } from '@opensumi/di';
import { arrays, CommandService, Domain, localize, URI } from '@opensumi/ide-core-browser';
import { LabelService } from '@opensumi/ide-core-browser/lib/services';
import { EditorOpenType, IResource, ResourceService, WorkbenchEditorService } from '@opensumi/ide-editor';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  EditorComponentRenderMode,
} from '@opensumi/ide-editor/lib/browser';
import { IFileServiceClient } from '@opensumi/ide-file-service/lib/common';
import { IconType, IIconService } from '@opensumi/ide-theme';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { AppCommonConfig, AppConfig, RuntimeConfig } from '../../common';
import { EditorWelcomeComponent } from './welcome.view';

import * as path from 'path';
import styles from './welcome.module.less';

const { coalesce } = arrays;

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
  appConfig: AppConfig & AppCommonConfig;

  @Autowired(IFileServiceClient)
  fileServiceClient: IFileServiceClient;

  @Autowired(CommandService)
  commandService: CommandService;

  registerEditorComponent(registry: EditorComponentRegistry) {
    const welcomePage = this.runtimeConfig.WelcomePage;
    registry.registerEditorComponent({
      uid: 'welcome',
      component: welcomePage ? welcomePage : EditorWelcomeComponent,
      renderMode: EditorComponentRenderMode.ONE_PER_WORKBENCH,
    });

    registry.registerEditorComponentResolver('welcome', (_resource, results) => {
      results.push({
        type: EditorOpenType.component,
        componentId: 'welcome',
      });
    });
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider({
      scheme: 'welcome',
      provideResource: async (uri: URI): Promise<IResource> => {
        const iconClass = this.iconService.fromIcon('', this.appConfig.app?.icon, IconType.Background);
        return {
          uri,
          name: localize('menu.help.welcome'),
          icon: this.runtimeConfig.WelcomePage
            ? `${styles.tabIcon}`
            : `${iconClass} ${styles.tabIcon}`,
        };
      },
    });
  }

  onDidRestoreState() {
    const { defaultOpenFile, startupEditor } = this.runtimeConfig;
    if (!this.editorService.getAllOpenedUris().length && startupEditor) {
      if (startupEditor === 'readme') {
        this.openReadme();
      } else if (startupEditor === 'welcomePage') {
        this.openWelcome();
      }
      return;
    }
    if (defaultOpenFile) {
      const openFile = Array.isArray(defaultOpenFile) ? defaultOpenFile : [defaultOpenFile];
      openFile.forEach((file, i) => {
        this.editorService.open(URI.file(path.join(this.appConfig.workspaceDir, file)), {
          preview: false,
          backend: i < openFile.length - 1,
        });
      });
    } else if (!this.editorService.getAllOpenedUris().length) {
      this.openWelcome();
    }
  }

  async openReadme() {
    const roots = await this.workspaceService.roots;
    const readmes = coalesce(
      await Promise.all(
        roots.map(async (root) => {
          const folderStat = await this.fileServiceClient
            .getFileStat(root.uri)
            .catch(() => undefined);
          const files = folderStat?.children
            ? folderStat.children
              .map((child) => {
                const uri = new URI(child.uri);
                return {
                  uri,
                  name: uri.displayName,
                };
              })
              .sort((x, y) => x.name.localeCompare(y.name))
            : [];
          const file = files.find((file) => file.name.toLowerCase() === 'readme.md')
            || files.find((file) => file.name.toLowerCase().startsWith('readme'));
          if (file) {
            return file.uri;
          }
        }),
      ),
    );

    if (readmes.length) {
      const isMarkDown = (readme: URI) => readme.codeUri.path.toLowerCase().endsWith('.md');
      await Promise.all([
        this.commandService.executeCommand(
          'markdown.showPreview',
          null,
          readmes.filter(isMarkDown),
          { locked: true },
        ),
        this.editorService.openUris(readmes.filter((readme) => !isMarkDown(readme))),
      ]);
    } else {
      this.openWelcome();
    }
  }

  openWelcome() {
    this.editorService.open(new URI('welcome://'), {
      preview: false,
    });
  }
}
