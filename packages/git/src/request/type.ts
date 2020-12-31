export namespace API {
  export type ObjectType = 'commit' | 'tree' | 'blob';

  export interface ResponseGetProjectById {
    id: number;
    default_branch: string;
  }

  export interface ResponseGetTreeEntry {
    id: string;
    name: string;
    path: string;
    type: ObjectType;
    mode: string;
  }

  export interface ResponseGetCommit {
    id: string;
  }

  export interface ObjectTree {
    id: string;
    mode: string;
    name: string;
    path: string;
    type: ObjectType;
  }

  export type ResponseGetTree = ObjectTree[];

  export type ResponseGetBlob = string;
}
