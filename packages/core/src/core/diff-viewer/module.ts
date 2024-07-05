import { isFilesystemReady, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { AppConfig, BrowserModule, ClientAppContribution, IClientApp } from '@opensumi/ide-core-browser';
import { CommandContribution, Domain, MaybePromise, URI } from '@opensumi/ide-core-common';
import { IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { requireModule } from '../../api/require';
import { Autowired, Injectable } from '../../modules/opensumi__common-di';
import { IDiffViewerProps } from './common';
import { DiffViewerService } from './diff-viewer-service';

const fse = requireModule('fs-extra');
const path = requireModule('path');

@Domain(CommandContribution, ClientAppContribution)
export class DiffViewerContribution implements CommandContribution, ClientAppContribution {
  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(DiffViewerService)
  protected diffViewerService: DiffViewerService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  async initialize(app: IClientApp): Promise<void> {
    await isFilesystemReady();
    console.log('DiffViewerContribution initialize');
    this.diffViewerProps.onRef({
      openDiffInTab: async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
        const fullPath = this.getFullPath(filePath);
        await fse.writeFile(fullPath, oldContent);
        await this.workbenchEditorService.open(URI.file(fullPath), {
          ...options,
          preview: false,
        });
        // get editor
        // create diff widget
      },
      closeFile: async (filePath) => {
        await this.workbenchEditorService.close(URI.file(this.getFullPath(filePath)), false);
      },
      onPartialEditEvent(fn) {},
      getFileContent: async (filePath: string) => {
        const fullPath = this.getFullPath(filePath);
        return await fse.readFile(fullPath, 'utf-8');
      },
      acceptAllPartialEdit: async () => {},
      rejectAllPartialEdit: async () => {},
    });
  }
  registerCommands() {
  }
}

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
  ];
}
