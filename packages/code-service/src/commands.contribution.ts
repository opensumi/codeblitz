import { Autowired } from '@opensumi/di';
import {
  CommandContribution,
  Domain,
  CommandRegistry,
  Command,
  Disposable,
} from '@opensumi/ide-core-common';
import { IOpenerService, IClipboardService } from '@opensumi/ide-core-browser';
import {
  CODE_PLATFORM_CONFIG,
  CodePlatform,
  BranchOrTag,
  CommitRecord,
  CommitParams,
  CommitFileChange,
} from '@alipay/alex-code-api';
import { CodeModelService } from './code-model.service';

// 对外暴露的服务命令
namespace CODE_SERVICE_COMMANDS {
  const CATEGORY = 'CodeService';

  export const BLAME: Command = {
    id: 'codeService.getFileBlame',
    category: CATEGORY,
  };

  export const OPEN_IN_REMOTE: Command = {
    id: 'codeService.openInRemote',
    category: CATEGORY,
  };

  export const BRANCH: Command = {
    id: 'code-service.branch',
    category: CATEGORY,
  };

  export const REFS: Command = {
    id: 'code-service.refs',
    category: CATEGORY,
  };

  export const COMMIT: Command = {
    id: 'code-service.commits',
    category: CATEGORY,
  };

  export const COMMIT_DETAIL: Command = {
    id: 'code-service.commitDiff',
    category: CATEGORY,
  };

  export const COMMIT_COMPARE: Command = {
    id: 'code-service.commitCompare',
    category: CATEGORY,
  };

  export const COMMIT_FILE: Command = {
    id: 'code-service.commitFile',
    category: CATEGORY,
  };

  export const REMOTE_URL: Command = {
    id: 'code-service.remoteUrl',
    category: CATEGORY,
  };

  export const CHECKOUT_BRANCH: Command = {
    id: 'code-service.checkoutBranch',
    category: CATEGORY,
  };

  export const CHECKOUT_COMMIT: Command = {
    id: 'code-service.checkoutCommit',
    category: CATEGORY,
  };

  // TODO: worker 中 env 未实现，先临时在这里通过 command 调用
  export const CLIPBOARD: Command = {
    id: 'code-service._clipboard',
    category: CATEGORY,
  };
  export const REPOSITORY: Command = {
    id: 'code-service.repository',
    category: CATEGORY,
  };
  export const GETTREE: Command = {
    id: 'code-service.getTree',
    category: CATEGORY,
  };
  export const CREATECOMMIT: Command = {
    id: 'code-service.createCommit',
    category: CATEGORY,
  };
  export const SEARCHFILES: Command = {
    id: 'code-service.searchFiles',
    category: CATEGORY,
  };
  export const GETFILES: Command = {
    id: 'code-service.getFiles',
    category: CATEGORY,
  };
  export const GETUSER: Command = {
    id: 'code-service.getUser',
    category: CATEGORY,
  };
  export const SCMREFRESH: Command = {
    id: 'code-service.scmRefresh',
    category: CATEGORY,
  };
}

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

  @Autowired(IOpenerService)
  private readonly openerService: IOpenerService;

  @Autowired(IClipboardService)
  clipboardService: IClipboardService;

  registerCommands(registry: CommandRegistry) {
    const commandList: Command[] = [
      CODE_SERVICE_COMMANDS.BLAME,
      CODE_SERVICE_COMMANDS.OPEN_IN_REMOTE,
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
      // CODE_SERVICE_COMMANDS.CREATEBRANCH,
      // CODE_SERVICE_COMMANDS.CREATEBRANCHFROM,
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
        })
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
        const { origin } = CODE_PLATFORM_CONFIG[repo.platform];
        this.openerService.open(`${origin}/${repo.owner}/${repo.name}/commit/${res.sha}`);
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
    const { HEAD, commit, headLabel, name, owner, platform, ref, refs } =
      this.codeModel.rootRepository;
    return {
      HEAD,
      commit,
      headLabel,
      name,
      owner,
      platform,
      ref,
      // refs: refs
    };
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

  async commitFile(repoPath: string, commitHash: string, filePath: string): Promise<Uint8Array> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) throw new Error(`${filePath} not exists`);
    return repo.request.getBlobByCommitPath(commitHash, filePath);
  }

  async remoteUrl(repoPath: string): Promise<string | null> {
    const repo = this.codeModel.getRepository(repoPath);
    if (!repo) return null;
    const { origin } = CODE_PLATFORM_CONFIG[repo.platform];
    return `${origin}/${repo.owner}/${repo.name}`;
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
