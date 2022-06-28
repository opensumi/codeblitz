export namespace API {
  export interface Entry {
    id: string;
    type: 'file' | 'dir';
    name: string;
    path: string;
    mode: string;
    content: string;
  }

  export interface ResponseGetProject {
    id: string;
    default_branch: string | null;
  }

  export interface ResponseGetCommit {
    id: string;
    commit: {
      sha: string;
    };
  }

  export type ResponseGetTree = {
    entries: Entry[];
    last_commit: {};
  };
  export type ResponseGetSubTree = {
    entries: Entry[] | Entry;
    last_commit: {};
  };

  export interface ResponseGetEntry extends Entry {
    size: number;
    render: 'download' | 'image' | 'text';
  }

  export type ResponseGetRefs = Array<{
    name: string;
    commit: {
      sha: string;
    };
    id: string;
  }>;

  export type BranchSlice = Array<{
    branch_type: string;
    list: Array<{
      name: string;
      last_commit: {
        sha: string;
      };
    }>;
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

  export interface Project {
    identifier: string;
    default_branch: string;
  }
  export interface BranchOrTag {
    name: string;
    commit: {
      id: string;
    };
  }
}
