import { Branch } from './branch';
export interface Iteration {
  id: number;
  projectId: number;
  branch: string;
  platform: IterationPlatform;
  iterationMark: string;
  msgId: string;
  releaseMode: string;
  state: string;
  title: string;
  url: string;
  crateAt: string;
  updateAt: string;
}

export type BranchIterationMap = {
  [key: string]: Iteration[];
};

export enum IterationPlatform {
  linke = 'LINKE',
  yuyan = 'YUYAN',
  huoban = 'HUOBAN',
}

export enum IterationReleaseMode {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
}

export enum IterationState {
  developing = 'DEVELOPING',
  finished = 'FINISHED',
  discard = 'DISCARD',
  deleted = 'DELETED',
}

export interface BranchWithIteration extends Branch {
  branch: string;
  title: string;
}
