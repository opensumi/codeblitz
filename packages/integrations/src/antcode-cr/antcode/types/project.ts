import { User } from './user';
import { Access } from './access';
import { Namespace } from './namespace';
import { Group } from './group';

export interface Project {
  avatar: string;
  id: number;
  path: string;
  name: string;
  pathWithNamespace: string;
  nameWithNamespace: string;
  description: string;
  defaultBranch: string;
  tagList: string[];
  isPublic: boolean;
  archived: boolean;
  visibilityLevel: number;
  visibility: string;
  sshUrlToRepo: string;
  httpUrlToRepo: string;
  webUrl: string;
  homepage: string;
  owner: User;
  createdAt: string; // [date]
  lastActivityAt: string; // [date]
  creatorId: number;
  namespace: Namespace | Group;
  avatarUrl: string;
  isNeedCheckEmail: boolean;
  isReview: boolean;
  exceptBranch: string;
  runnersToken: string; // runner的token
  fileSizeLimit: number; // 单文件大小限制
  repositorySize: number;
  repositorySizeLimit: number; // 仓库大小限制
  permission: {
    projectAccess: Access;
    groupAccess?: Access;
  };
  artifacts: boolean; // 交付物开关
  importStatus: string; // 导入状态
  encoding: string; // 默认编码
  isGray: boolean; // 是否灰度仓库
  commitsCount: number;
  forkedCount: number;
  starsCount: number;
  openedPullRequestsCount: number;
  useCodeOwner: boolean;
  starred: boolean; // 是否已经关注
  pipeline: boolean; // 是否启动pipeline (添加了 aci 的服务)
  checkEmail: boolean;
  mergeRequestsEnabled: boolean;
  issuesEnabled: boolean;
  wikiEnabled: boolean;
  cooperateCount?: number;
  forbiddened: boolean;
}
