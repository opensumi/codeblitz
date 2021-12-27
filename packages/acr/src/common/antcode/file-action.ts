export interface FileAction {
  actionType: FileActionType;
  content: string;
  encoding?: FileActionEncoding;
  filePath: string;
}

export enum FileActionType {
  create = 'CREATE',
  update = 'UPDATE',
  delete = 'DELETE',
}

export enum FileActionEncoding {
  text = 'text',
  base64 = 'base64',
}

export interface FileActionHeader {
  authorEmail: string;
  authorName: string;
  branch: string;
  commitMessage: string;
  lastCommitId?: string;
  startBranch?: string;
}

export interface FileActionResult {
  branchCreated: boolean;
  branchName: string;
  commitId: string;
  fileName: string;
}

export interface RepositoryFileModel {
  content: string;
  commitId: string;
  fileName: string;
  filePath: string;
  ref: string;
}
