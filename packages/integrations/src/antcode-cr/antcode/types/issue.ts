import { User } from './user';
import { Milestone } from './milestone';
import { Label } from './labels';
import { Project } from './project';

export enum IssueState {
  opened = 'opened',
  closed = 'closed',
  reopened = 'reopened',
}

export interface Issue {
  id: number;
  iid: number;
  projectId: number;
  title: string;
  description: string;
  labels: string[];
  labelDetails: Label[];
  milestone: Milestone;
  assignee?: User;
  author: User;
  state: IssueState;
  updatedAt: string;
  createdAt: string;
  updatedBy: User;
  noteCount: Number;
  project: Project;
}

export interface ListIssue {
  issueProvider: IssueProvider;
  issueType: IssueType;
  issueId: string;
  issueSite: string;
  title: string;
  webUrl: string;
  status: string;
  issueStatus: IssueStatus;
  assignTo: string;
  author: string;
  createAt: string;
  id?: number;
  issueTitle: string;
  issueUrl: string;
}

export interface IssueCondition {
  issueProvider: IssueProvider;
  issueSite: string;
  issueType: IssueType;
  id: string;
}

export const enum IssueProvider {
  aone = 'AONE',
  linke = 'LINKE',
  baiyan = 'BAIYAN',
  basement = 'BASEMENT',
}

export const enum IssueType {
  bug = 'BUG',
  req = 'REQ',
  task = 'TASK',
  iterator = 'ITERATOR',
}
export const enum IssueStatus {
  opened = 'OPENED',
  closed = 'CLOSED',
  finished = 'FINISHED',
}

export interface IssuesCondition {
  page: number;
  pageSize: number;
  provider: 'AONE';
  site: string;
  type: IssueType;
  assignTo: number;
  author: number;
  status: IssueStatus;
  search: string;
}
