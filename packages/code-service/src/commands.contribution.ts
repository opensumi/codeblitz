import {
  CodeAPI,
  CodePlatform,
  CommitFileChange,
  CommitParams,
  CommitRecord,
  ICodeAPIProvider,
} from '@codeblitzjs/ide-code-api';
import { Autowired } from '@opensumi/di';
import { IClipboardService, IOpenerService } from '@opensumi/ide-core-browser';
import { Command, CommandContribution, CommandRegistry, Disposable, Domain } from '@opensumi/ide-core-common';
import { CodeModelService } from './code-model.service';
import { CODE_SERVICE_COMMANDS } from './commands';

export enum RemoteResourceType {
  Branch = 'branch',
  Branches = 'branches',
  Commit = 'commit',
  File = 'file',
  Repo = 'repo',
  Revision = 'revision',
}

export type RemoteResource =
  | {
    type: RemoteResourceType.Branch;
    branch: string;
  }
  | {
    type: RemoteResourceType.Branches;
  }
  | {
    type: RemoteResourceType.Commit;
    sha: string;
  }
  | {
    type: RemoteResourceType.File;
    branch?: string;
    fileName: string;
    range?: Range;
  }
  | {
    type: RemoteResourceType.Repo;
  };

@Domain(CommandContribution)
export class CommandsContribution extends Disposable implements CommandContribution {
  @Autowired(CodeModelService)
  private readonly codeModel: CodeModelService;

  @Autowired(ICodeAPIProvider)
  readonly codeAPI: ICodeAPIProvider;

  @Autowired(IOpenerService)
  private readonly openerService: IOpenerService;

  @Autowired(IClipboardService)
  clipboardService: IClipboardService;

  registerCommands(registry: CommandRegistry) {
    const commandList: Command[] = [
      CODE_SERVICE_COMMANDS.BLAME,
      CODE_SERVICE_COMMANDS.OPEN_IN_REMOTE,
      CODE_SERVICE_COMMANDS.DEFAULT_BRANCH,
      CODE_SERVICE_COMMANDS.BRANCH,
      CODE_SERVICE_COMMANDS.REFS,
      CODE_SERVICE_COMMANDS.COMMIT,
      CODE_SERVICE_COMMANDS.COMMIT_DETAIL,
      CODE_SERVICE_COMMANDS.COMMIT_COMPARE,
      CODE_SERVICE_COMMANDS.COMMIT_FILE,
      CODE_SERVICE_COMMANDS.REMOTE_URL,
      CODE_SERVICE_COMMANDS.CHECKOUT_BRANCH,
      CODE_SERVICE_COMMANDS.CHECKOUT_COMMIT,
      CODE_SERVICE_COMMANDS.CLIPBOARD,
      // git
      CODE_SERVICE_COMMANDS.REPOSITORY,
      CODE_SERVICE_COMMANDS.GETTREE,
      CODE_SERVICE_COMMANDS.CREATECOMMIT,
      CODE_SERVICE_COMMANDS.SEARCHFILES,
      CODE_SERVICE_COMMANDS.GETFILES,
      CODE_SERVICE_COMMANDS.GETUSER,
      CODE_SERVICE_COMMANDS.SCMREFRESH,
      CODE_SERVICE_COMMANDS.MERGEBASE,
      CODE_SERVICE_COMMANDS.CREATEPR,
      // CODE_SERVICE_COMMANDS.CREATEBRANCHFROM,

      // conflict
      CODE_SERVICE_COMMANDS.GETCONFLICT,
      CODE_SERVICE_COMMANDS.RESOLVECONFLICT,
      CODE_SERVICE_COMMANDS.CHECKCONFLICT,
      CODE_SERVICE_COMMANDS.CREATENEWBRANCH,
    ];
    commandList.forEach((command) => {
      this.addDispose(
        registry.registerCommand(command, {
          execute: (...args: any[]) => {
            const method = command.id.split('.')[1];
            if (this[method]) {
              return this[method](...args);
            } else {
              throw new Error(`command: ${command.id} is not implement`);
            }
          },
        }),
      );
    });
  }

  // TODO: 这里直接返回 Uint8Array，减少序列化耗时，但考虑到多平台又需转换成统一格式数据
  getFileBlame(filepath: string): Promise<Uint8Array> | void {
    const repo = this.codeModel.getRepository(filepath);
    if (repo) {
      return repo.request.getFileBlame(repo.asRelativePath(filepath));
    }
  }

  openInRemote(filepath: string, res: RemoteResource): void {
    const repo = this.codeModel.getRepository(filepath);
    if (repo) {
      if (res.type === RemoteResourceType.Commit) {
        const { origin } = repo.platformConfig;

        if (repo.platform === CodePlatform.gitlink) {
          this.openerService.open(`${origin}/${repo.owner}/${repo.name}/commits/${res.sha}`);
        } else {
          this.openerService.open(`${origin}/${repo.owner}/${repo.name}/commit/${res.sha}`);
        }
      }
    }
  }

  async branch(repoPath: string): Promise<{ branches: string[]; head: string | null }> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return { branches: [], head: null };
    const branches = await repo.request.getBranches();
    const head = branches.find((br) => br.commit.id === repo.commit)?.name ?? null;
    return {
      branches: branches.map((br) => br.name),
      head,
    };
  }

  async repository() {
    const { HEAD, commit, headLabel, name, owner, platform, ref, platformConfig } = this.codeModel.rootRepository;

    return {
      HEAD,
      commit,
      headLabel,
      name,
      owner,
      platform,
      ref,
      origin: platformConfig.origin,
      // refs: refs
    };
  }

  async defaultBranch(repoPath) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;

    const { default_branch } = await repo.request.getProject();
    return default_branch;
  }

  async createCommit(repoPath, actions, header) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    return repo.request.bulkChangeFiles(actions, header);
  }

  async searchFiles(repoPath, searchString) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    return repo.request.searchFile(searchString, {
      limit: 100,
    });
  }

  async getFiles(repoPath) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    return repo.request.getFiles();
  }

  async getTree(repoPath: string, path: string) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    return repo.request.getTree(path);
  }

  async getUser(repoPath: string) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    return repo.request.getUser();
  }
  async scmRefresh(commit: string, ref: string) {
    // scm 提交完刷新
    const repo = this.codeModel.rootRepository;
    await repo.refreshRepository(commit, ref);
  }

  async refs(repoPath: string): Promise<
    | {
      head: string | null;
      heads: { name: string; hash: string }[];
      tags: { name: string; hash: string }[];
    }
    | undefined
  > {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return;
    const [branches, tags] = await Promise.all([
      repo.request.getBranches().catch(() => []),
      repo.request.getTags().catch(() => []),
    ]);
    return {
      head: repo.commit || null,
      heads: branches.map((item) => ({
        name: item.name,
        hash: item.commit.id,
        protected: item.protected,
      })),
      tags: tags.map((item) => ({
        name: item.name,
        hash: item.commit.id,
      })),
    };
  }

  async commits(repoPath: string, params: CommitParams): Promise<CommitRecord[]> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return [];
    return repo.request.getCommits(params);
  }

  async commitDiff(repoPath: string, sha: string): Promise<CommitFileChange[]> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return [];
    return repo.request.getCommitDiff(sha);
  }

  async commitCompare(repoPath: string, from: string, to: string): Promise<CommitFileChange[]> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return [];
    return repo.request.getCommitCompare(from, to);
  }

  async commitFile(
    repoPath: string,
    commitHash: string,
    filePath: string,
    options?: any,
  ): Promise<Uint8Array> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error(`${filePath} not exists`);
    return repo.request.getBlobByCommitPath(commitHash, filePath, options);
  }

  async remoteUrl(repoPath: string): Promise<string | null> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return null;
    const { origin } = repo.platformConfig;
    return `${origin}/${repo.owner}/${repo.name}`;
  }

  async checkConflict(
    repoPath: string,
    sourceBranch: string,
    targetBranch: string,
    prId: string,
  ): Promise<CodeAPI.CanResolveConflictResponse> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error checkConflict');
    return repo.request.canResolveConflict(sourceBranch, targetBranch, prId);
  }
  async resolveConflict(
    repoPath: string,
    content: CodeAPI.ResolveConflict,
    sourceBranch: string,
    targetBranch: string,
    prId?: string,
  ): Promise<CodeAPI.ResolveConflictResponse> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error resolveConflict');
    return repo.request.resolveConflict(content, sourceBranch, targetBranch, prId);
  }
  async getConflict(
    repoPath: string,
    sourceBranch: string,
    targetBranch: string,
  ): Promise<CodeAPI.ConflictResponse> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error getConflict');
    return repo.request.getConflict(sourceBranch, targetBranch);
  }

  async createNewBranch(repoPath: string, newBranchName: string, ref: string) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error createNewBranch');
    return repo.request.createBranch(newBranchName, ref);
  }

  async mergeBase(repoPath: string, target: string, source: string) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error createNewBranch');
    return repo.request.mergeBase(target, source);
  }

  async createPR(repoPath: string, target: string, source: string, title: string, autoMerge: boolean) {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error('conflict request Error createNewBranch');
    return repo.request.createPullRequest(target, source, title, autoMerge);
  }

  // TODO: 暂时只支持根仓库的切换，submodules 切换会引起文件变更
  async checkoutBranch(repoPath: string, branchName: string) {
    const { rootRepository } = this.codeModel;
    await rootRepository.refsInitialized;
    const br = rootRepository.refs.branches.find((br) => br.name === branchName);
    if (!br) {
      throw new Error(`${branchName} not exists`);
    }
    rootRepository.ref = br.name;
    rootRepository.commit = br.commit;
  }

  async checkoutCommit(repoPath: string, sha: string) {
    const { rootRepository } = this.codeModel;
    rootRepository.ref = sha;
    rootRepository.commit = sha;
  }

  _clipboard(method: 'readText'): Promise<string>;
  _clipboard(method: 'writeText', text: string): Promise<void>;
  _clipboard(method: 'writeText' | 'readText', text?: string): Promise<string | void> {
    if (method === 'writeText' && text) {
      return this.clipboardService.writeText(text);
    } else {
      return this.clipboardService.readText();
    }
  }
}
