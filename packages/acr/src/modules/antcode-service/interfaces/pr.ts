import { User } from './user';

// partial PR object: copied from antcode
export interface PR {
  id: number; // 主键
  iid: number; // 工程内唯一id
  title: string;
  description: string;
  mergeError: string; // 合并错误信息
  sourceProjectId: number; // 来源工程ID
  sourceBranch: string; // 来源分支
  targetProjectId: number; // 目标工程ID
  targetBranch: string;
  createdAt: string; // [date]
  updatedAt: string; // [date]
  author: User;
  assignee?: User;
  updatedBy: User;
  mergedBy: User;
}
