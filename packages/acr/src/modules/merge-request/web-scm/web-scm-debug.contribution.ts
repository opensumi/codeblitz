import { Autowired } from '@opensumi/di';
import {
  Domain,
  CommandRegistry,
  CommandContribution,
  getIcon,
  URI,
  ClientAppContribution,
  localize,
  WithEventBus,
  IContextKeyService,
  IContextKey,
} from '@opensumi/ide-core-browser';
import { MenuContribution, IMenuRegistry, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';
import { ISCMResource, ISCMResourceGroup } from '@opensumi/ide-scm';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import * as paths from '@opensumi/ide-core-common/lib/path';

import { WebSCMCommands, IDmpService } from './common';
import { WorkspaceManagerService } from '../../workspace/workspace-loader.service';
import { IAntcodeService } from '../../antcode-service/base';
import { downloadFile } from '../../../utils/download';

const ACR_WEB_SCM_ENABLE_DOWNLOAD_DIFFS = new RawContextKey<boolean>(
  'acr.enableDownloadDiffFiles',
  false
);

/*
 * **调试模式**
 * 目前主要是增加 git diff 文件下载的功能
 */
@Domain(CommandContribution, MenuContribution, ClientAppContribution)
export class WebSCMDebugContribution
  extends WithEventBus
  implements CommandContribution, MenuContribution, ClientAppContribution
{
  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  @Autowired(WorkspaceManagerService)
  private readonly workspaceManagerService: WorkspaceManagerService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(IFileServiceClient)
  private readonly fileServiceClient: IFileServiceClient;

  @Autowired(IDmpService)
  private readonly dmpService: IDmpService;

  private readonly acrEnableDownloadDiffs: IContextKey<boolean>;

  constructor() {
    super();
    this.acrEnableDownloadDiffs = ACR_WEB_SCM_ENABLE_DOWNLOAD_DIFFS.bind(
      this.globalContextKeyService
    );
  }

  onDidStart() {
    const uri = new URI(window.location.href);
    const query = uri.getParsedQuery();
    if (query?.__ide_mode === 'debug') {
      this.acrEnableDownloadDiffs.set(true);
    }
  }

  registerMenus(menus: IMenuRegistry): void {
    menus.registerMenuItem(MenuId.SCMResourceContext, {
      command: {
        id: WebSCMCommands.DownloadDiffFile.id,
        label: localize('web-scm.downloadDiffs'),
      },
      iconClass: getIcon('download'),
      group: 'inline',
      when: ACR_WEB_SCM_ENABLE_DOWNLOAD_DIFFS.raw,
    });
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(WebSCMCommands.DownloadDiffFile, {
      execute: async (resource: ISCMResource) => {
        const uri = new URI(resource.sourceUri);
        const ret = await this.fileServiceClient.resolveContent(uri.toString());
        const modifiedContent = ret && ret.content;
        if (modifiedContent === undefined) {
          return;
        }

        const params = await this.workspaceManagerService.getParsedUriParams(uri);
        const downloadFilename = !params
          ? paths.basename(resource.sourceUri.fsPath)
          : `${params.path}_${(params.ref || '').slice(0, 6)}`;

        downloadFile(downloadFilename + '-modified.txt', modifiedContent);
      },
    });

    commands.registerCommand(
      { id: 'origin.getDiffDownload' },
      {
        execute: async (resource: ISCMResource) => {
          const uri = new URI(resource.sourceUri);
          const params = await this.workspaceManagerService.getParsedUriParams(uri);
          if (!params) {
            return;
          }
          const { ref, path } = params;
          const originalContent = await this.antcodeService.getFileContentByRef(path, ref);

          const ret = await this.fileServiceClient.resolveContent(uri.toString());
          const modifiedContent = ret && ret.content;
          if (modifiedContent === undefined) {
            return;
          }
          const diffs = this.dmpService.dmpInstance.diff_main(originalContent, modifiedContent);
          if (diffs.length < 2) {
            return;
          }

          const diffContent = diffs
            .map(([flag, change]) => {
              return flag + '  ' + change;
            })
            .join('\n');

          downloadFile(`${path}-${ref}.txt`, diffContent);
        },
      }
    );
  }
}
