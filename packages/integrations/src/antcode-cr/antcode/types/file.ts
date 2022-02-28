import { Commit } from './commit';

export enum FileListType {
  tree = 'tree',
  blob = 'blob',
  commit = 'commit',
}

export interface File {
  id: string;
  mode: string;
  name: string;
  path: string;
  type: FileListType;
  url?: string;
}

export interface FileWithCommit extends File {
  commit?: Commit;
}

export interface FileDetail {
  charsetName: string;
  content: string;
  fileName: string;
  filePath: string;
  highlightedContent: string;
  ref: string;
  size: number;
}

export interface TreeEntry extends File {
  size: number;
  render: string;
}

export enum FileShowType {
  text = 'text',
  image = 'image',
  download = 'download',
}
