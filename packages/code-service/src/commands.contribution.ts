import { Autowired } from '@ali/common-di';
import {
  CommandContribution,
  Domain,
  CommandRegistry,
  Command,
  Disposable,
} from '@ali/ide-core-common';
import { IOpenerService } from '@ali/ide-core-browser';
import { CODE_PLATFORM_CONFIG, CodePlatform } from '@alipay/alex-code-api';
import { CodeModelService } from './code-model.service';

// 对外暴露的服务命令
namespace CODE_SERVICE_COMMANDS {
  const CATEGORY = 'CodeService';

  export const BLAME: Command = {
    id: 'codeService.getFileBlame',
    category: CATEGORY,
  };

  export type BLAME = (filepath: string) => Promise<Uint8Array | void>;

  export const OPEN_IN_REMOTE: Command = {
    id: 'codeService.openInRemote',
    category: CATEGORY,
  };

  export type OPEN_IN_REMOTE = (filepath: string, res: RemoteResource) => void;
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

  registerCommands(registry: CommandRegistry) {
    this.addDispose([
      // TODO: 这里直接返回 Uint8Array，减少序列化耗时，但考虑到多平台又需转换成统一格式数据
      registry.registerCommand<CODE_SERVICE_COMMANDS.BLAME>(CODE_SERVICE_COMMANDS.BLAME, {
        execute: async (filepath) => {
          const repo = this.codeModel.getRepository(filepath);
          if (repo && repo.platform === CodePlatform.antcode) {
            return repo.request.getFileBlame(repo.asRelativePath(filepath));
          }
        },
      }),

      registry.registerCommand<CODE_SERVICE_COMMANDS.OPEN_IN_REMOTE>(
        CODE_SERVICE_COMMANDS.OPEN_IN_REMOTE,
        {
          execute: (filepath, res) => {
            const repo = this.codeModel.getRepository(filepath);
            if (repo) {
              if (res.type === RemoteResourceType.Commit) {
                const { origin } = CODE_PLATFORM_CONFIG[repo.platform];
                this.openerService.open(`${origin}/${repo.owner}/${repo.name}/commit/${res.sha}`);
              }
            }
          },
        }
      ),
    ]);
  }
}
