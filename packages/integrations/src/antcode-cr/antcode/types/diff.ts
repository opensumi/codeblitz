export interface Diff {
  aMode: string;
  bMode: string;
  binaryFile: boolean;
  deletedFile: boolean;
  diff: string;
  newFile: boolean;
  newPath: string;
  oldPath: string;
  renamedFile: boolean;
  tooLarge: boolean;
  addLineNum?: number;
  delLineNum?: number;
  commitSha?: string;
}

export type DiffOverview = Omit<Diff, 'diff'> & {
  id: number;
};

export function isDiffOverview(d: Diff | DiffOverview): d is DiffOverview {
  return !!(d as Diff & DiffOverview).id && !(d as Diff & DiffOverview).diff;
}
