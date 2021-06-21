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

  export type ResponseGetRefs = Array<{
    name: string;
    commit: {
      id: string;
    };
  }>;

  export interface ResponseCommit {
    author_email: string;
    author_name: string;
    created_at: string;
    id: string;
    message: string;
    short_id: string;
    title: string;
  }

  export interface ResponseCommitFileChange {
    a_mode: string;
    b_mode: string;
    deleted_file: boolean;
    diff: string;
    new_file: boolean;
    new_path: string;
    old_path: string;
    renamed_file: boolean;
  }

  export interface ResponseCommitCompare extends ResponseCommit {
    commits: ResponseCommit[];
    diffs: ResponseCommitFileChange[];
    compare_overflow: boolean;
    compare_same_ref: boolean;
  }
}
