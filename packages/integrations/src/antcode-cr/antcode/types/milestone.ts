export interface Milestone {
  id: number;
  iid: number;
  title: string;
  description: string;
  dueDate: string;
  state: MilestoneState;
  updatedAt: string;
  createdAt: string;
  projectId: number;
  openedIssues: number;
  closedIssues: number;
}

export enum MilestoneState {
  active = 'active',
  closed = 'closed',
}
