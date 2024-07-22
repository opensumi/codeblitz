import { Command } from '@opensumi/ide-core-common';

// 对外暴露的服务命令
export namespace CODE_SERVICE_COMMANDS {
  const CATEGORY = 'CodeService';

  export const BLAME: Command = {
    id: 'codeService.getFileBlame',
    category: CATEGORY,
  };

  export const OPEN_IN_REMOTE: Command = {
    id: 'codeService.openInRemote',
    category: CATEGORY,
  };

  export const DEFAULT_BRANCH: Command = {
    id: 'code-service.defaultBranch',
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
  export const CREATENEWBRANCH: Command = {
    id: 'code-service.createNewBranch',
    category: CATEGORY,
  };
  export const CHECKCONFLICT: Command = {
    id: 'code-service.checkConflict',
    category: CATEGORY,
  };
  export const RESOLVECONFLICT: Command = {
    id: 'code-service.resolveConflict',
    category: CATEGORY,
  };
  export const GETCONFLICT: Command = {
    id: 'code-service.getConflict',
    category: CATEGORY,
  };
  export const MERGEBASE: Command = {
    id: 'code-service.mergeBase',
    category: CATEGORY,
  };
  export const CREATEPR: Command = {
    id: 'code-service.createPR',
    category: CATEGORY,
  };
}
