import { Autowired } from '@opensumi/di';
import {
  Domain,
  CommandRegistry,
  CommandService,
  CommandContribution,
  getIcon,
  EDITOR_COMMANDS,
  URI,
  ClientAppContribution,
  localize,
  WithEventBus,
  OnEvent,
  IContextKeyService,
  IContextKey,
} from '@opensumi/ide-core-browser';
import { IFileServiceClient } from '@opensumi/ide-file-service/lib/common';
import * as paths from '@opensumi/ide-core-common/lib/path';
import { MenuContribution, IMenuRegistry, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';
import { ISCMResource, ISCMResourceGroup } from '@opensumi/ide-scm';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import {
  IEditorDocumentModelService,
  EditorDocumentModelSavedEvent,
} from '@opensumi/ide-editor/lib/browser/doc-model/types';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { EditorGroupOpenEvent } from '@opensumi/ide-editor/lib/browser';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';

import { WebSCMCommands, WebSCMViewId } from './common';
import { fromDiffUri, fromGitUri, isChangeFileURI } from '../changes-tree/util';

import { WebSCMController } from './web-scm.controller';
import { IAntcodeService } from '../../antcode-service/base';
import { reportSaveOperation, reportEditOperation } from '../../../utils/monitor';
import { WorkspaceManagerService } from '../../workspace/workspace-loader.service';
import { runInBackground } from '../../../utils';

const ACR_CHANGE_FILE_EDITABLE = new RawContextKey<boolean>('acr.changeFileEditable', false);

@Domain(CommandContribution, MenuContribution, ClientAppContribution)
export class WebSCMContribution
  extends WithEventBus
  implements CommandContribution, MenuContribution, ClientAppContribution
{
  @Autowired(CommandService)
  private readonly commandService: CommandService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorServiceImpl;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IEditorDocumentModelService)
  private readonly editorDocModelService: IEditorDocumentModelService;

  @Autowired(IFileServiceClient)
  private readonly fileServiceClient: IFileServiceClient;

  @Autowired()
  private readonly webSCMController: WebSCMController;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(WorkspaceManagerService)
  private readonly workspaceManagerService: WorkspaceManagerService;

  private readonly acrChangeFileEditable: IContextKey<boolean>;

  private _editableForCommit = false;
  private get editableForCommit(): boolean {
    return this._editableForCommit;
  }
  private set editableForCommit(bool: boolean) {
    this._editableForCommit = bool;
    this.updateAcrChangeFileEditable();
  }
  private _editableForResource = false;
  private get editableForResource() {
    return this._editableForResource;
  }
  private set editableForResource(bool: boolean) {
    this._editableForResource = bool;
    this.updateAcrChangeFileEditable();
  }

  constructor() {
    super();
    this.acrChangeFileEditable = ACR_CHANGE_FILE_EDITABLE.bind(this.globalContextKeyService);
  }

  onDidStart() {
    this.webSCMController.init();
    this.initRefChangeEvent();
  }

  // 类似投票机制，只有都符合编辑才能认为可编辑
  updateAcrChangeFileEditable() {
    this.acrChangeFileEditable.set(this.editableForCommit && this.editableForResource);
  }

  initRefChangeEvent() {
    const { antcodeService } = this;
    const listener = () => {
      this.editableForCommit = antcodeService.latestCommitSha === antcodeService.rightRef;
    };
    this.addDispose([
      antcodeService.onDidRefChange(listener),
      antcodeService.onDidLatestCommitShaChange(listener),
    ]);
    listener();
  }

  @OnEvent(EditorDocumentModelSavedEvent)
  onDocumentModelSaved(e: EditorDocumentModelSavedEvent) {
    const uri = e.payload;
    // 确保保存的文件进到 web-scm
    if (uri.scheme !== 'file') {
      return;
    }
    this.webSCMController.gitClient?.addFile(uri);
  }

  @OnEvent(EditorGroupOpenEvent)
  onEditorGroupOpen(e: EditorGroupOpenEvent) {
    const { resource, group } = e.payload;
    if (resource && resource.uri.scheme === 'diff') {
      // 打开为 diff 协议时，若右侧为 file 协议则将其更新为 readOnly 模式
      const { right } = fromDiffUri(resource.uri);
      if (right.scheme === 'file') {
        group.diffEditor.modifiedEditor.updateOptions({ readOnly: true });
      }
    }

    // 判断打开的变更文件是否可编辑
    if (resource && this.isCurrentChangeFileEditable(resource.uri)) {
      this.editableForResource = true;
    } else {
      this.editableForResource = false;
    }
  }

  private isCurrentChangeFileEditable(uri: URI) {
    const query = uri.getParsedQuery();
    if (isChangeFileURI(uri)) {
      const newPath = query && query.newPath;
      return this.antcodeService.isPullRequestChange(newPath);
    }

    return false;
  }

  registerMenus(menus: IMenuRegistry): void {
    menus.registerMenuItem(MenuId.EditorTitle, {
      command: {
        id: WebSCMCommands.Edit.id,
        label: localize('web-scm.edit'),
      },
      iconClass: getIcon('open'),
      type: 'primary',
      group: 'navigation',
      when: `resourceScheme == git`,
      enabledWhen: 'acr.changeFileEditable',
      order: 7,
    });

    menus.registerMenuItem(MenuId.EditorTitle, {
      command: {
        id: WebSCMCommands.Save.id,
        label: localize('web-scm.save'),
      },
      type: 'primary',
      group: 'navigation',
      when: '!isInDiffEditor && resourceScheme == file',
    });

    menus.registerMenuItem(MenuId.ViewTitle, {
      command: {
        id: WebSCMCommands.Refresh.id,
        label: localize('web-scm.refresh'),
      },
      iconClass: getIcon('refresh'),
      group: 'navigation',
      when: `view == ${WebSCMViewId}`,
    });

    menus.registerMenuItem(MenuId.SCMInput, {
      command: {
        id: WebSCMCommands.CommitAndPush.id,
        label: localize('web-scm.commitAndPush'),
      },
      group: 'navigation',
      // enabledWhen: `webScmResourceCount != 0`
    });

    menus.registerMenuItem(MenuId.SCMResourceContext, {
      command: {
        id: WebSCMCommands.OpenFile.id,
        label: localize('web-scm.openFile'),
      },
      iconClass: getIcon('open'),
      group: 'inline',
    });

    menus.registerMenuItem(MenuId.SCMResourceContext, {
      command: {
        id: WebSCMCommands.DiscardChanges.id,
        label: localize('web-scm.discardChanges'),
      },
      iconClass: getIcon('rollback'),
      group: 'inline',
    });

    menus.registerMenuItem(MenuId.SCMResourceGroupContext, {
      command: {
        id: WebSCMCommands.DiscardAllChanges.id,
        label: localize('web-scm.discardAllChanges'),
      },
      iconClass: getIcon('rollback'),
      group: 'inline',
    });
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(WebSCMCommands.Edit, {
      execute: async (uri: URI) => {
        let targetUri: URI;
        if (uri.scheme === 'diff') {
          const { right } = fromDiffUri(uri);
          targetUri = right;
        } else {
          targetUri = uri;
        }

        if (targetUri.scheme !== 'git') {
          return;
        }

        // 编辑按钮一般出现在 diff 视图打开时会出现，此时可以直接从 编辑器中去获取文本内容
        // FIXME: 可能存在编码不一致问题
        const docRef = this.editorDocModelService.getModelReference(targetUri);
        if (!docRef || !docRef.instance) {
          return;
        }

        const { ref, path } = fromGitUri(targetUri);

        // 操作行为数据上报
        reportEditOperation('editor-title-btn', path, {
          projectId: this.antcodeService.projectPath,
          prId: this.antcodeService.pullRequest?.iid,
          commitId: ref,
        });

        const [root] = await this.workspaceService.roots;

        // FIXME: 要判断 ref 是不是最新的版本才能开始编辑
        const targetFileUri = URI.file(paths.resolve(new URI(root.uri).codeUri.fsPath, path));

        // {workspaceDir}/{ref}/{path}
        // await ensureDir(targetFileUri.path.dir.toString());

        const content = docRef.instance.getText();
        // TODO: 走 fs file client
        // get content by document content manager
        const uriStr = targetFileUri.toString();
        let fsStat = await this.fileServiceClient.getFileStat(uriStr);
        // 未修改过的文件直接 set 内容
        if (!fsStat) {
          fsStat = await this.fileServiceClient.createFile(uriStr);
          await this.fileServiceClient.setContent(fsStat, content);
        } else if (this.webSCMController.gitClient) {
          // 在文件没有发生变更时，直接用新的内容，以避免 gbk 编码切换的显示问题
          // https://baiyan.antfin.com/task/86432
          await this.webSCMController.gitClient.status();
          const stagedFiles = this.webSCMController.gitClient.getStagedFileUriStrs();
          if (!stagedFiles.includes(uriStr)) {
            console.log('use latest content for:', uriStr);
            await this.fileServiceClient.setContent(fsStat, content);
          }
        }

        await this.workbenchEditorService.open(targetFileUri);
      },
    });

    commands.registerCommand(WebSCMCommands.Refresh, {
      execute: () => {
        const gitClient = this.webSCMController.gitClient;
        if (gitClient) {
          return gitClient.status();
        }
      },
    });

    commands.registerCommand(WebSCMCommands.DiscardChanges, {
      execute: async (resource: ISCMResource) => {
        const gitClient = this.webSCMController.gitClient;
        if (gitClient) {
          return gitClient.discardChanges(resource);
        }
      },
    });

    commands.registerCommand(WebSCMCommands.DiscardAllChanges, {
      execute: async (resourceGroup: ISCMResourceGroup) => {
        const gitClient = this.webSCMController.gitClient;
        if (gitClient) {
          return gitClient.discardAllChanges(resourceGroup);
        }
      },
    });

    commands.registerCommand(WebSCMCommands.OpenFile, {
      execute: async (resource: ISCMResource) => {
        const fileUri = new URI(resource.sourceUri);

        runInBackground(async () => {
          const { ref = '', path = '' } =
            (await this.workspaceManagerService.getParsedUriParams(fileUri)) || {};

          // 操作行为数据上报
          reportEditOperation('scm-resource-inline-open-file', path, {
            projectId: this.antcodeService.projectPath,
            prId: this.antcodeService.pullRequest?.iid,
            commitId: ref,
          });
        });

        await this.workbenchEditorService.open(fileUri);
      },
    });

    commands.registerCommand(WebSCMCommands.CommitAndPush, {
      execute: async (provider, commitMsg: string) => {
        const gitClient = this.webSCMController.gitClient;
        if (!gitClient) {
          return;
        }

        await gitClient.status();
        await gitClient.commitAndPush(commitMsg);
      },
    });

    commands.registerCommand(WebSCMCommands.Save, {
      execute: async (uri: URI) => {
        if (uri.scheme !== 'file') {
          return;
        }
        reportSaveOperation('save-btn', uri.toString(), {
          projectId: this.antcodeService.projectPath,
          prId: this.antcodeService.pullRequest?.iid,
        });

        await this.commandService.executeCommand(EDITOR_COMMANDS.SAVE_URI.id, uri);
      },
    });

    this.addDispose(
      commands.beforeExecuteCommand((commandId: string, args: any[]) => {
        // 记录保存文件的数据上报
        if (commandId === EDITOR_COMMANDS.SAVE_CURRENT.id) {
          const uriStr = this.workbenchEditorService.currentEditor
            ? this.workbenchEditorService.currentEditorGroup?.currentResource?.uri?.toString()
            : '';
          reportSaveOperation('keybinding', uriStr!, {
            projectId: this.antcodeService.projectPath,
            prId: this.antcodeService.pullRequest?.iid,
          });
        }

        // 将原始参数返回
        return args;
      })
    );
  }
}
