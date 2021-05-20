import { Autowired } from '@ali/common-di';
import {
  FILE_COMMANDS,
  CommandContribution,
  CommandRegistry,
  ClientAppContribution,
} from '@ali/ide-core-browser';
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
  WithEventBus,
  IDisposable,
  IEventBus,
} from '@ali/ide-core-common';
import {
  LaunchContribution,
  AppConfig,
  makeWorkspaceDir,
  CODE_ROOT,
  IDB_ROOT,
  IServerApp,
  RuntimeConfig,
  RootFS,
} from '@alipay/alex-core';
import { IFileTreeService } from '@ali/ide-file-tree-next';
import { FileTreeService } from '@ali/ide-file-tree-next/lib/browser/file-tree.service';
import { FileTreeModelService } from '@ali/ide-file-tree-next/lib/browser/services/file-tree-model.service';
import { IMessageService } from '@ali/ide-overlay';
import {
  BrowserEditorContribution,
  WorkbenchEditorService,
  EditorGroupChangeEvent,
} from '@ali/ide-editor/lib/browser';
import * as path from 'path';
import { QuickPickService } from '@ali/ide-quick-open';
import { IDiskFileProvider, FileAccess } from '@ali/ide-file-service';
import { DiskFsProviderClient } from '@ali/ide-file-service/lib/browser/file-service-provider-client';
import configureFileSystem from './filesystem/configure';
import { CodeModelService } from './code-model.service';
import { RefType, ICodeServiceConfig } from './types';

@Domain(LaunchContribution, BrowserEditorContribution, CommandContribution)
export class CodeContribution
  implements LaunchContribution, BrowserEditorContribution, CommandContribution {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

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

  @Autowired(IDiskFileProvider)
  diskFile: DiskFsProviderClient;

  @Autowired(IEventBus)
  protected eventBus: IEventBus;

  @Autowired(ICodeServiceConfig)
  codeServiceConfig: ICodeServiceConfig;

  private _unmount: () => void | undefined;

  private _mounting = false;

  private _disposables: IDisposable[] = [];

  async launch({ rootFS }: IServerApp) {
    if (!this.codeServiceConfig) return;

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
          const { currentResource } = this.editorService;
          if (currentResource) {
            this.codeModel.replaceBrowserUrl({
              type: 'blob',
              filepath: path.relative(
                this.appConfig.workspaceDir,
                currentResource.uri.codeUri.path
              ),
            });
          } else {
            this.codeModel.replaceBrowserUrl({
              type: 'tree',
              filepath: '',
            });
          }
        });
      });
    });

    if ((await this.codeModel.initialize()) === 'Failed') {
      initMountDefer = null;
      return;
    }
    await initMountDefer.promise;
  }

  async mountFilesystem(rootFS: RootFS) {
    if (this._mounting) return;
    this._mounting = true;

    try {
      // const workspaceDir = makeWorkspaceDir(`${this.codeModel.platform}/${this.codeModel.project}`);
      // this.appConfig.workspaceDir = workspaceDir;
      const { workspaceDir } = this.appConfig;

      const { codeFileSystem, idbFileSystem, overlayFileSystem } = await configureFileSystem(
        this.codeModel,
        this.runtimeConfig.scenario
      );

      this._unmount?.();

      rootFS.mount(workspaceDir, codeFileSystem);
      // 将只读文件系统挂载到 /code 上
      rootFS.mount(CODE_ROOT, codeFileSystem);
      // 将可写文件系统挂载到 /idb
      rootFS.mount(IDB_ROOT, idbFileSystem);

      this._unmount = () => {
        rootFS.umount(workspaceDir);
        rootFS.umount(CODE_ROOT);
        rootFS.umount(IDB_ROOT);
      };
    } catch (err) {
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
      this.commandService.tryExecuteCommand(FILE_COMMANDS.LOCATION.id, uri);
    }
    wait.finally(() => {
      this.startOnEditorGroupChangeEvent();
    });
  }

  registerCommands(commandRegistry: CommandRegistry) {
    this._disposables.push(
      commandRegistry.registerCommand(
        {
          category: 'Code Service',
          label: localize('code-service.command.checkout'),
          id: 'code-service.checkout',
        },
        {
          execute: async () => {
            const { rootRepository: repo } = this.codeModel;
            await repo.refsInitialized;
            const getShortCommit = (commit: string) => (commit || '').substr(0, 8);
            const refs = [...repo.refs.branches, ...repo.refs.tags];
            const value = await this.quickPickService.show(
              refs.map((ref, index) => ({
                value: index,
                label: ref.name,
                description: `${ref.type === RefType.Tag ? 'Tag at ' : ''}${getShortCommit(
                  ref.commit
                )}`,
              })),
              {
                placeholder: localize('code-service.select-ref-to-checkout'),
              }
            );
            if (typeof value === 'number') {
              const target = refs[value];
              if (target.commit === repo.commit) {
                this.messageService.warning(localize('code-service.checkout-to-same'));
                return;
              }
              this.messageService.info(formatLocalize('code-service.checkout-to', target.name));
              repo.ref = target.name;
              repo.commit = target.commit;
            }
          },
        }
      ),

      commandRegistry.registerCommand(
        { id: 'code-service.reinitialize' },
        {
          execute: () => {
            this.codeModel.reinitialize();
          },
        }
      )
    );
  }

  startOnEditorGroupChangeEvent() {
    this._disposables.push(
      this.editorService.onActiveResourceChange((resource) => {
        if (
          resource &&
          ['code', 'diff'].includes(
            this.editorService.currentEditorGroup?.currentOpenType?.type ?? ''
          )
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

  dispose() {
    this._unmount?.();
    this._disposables.forEach((disposer) => disposer.dispose());
  }
}
