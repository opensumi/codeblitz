export namespace API {
  interface Entry {
    id: string;
    type: 'commit' | 'blob' | 'tree';
    name: string;
    mode: string;
  }

  export interface ResponseGetProject {
    id: string;
    default_branch: string | null;
  }

  export interface ResponseGetCommit {
    id: string;
  }

  export type ResponseGetTree = Entry[];

  export interface ResponseGetEntry extends Entry {
    size: number;
    render: 'download' | 'image' | 'text';
  }
}
