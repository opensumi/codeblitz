import { Autowired, Injectable, Injector, INJECTOR_TOKEN, Optional } from '@opensumi/di';
import { IProgressService } from '@opensumi/ide-core-browser/lib/progress';
import {
  Disposable,
  Emitter,
  Event,
  StorageProvider,
  STORAGE_SCHEMA,
  URI,
  formatLocalize,
  path as paths,
} from '@opensumi/ide-core-common';
import { IQuickInputService, localize } from '@opensumi/ide-core-browser';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { ISCMRepository, SCMService, ISCMResource, ISCMResourceGroup } from '@opensumi/ide-scm';
import { IMessageService, IDialogService } from '@opensumi/ide-overlay';

import { IAntcodeService, TCommitFiles } from '../../antcode-service/base';
import { WorkspaceManagerService } from '../../workspace/workspace-loader.service';
import { IDmpService, WebSCMViewId } from './common';
import { WebSCMProvider, WebSCMResource, WebSCMResourceGroup } from './web-scm-provider.definition';
import { reportWebSCMPush } from '../../../utils/monitor';

const webSCMStorageId = new URI('web-scm').withScheme(STORAGE_SCHEMA.SCOPE);

/**
 * 由于 antcode 在提交代码接口做 ref/commitId 匹配检查时
 * 仅仅反馈 400 并 response#body 里包含以下错误信息
 * antcode 侧科豆表示错误 msg 固定不变
 * `400 INVALID_ARGUMENT: Start revision 5229a4 is behind old revision daa3e1`
 * 因此这里 follow antcode 按照字符串进行匹配
 */
const refNotMatchRegex = /start revision \w+ is behind old revision \w+/i;

/**
 * 每一个 web-scm client 将数据存到 storage 数据里面
 * web-scm client 作为原始的 scm 数据来源
 * TODO: web-scm helper 则负责帮助每个 web-scm client 去做 scm provider UI 注册/销毁相关
 */
@Injectable({ multiple: true })
export class BrowserSCMClient extends Disposable {
  static ID = 0;

  @Autowired(StorageProvider)
  private storageProvider: StorageProvider;

  @Autowired(SCMService)
  private readonly scmService: SCMService;

  @Autowired(IFileServiceClient)
  private readonly fileServiceClient: IFileServiceClient;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(IProgressService)
  private readonly progressService: IProgressService;

  @Autowired(IDmpService)
  private readonly dmpService: IDmpService;

  @Autowired()
  private readonly workspaceManagerService: WorkspaceManagerService;

  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  @Autowired(IQuickInputService)
  private readonly quickInputService: IQuickInputService;

  private _onReady = new Emitter<void>();
  public readonly onReady: Event<void> = this._onReady.event;

  private _onDidStagedFiles = new Emitter<URI[]>();
  public readonly onDidStagedFiles: Event<URI[]> = this._onDidStagedFiles.event;

  private async getWebSCMStorage() {
    // const storageProvider: StorageProvider = this.injector.get(StorageProvider);
    return await this.storageProvider(webSCMStorageId);
  }

  private stagedFiles = new Set<string>();
  private projectRootDir: URI;

  // undefined 表示为批量添加了多个文件 or 初始化时从 storage 里面读取的存储
  private _onDidAddFile: Emitter<URI | undefined> = new Emitter();
  public get onDidAddFile(): Event<URI | undefined> {
    return this._onDidAddFile.event;
  }

  private _provider: WebSCMProvider;
  private _repo: ISCMRepository;

  constructor(@Optional() rootDir: URI) {
    super();
    this.projectRootDir = rootDir;
    // TODO 暂时先注册scm_view 防止scm-tree-model内调用withProgress报错
    this.progressService.registerProgressIndicator('scm_view');
    this.initProvider();
    this.hydrate();
  }

  private changeGroup: WebSCMResourceGroup;

  private initChangeGroup() {
    const changeGroup = new WebSCMResourceGroup(
      this._provider,
      localize('web-scm.changeGroup.title'),
      '0'
    );
    // 初始化挂载一个元素
    this._provider.groups.splice(this._provider.groups.elements.length, 0, [changeGroup]);
    return changeGroup;
  }

  public dispose() {
    this.cleanChangeGroup();
  }

  public async addFile(uri: URI) {
    // 只有在当前 workspace 下的文件才能编辑
    if (this.projectRootDir.isEqualOrParent(uri)) {
      this.stageFile(uri);
    }
  }

  public getStagedFileUris(): URI[] {
    return Array.from(this.stagedFiles).map((uriStr) => new URI(uriStr));
  }

  public getStagedFileUriStrs(): string[] {
    return Array.from(this.stagedFiles);
  }

  public status() {
    return this.showProgress(this.checkFileStatus());
  }

  // 撤销文件内变更
  public async discardChanges(resource: ISCMResource) {
    // FIXME: 加一个进度条控制
    const ok = localize('ButtonOK');
    const cancel = localize('ButtonCancel');
    const confirm = await this.dialogService.warning(
      formatLocalize('web-scm.confirm.discard', paths.basename(resource.sourceUri.fsPath)),
      [cancel, ok]
    );
    if (confirm !== ok) {
      return;
    }
    const uri = new URI(resource.sourceUri);
    await this._doDiscardChanges(uri);
    await this.status();
  }

  /**
   * 撤销所有文件变更
   */
  public async discardAllChanges(resourceGroup: ISCMResourceGroup) {
    if (resourceGroup.elements.length < 1) {
      return;
    }
    const message =
      resourceGroup.elements.length === 1
        ? formatLocalize(
            'web-scm.confirm.discard',
            paths.basename(resourceGroup.elements[0].sourceUri.fsPath)
          )
        : formatLocalize('web-scm.confirm.discardAll', resourceGroup.elements.length);

    const ok = localize('ButtonOK');
    const cancel = localize('ButtonCancel');
    const confirm = await this.dialogService.warning(message, [cancel, ok]);
    if (confirm !== ok) {
      return;
    }

    for (const element of resourceGroup.elements) {
      const uri = new URI(element.sourceUri);
      await this._doDiscardChanges(uri);
    }
    await this.status();
  }

  private async _doDiscardChanges(uri: URI) {
    // FIXME: 加一个进度条控制
    const params = await this.workspaceManagerService.getParsedUriParams(uri);
    if (!params) {
      return;
    }
    const { ref, path } = params;
    const originalContent = await this.antcodeService.getFileContentByRef(path, ref);
    const fileStat = await this.fileServiceClient.getFileStat(uri.toString());
    if (fileStat) {
      // @ts-ignore
      await this.fileServiceClient.setContent(fileStat, originalContent);
    }
  }

  /**
   * 将 staged files 进行提取和汇总
   */
  public async commitAndPush(commitMsg: string, newBranch?: string) {
    const stagedFiles = this.getStagedFileUris();
    // 通过列表中第一个文件名去取到当前的 ref
    const params = await this.workspaceManagerService.getParsedUriParams(stagedFiles[0]);
    if (!params) {
      return;
    }
    const { ref } = params;

    const commitActions = await Promise.all(
      stagedFiles.map(async (uri: URI) => {
        const params = await this.workspaceManagerService.getParsedUriParams(uri);
        if (!params) {
          return;
        }
        const filePath = params.path;
        const ret = await this.fileServiceClient.resolveContent(uri.toString());
        if (!ret || !ret.content) {
          return;
        }
        return {
          content: ret.content,
          filePath,
        };
      })
    );

    // 阻断没有详情的 pullRequest 详情
    if (!this.antcodeService.pullRequest || !this.antcodeService.pullRequest.sourceBranch) {
      return;
    }

    const commitHeader = {
      commitMessage: commitMsg,
      // lastCommitId: 'daa3e131f322146932587c645d82c880f1a8d062', /* 测试使用 */
      lastCommitId: ref,
      // 提交到源分支则用 sourceBranch, 提交到新分支则使用新分支名
      branch: newBranch || this.antcodeService.pullRequest.sourceBranch,
    };
    // @ts-ignore
    await this.pushToOrigin([commitActions.filter(Boolean), commitHeader]);
  }

  private async pushToOrigin(payload: Parameters<TCommitFiles>, newBranchName?: string) {
    const [commitActions, commitHeader] = payload;
    try {
      await this.antcodeService.commitFiles(commitActions, {
        ...commitHeader,
        branch: newBranchName || commitHeader.branch,
      });
      reportWebSCMPush(
        this.antcodeService.projectPath,
        this.antcodeService.pullRequest?.iid,
        // @ts-ignore
        commitHeader.lastCommitId,
        true,
        !!newBranchName
      );

      // 清空 staged files
      this.stagedFiles.clear();
      // FIXME: 需要将这些文件的本地缓存全部清理掉嘛?
      // FIXME: 需要将打开的文件清理掉嘛?
      this.status();
      // 清理用户输入
      this._repo.input.value = '';
      // 提交成功后需要清理掉 scm provider list
      this.cleanChangeGroup();
      this.persistToStorage();

      if (!newBranchName) {
        this.messageService.info(localize('web-scm.push.success'));
      } else {
        // 提示用户可新建 pr 至源分支
        const newPrStr = formatLocalize('web-scm.new.pr', commitHeader.branch);
        const answer = await this.messageService.info(
          formatLocalize('web-scm.checkoutAndCommit.success', newBranchName),
          [localize('acr.common.skip'), newPrStr]
        );
        if (answer === newPrStr) {
          window.open(
            `/${this.antcodeService.projectPath}/pull_requests/new?source_branch=${newBranchName}&target_branch=${commitHeader.branch}`
          );
        }
      }
    } catch (err: any) {
      reportWebSCMPush(
        this.antcodeService.projectPath,
        this.antcodeService.pullRequest?.iid,
        // @ts-ignore
        commitHeader.lastCommitId,
        false,
        !!newBranchName,
        (err && err.message) || 'Unknown Error'
      );

      if (err && err.message && refNotMatchRegex.test(err.message)) {
        // 需要提示用户去切换分支
        const branchName = await this.checkoutBranch();
        if (!branchName) {
          return;
        }

        return await this.pushToOrigin([commitActions.filter(Boolean), commitHeader], branchName);
      }

      let errorMsg = localize('web-scm.push.failed');
      if (err.message) {
        errorMsg += `: ${err.message}`;
      }
      return this.messageService.error(errorMsg);
    }
  }

  private async checkoutBranch() {
    // 需要提示用户去切换分支
    const ok = localize('web-scm.baseCommitOutdated.dialog.ok');
    const cancel = localize('ButtonCancel');
    const confirm = await this.dialogService.warning(
      localize('web-scm.baseCommitOutdated.dialog.hint'),
      [cancel, ok]
    );
    if (confirm !== ok) {
      return;
    }
    return await this.quickInputService.open({
      placeHolder: localize('web-scm.checkoutAndCommit.input.placeholder'),
      prompt: localize('web-scm.checkoutAndCommit.input.hint'),
    });
  }

  // FIXME: 按照 uri 去检查，以提升性能
  private async checkFileStatus() {
    let changed = false;
    // 定时轮训去检测文件是否变更过
    for (const uriStr of this.stagedFiles) {
      const uri = new URI(uriStr);
      const ret = await this.fileServiceClient.resolveContent(uriStr);
      const modifiedContent = ret && ret.content;
      if (modifiedContent === undefined) {
        return;
      }
      // FIXME: 从 git fs provider 里面读取
      const params = await this.workspaceManagerService.getParsedUriParams(uri);
      if (!params) {
        return;
      }
      const { ref, path } = params;
      const originalContent = await this.antcodeService.getFileContentByRef(
        path,
        ref,
        this.antcodeService.encoding.toUpperCase()
      );
      // @ts-ignore
      if (!this.hasChange(originalContent, modifiedContent)) {
        changed = true;
        this.stagedFiles.delete(uriStr);
        /**
         * 以下为 side effect, 包括:
         * 1. 卸载 scm provider 中的 resource
         */
        this.deleteInChangeGroup(uri);
      }
    }

    // 持久化数据
    if (changed) {
      await this.persistToStorage();
    }

    // TODO: 考虑加一个 await sleep 做一个 loading 效果
  }

  private showProgress(promise: Promise<any>) {
    // 展示一个进度条
    this.progressService.withProgress({ location: WebSCMViewId }, async () => {
      return promise;
    });
  }

  private hasChange(originalContent: string, modifiedContent: string) {
    // 默认相同的字符串一定会返回一个结果
    const diffs = this.dmpService.dmpInstance.diff_main(originalContent, modifiedContent);
    return diffs.length > 1;
  }

  /**
   * 清空 change group 所有元素
   * 一般在提交完成后
   */
  private cleanChangeGroup() {
    this.changeGroup.splice(0, this.changeGroup.elements.length, []);
  }

  /**
   * 将 fileUri 添加到对应 changes group 中
   * @param fileUri URI
   */
  private addToChangeGroup(fileUri: URI) {
    this.changeGroup.splice(this.changeGroup.elements.length, 0, [
      this.injector.get(WebSCMResource, [this.changeGroup, fileUri.codeUri.fsPath]),
    ]);
  }

  /**
   * 将 fileUri 从对应 changes group 中移除
   * @param fileUri URI
   */
  private deleteInChangeGroup(fileUri: URI) {
    const index = this.changeGroup.elements.findIndex((element) =>
      fileUri.isEqual(new URI(element.sourceUri))
    );
    if (index > -1) {
      this.changeGroup.splice(index, 1, []);
    }
  }

  private async stageFile(...uris: URI[]) {
    // this.stagedFiles = new Set(uris.toString());
    // 批量将文件放到 resource group 中
    let changed = false;
    const validUris: URI[] = [];
    uris.forEach((uri) => {
      const uriStr = uri.toString();
      if (!this.stagedFiles.has(uriStr)) {
        this.stagedFiles.add(uriStr);
        /**
         * 以下为 side effect, 包括:
         * 1. 注册到 scm provider
         * 2. 通知去计算是否真的有 diff
         */
        this.addToChangeGroup(uri);
        validUris.push(uri);
        changed = true;
      }
    });

    this.status();
    // 持久化数据
    if (changed) {
      await this.persistToStorage();
      this._onDidStagedFiles.fire(validUris);
    }
  }

  private async persistToStorage() {
    const stagedFiles = Array.from(this.stagedFiles);
    const webScmStorage = await this.getWebSCMStorage();
    await webScmStorage.set(this.stagedNamespace, stagedFiles);
  }

  private initProvider() {
    this._provider = this.injector.get(WebSCMProvider, [
      BrowserSCMClient.ID++,
      'web-scm',
      this.projectRootDir.codeUri,
    ]);
    this._repo = this.scmService.registerSCMProvider(this._provider);
    // 设置 input placeholder
    this._repo.input.placeholder = localize('web-scm.commitMessage');
    this.addDispose(this._repo);

    // 初始化 change group
    this.changeGroup = this.initChangeGroup();
  }

  private async hydrate() {
    const webScmStorage = await this.getWebSCMStorage();
    const stagedFiles = webScmStorage.get<string[]>(this.stagedNamespace);
    // const content = await bfs.readFile(
    //   '/browser_os_home/.kaitian/datas/web-scm.json',
    //   'utf8'
    // );
    // console.log(
    //   content,
    //   'content',
    //   this.projectRootDir.toString(),
    //   stagedFiles
    // );
    if (Array.isArray(stagedFiles) && stagedFiles.length > 0) {
      const validStagedFileList: URI[] = [];
      // console.log(stagedFiles, 'stagedFiles', this.projectRootDir.toString());
      for (const uriStr of stagedFiles) {
        const uri = new URI(uriStr);
        if (this.projectRootDir.isEqualOrParent(uri)) {
          validStagedFileList.push(uri);
        }
      }
      this.stageFile(...validStagedFileList);
    }

    this._onReady.fire();
  }

  // 按照 namespace 做隔离
  // 由于 workspace 级别 storage 不能响应 workspaceDir change，因此用 global 的
  // 并加上当前 projectDir 作为唯一 key
  // TODO: projectDir 需要包含 prId
  private get stagedNamespace() {
    return 'staged'; // + this.projectRootDir.toString();
  }
}
