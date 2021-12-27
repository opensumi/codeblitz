import { Commit } from './commit';
import { Iteration } from './iteration';

export interface Branch {
  name: string;
  protect: boolean;
  protected: boolean;
  protectRuleExactMatched: boolean; // 是否通过名字精准匹配
  protectRule: string; // 保护分支规则
  mergeAccessLevel: string | number; // TODO: 后端接口转成字符串了，后面需要改成 number
  pushAccessLevel: string | number; // TODO: 后端接口转成字符串了，后面需要改成 number
  ref: string;
  commit: Commit;
  branchIterations?: Iteration[];
  isCooperate?: boolean;
}

export interface BranchStatistic {
  name: string;
  commitsDiff: {
    ahead: number;
    behind: number;
    compareTo: string;
  };
}
