import { Autowired } from '@opensumi/di';
import { FILE_COMMANDS, CommandContribution, CommandRegistry } from '@opensumi/ide-core-browser';
import {
  Domain,
  IReporterService,
  Deferred,
  getDebugLogger,
  URI,
  CommandService,
  localize,
  formatLocalize,
  FileChangeType,
  IDisposable,
  IEventBus,
  Command,
  MessageType,
} from '@opensumi/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  CODE_ROOT,
  IDB_ROOT,
  IServerApp,
  RuntimeConfig,
  RootFS,
} from '@alipay/alex-core';
import { IFileTreeService } from '@opensumi/ide-file-tree-next';
import { FileTreeService } from '@opensumi/ide-file-tree-next/lib/browser/file-tree.service';
import { FileTreeModelService } from '@opensumi/ide-file-tree-next/lib/browser/services/file-tree-model.service';
import { IMessageService, IDialogService } from '@opensumi/ide-overlay';
import {
  BrowserEditorContribution,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser';
import * as path from 'path';
import { QuickPickService, IQuickInputService } from '@opensumi/ide-quick-open';
import { IDiskFileProvider, FileAccess } from '@opensumi/ide-file-service';
import { DiskFsProviderClient } from '@opensumi/ide-file-service/lib/browser/file-service-provider-client';
import { MainLayoutContribution } from '@opensumi/ide-main-layout';
import configureFileSystem from './filesystem/configure';
import { CodeModelService } from './code-model.service';
import { RefType, ICodeServiceConfig, CodePlatform } from './types';
import { Configure } from './config.service';
import { ISCMRepository, SCMService, ISCMResource, ISCMResourceGroup } from '@opensumi/ide-scm';
import { CODE_PLATFORM_CONFIG, RequestFailed } from '@alipay/alex-code-api';

namespace CODE_SERVICE_COMMANDS {
  const CATEGORY = 'CodeService';

  export const CREATEBRANCH: Command = {
    id: 'code-service.createBranch',
    category: CATEGORY,
  };
  export const CREATEBRANCHFROM: Command = {
    id: 'code-service.createBranchFrom',
    category: CATEGORY,
  };
  export const CHECKOUT_BRANCH: Command = {
    id: 'code-service.checkout',
    category: CATEGORY,
    label: localize('code-service.command.checkout'),
  };
  export const REINITIALIZE: Command = {
    id: 'code-service.reinitialize',
    category: CATEGORY,
  };
}

enum PickBranch {
  CREATEBRANCH = 'createBranch',
  CREATEBRANCHFROM = 'createBranchFrom',
}
@Domain(LaunchContribution, BrowserEditorContribution, CommandContribution, MainLayoutContribution)
export class CodeContribution
  implements
    LaunchContribution,
    BrowserEditorContribution,
    CommandContribution,
    MainLayoutContribution
{
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired(IDialogService)
  dialogService: IDialogService;

  @Autowired(IReporterService)
  reporter: IReporterService;

  @Autowired(IFileTreeService)
  fileTree: FileTreeService;

  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  @Autowired(CommandService)
  commandService: CommandService;

  @Autowired(FileTreeModelService)
  fileTreeModel: FileTreeModelService;

  @Autowired(QuickPickService)
  protected quickPickService: QuickPickService;

  @Autowired(IQuickInputService)
  protected quickInputService: IQuickInputService;

  @Autowired(IDiskFileProvider)
  diskFile: DiskFsProviderClient;

  @Autowired(IEventBus)
  protected eventBus: IEventBus;

  @Autowired(ICodeServiceConfig)
  codeServiceConfig: ICodeServiceConfig;

  @Autowired(Configure)
  configure: Configure;

  @Autowired(SCMService)
  scmService: SCMService;

  private _unmount: () => void | undefined;

  private _mounting = false;

  private _disposables: IDisposable[] = [];

  private renderDefer = new Deferred<void>();

  async launch({ rootFS }: IServerApp) {
    if (!this.codeServiceConfig) return;

    this.configure.configTextSearch();
    this.configure.configFileSearch();

    let initMountDefer: Deferred<void> | null = new Deferred();
    this.codeModel.rootRepository.onDidChangeCommit(() => {
      this.mountFilesystem(rootFS).then(() => {
        if (initMountDefer) {
          initMountDefer.resolve();
          initMountDefer = null;
          return;
        }
        this.commandService.tryExecuteCommand(FILE_COMMANDS.REFRESH_ALL.id);
        // this.fileTree.refresh();
        const closes: URI[] = [];
        const changes: { uri: string; type: FileChangeType }[] = [];
        Promise.all(
          this.editorService.getAllOpenedUris().map(async (uri) => {
            if (uri.scheme !== 'file') return;
            const exists = await this.diskFile.access(uri.codeUri, FileAccess.Constants.F_OK);
            if (exists) {
              changes.push({
                uri: uri.toString(),
                type: FileChangeType.UPDATED,
              });
            } else {
              closes.push(uri);
            }
          })
        ).then(async () => {
          this.diskFile.onDidFilesChanged({ changes });
          for (const uri of closes) {
            await this.editorService.close(uri);
          }
          this.replaceModelBroswerUri();
        });
      });
    });

    if ((await this.codeModel.initialize()) === 'Failed') {
      initMountDefer = null;
      return;
    }
    await initMountDefer.promise;
  }

  replaceModelBroswerUri() {
    const { currentResource } = this.editorService;
    if (currentResource && currentResource.uri.scheme === 'file') {
      this.codeModel.replaceBrowserUrl({
        type: 'blob',
        filepath: path.relative(this.appConfig.workspaceDir, currentResource.uri.codeUri.path),
      });
    } else {
      this.codeModel.replaceBrowserUrl({
        type: 'tree',
        filepath: '',
      });
    }
  }

  async mountFilesystem(rootFS: RootFS) {
    if (this._mounting) return;
    this._mounting = true;

    const scmRepository = this.scmService.repositories[0];

    if (scmRepository && scmRepository.provider.contextValue === 'webscm') {
      // const choose = await this.dialogService.warning(formatLocalize('code-service.command.scm-checkout-info'),[formatLocalize('common.cancel'),formatLocalize('common.continue')])

      this.commandService.tryExecuteCommand('web-scm.checkout');
    }

    try {
      const { workspaceDir } = this.appConfig;

      const { codeFileSystem, idbFileSystem, overlayFileSystem } = await configureFileSystem(
        this.codeModel,
        this.runtimeConfig.scenario
      );

      this._unmount?.();

      rootFS.mount(workspaceDir, overlayFileSystem);
      // 将只读文件系统挂载到 /code 上
      rootFS.mount(CODE_ROOT, codeFileSystem);
      // 将可写文件系统挂载到 /idb
      rootFS.mount(IDB_ROOT, idbFileSystem);

      this._unmount = () => {
        rootFS.umount(workspaceDir);
        rootFS.umount(CODE_ROOT);
        rootFS.umount(IDB_ROOT);
      };
    } catch (err: any) {
      getDebugLogger().error(`[mount filesystem error]: ${err?.message || ''}`, err);
    } finally {
      this._mounting = false;
    }
  }

  onDidRestoreState() {
    const { revealEntry } = this.codeModel.rootRepository;
    if (!revealEntry?.filepath) {
      this.startOnEditorGroupChangeEvent();
      return;
    }
    const uri = URI.file(path.join(this.appConfig.workspaceDir, revealEntry.filepath));
    let wait: Promise<any> = Promise.resolve();
    if (revealEntry.type === 'blob') {
      wait = this.editorService.open(uri, {
        preview: false,
        deletedPolicy: 'fail',
      });
      wait.then(() => {
        const initHash = this.codeServiceConfig.hash;
        if (initHash) {
          this.commandService.executeCommand('code-service.set-line-hash', initHash);
        }
      });
    } else if (revealEntry.type === 'tree') {
      this.renderDefer.promise.then(() => {
        this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
      });
    }
    wait.finally(() => {
      this.startOnEditorGroupChangeEvent();
    });
  }

  registerCommands(commandRegistry: CommandRegistry) {
    this._disposables.push(
      commandRegistry.registerCommand(CODE_SERVICE_COMMANDS.CHECKOUT_BRANCH, {
        execute: async () => {
          const { rootRepository: repo } = this.codeModel;
          await repo.refsInitialized;
          const getShortCommit = (commit: string) => (commit || '').substr(0, 8);
          const createBranch: { name: string; commit: string; type: PickBranch }[] = [];
          if (CODE_PLATFORM_CONFIG[repo.platform].createBranchAble) {
            createBranch.push(
              {
                name: localize('code-service.command.create-branch'),
                commit: '',
                type: PickBranch.CREATEBRANCH,
              },
              {
                name: localize('code-service.command.create-branch-from'),
                commit: '',
                type: PickBranch.CREATEBRANCHFROM,
              }
            );
          }
          const refs = [...createBranch, ...repo.refs.branches, ...repo.refs.tags];

          const quickPickRef = refs.map((ref, index) => ({
            value: index,
            label: ref.name,
            description: `${ref.type === RefType.Tag ? 'Tag at ' : ''}${getShortCommit(
              ref.commit
            )}`,
          }));

          const value = await this.quickPickService.show([...quickPickRef], {
            placeholder: localize('code-service.select-ref-to-checkout'),
          });
          if (typeof value === 'number') {
            const target = refs[value];
            if (target.type === PickBranch.CREATEBRANCH) {
              this.commandService.executeCommand('code-service.createBranch');
              return;
            } else if (target.type === PickBranch.CREATEBRANCHFROM) {
              this.commandService.executeCommand('code-service.createBranchFrom');
              return;
            }
            if (target.commit === repo.commit) {
              if (target.name === repo.ref) {
                this.messageService.warning(localize('code-service.checkout-to-same'));
                return;
              }
            }
            this.messageService.info(formatLocalize('code-service.checkout-to', target.name));
            repo.ref = target.name;
            repo.commit = target.commit;
          }
        },
      }),

      commandRegistry.registerCommand(CODE_SERVICE_COMMANDS.REINITIALIZE, {
        execute: (isForce?: boolean) => {
          this.codeModel.reinitialize(isForce);
        },
      }),
      commandRegistry.registerCommand(CODE_SERVICE_COMMANDS.CREATEBRANCH, {
        execute: async () => {
          const { rootRepository: repo } = this.codeModel;
          const newBranchName = await this.quickInputService.open({
            placeHolder: formatLocalize('code-service.command.new-branch-name'),
          });
          const refBranches = [...repo.refs.branches];
          if (!newBranchName) {
            return;
          }
          if (!refBranches.find((b) => b.name === newBranchName)) {
            const branch = await repo.request.createBranch(newBranchName, repo.commit);
            if (branch?.commit.id) {
              this.messageService.info(
                formatLocalize('code-service.command.create-branch-success', newBranchName)
              );
              await repo.refreshRepository(branch.commit.id, branch.name);
            } else {
              this.messageService.error(
                (branch as any as RequestFailed).message ||
                  formatLocalize('code-service.command.create-branch-error', newBranchName)
              );
            }
          } else {
            this.messageService.error(
              formatLocalize('code-service.command.create-branch-error-exists', newBranchName)
            );
          }
        },
      }),
      commandRegistry.registerCommand(CODE_SERVICE_COMMANDS.CREATEBRANCHFROM, {
        execute: async () => {
          const { rootRepository: repo } = this.codeModel;
          const newBranchName = await this.quickInputService.open({
            placeHolder: formatLocalize('code-service.command.new-branch-name'),
          });
          if (!newBranchName) {
            return;
          }
          if (repo.refs.branches.find((b) => b.name === newBranchName)) {
            this.messageService.error(
              formatLocalize('code-service.command.create-branch-error-exists', newBranchName)
            );
            return;
          }
          const getShortCommit = (commit: string) => (commit || '').substr(0, 8);
          const refs = [...repo.refs.branches, ...repo.refs.tags];
          const quickPickRef = refs.map((ref, index) => ({
            value: index,
            label: ref.name,
            description: `${ref.type === RefType.Tag ? 'Tag at ' : ''}${getShortCommit(
              ref.commit
            )}`,
          }));
          const value = await this.quickPickService.show([...quickPickRef], {
            placeholder: localize(
              'code-service.command.select-ref-to-create-branch',
              newBranchName
            ),
          });
          if (typeof value === 'number') {
            const target = refs[value];
            const branch = await repo.request.createBranch(newBranchName, target.commit);
            if (branch?.commit.id) {
              this.messageService.info(
                formatLocalize('code-service.command.create-branch-success', newBranchName)
              );
              await repo.refreshRepository(branch.commit.id, branch.name);
            } else {
              this.messageService.error(
                (branch as any as RequestFailed).message ||
                  formatLocalize('code-service.command.create-branch-error', newBranchName)
              );
            }
          }
        },
      })
    );
  }

  startOnEditorGroupChangeEvent() {
    this._disposables.push(
      this.editorService.onActiveResourceChange((resource) => {
        if (resource?.uri.scheme === 'welcome') {
          return;
        }
        if (
          resource &&
          resource.uri.scheme === 'file' &&
          ['code', 'diff'].includes(
            this.editorService.currentEditorGroup?.currentOpenType?.type ?? ''
          ) &&
          resource.uri.codeUri.path.startsWith(this.appConfig.workspaceDir)
        ) {
          this.codeModel.replaceBrowserUrl({
            type: 'blob',
            filepath: path.relative(this.appConfig.workspaceDir, resource.uri.codeUri.path),
          });
        } else {
          this.codeModel.replaceBrowserUrl({ type: 'tree', filepath: '' });
        }
      })
    );
  }

  onDidRender() {
    this.renderDefer.resolve();
  }

  dispose() {
    this._unmount?.();
    this._disposables.forEach((disposer) => disposer.dispose());
  }
}
