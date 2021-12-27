import { User } from './user';
import { Diff } from './diff';

export interface Note {
  id: number;
  note: string;
  path: string;
  author: User;
  lineCode: string; // sha1(path)_oldLine_newLine
  commitId: string;
  noteableType: string;
  noteableId: number;
  projectId: number;
  stDiff: Diff;
  latestStDiff: Diff;
  system: boolean; // 是否系统信息
  isAward: boolean; // 是否评定
  createdAt: string;
  updatedAt: string;
  type: NoteType;
  state: NoteState;
  discussionId?: number;
  labels: string[];
  resolvedAt: string;
  resolvedBy: User;
  outdated: boolean; // 评论过期 针对diff comment
}

export enum NoteType {
  comment = 'Comment',
  problem = 'Problem',
}

export enum NoteState {
  opened = 'opened',
  resolved = 'resolved',
  invalid = 'invalid',
}

export type NoteCreatePick = Pick<Note, 'lineCode' | 'note' | 'path' | 'type' | 'discussionId'> & {
  diffId?: number;
};
