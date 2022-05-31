import { Autowired, Injectable, INJECTOR_TOKEN, Injector } from '@opensumi/di';
import { Disposable, URI, FileStat, DisposableCollection } from '@opensumi/ide-core-common';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { IMainLayoutService } from '@opensumi/ide-main-layout';

import { BrowserSCMClient } from './web-scm-client.service';
import { MergeRequestExplorerId } from '../common';
import { WebSCMViewId } from './common';

/**
 * 作为入口，去管理 web-scm client 实例
 * 包括 初始化/销毁
 */
@Injectable()
export class WebSCMController extends Disposable {
  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IMainLayoutService)
  private readonly mainLayoutService: IMainLayoutService;

  private _gitClient: BrowserSCMClient | null;
  public get gitClient(): BrowserSCMClient | null {
    return this._gitClient;
  }

  private toDisposeGitClients = new DisposableCollection();

  async init() {
    /**
     * 多工作区情况
     * workspace 指向的是 .code-workspace 文件
     * roots指向的是工作区的根目录
     */
    const [root] = await this.workspaceService.roots;
    this._mountGitClient(root);

    // 首次完成 git client 初始化后，判断 web scm 面板是否展开
    if (this._gitClient) {
      this.addDispose(
        this._gitClient.onReady(() => {
          this.collapseWebSCMPanel();
        })
      );
    }

    this.addDispose(
      this.workspaceService.onWorkspaceChanged(([root]) => {
        // 将之前的 git client dispose 掉
        // 销毁上一个 git client
        this.toDisposeGitClients.dispose();
        // 创建新的 git client 实例
        this._mountGitClient(root);
      })
    );

    // 默认把 scm panel 关起来
    this.collapseWebSCMPanel();
  }

  private _mountGitClient(root: FileStat) {
    if (root && root.uri) {
      this._gitClient = this.injector.get(BrowserSCMClient, [new URI(root.uri)]);
      this.toDisposeGitClients.push(this._gitClient);

      this.toDisposeGitClients.push(
        this._gitClient.onDidStagedFiles(() => {
          if (this.autoExpandScmPanelFlag) {
            return;
          }
          const tabbarHandler = this.mainLayoutService.getTabbarHandler(MergeRequestExplorerId);

          // 当面板关闭时则自动打开
          if (tabbarHandler && tabbarHandler.isCollapsed(WebSCMViewId)) {
            tabbarHandler.setCollapsed(WebSCMViewId, false);
            this.autoExpandScmPanelFlag = true;
          }
        })
      );
    }
  }

  private collapseWebSCMPanel() {
    // ide-fw 存在一定时序问题，通过 setTimeout 绕过去
    setTimeout(() => {
      const tabbarHandler = this.mainLayoutService.getTabbarHandler(MergeRequestExplorerId);

      if (tabbarHandler && this._gitClient) {
        const collapsed = this._gitClient.getStagedFileUris().length === 0;
        tabbarHandler.setCollapsed(WebSCMViewId, collapsed);
      }
    }, 0);
  }

  // 仅操作一次
  private autoExpandScmPanelFlag = false;
}
