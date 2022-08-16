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
  export interface ResponseGetCommits {
    total_count: number;
    commits: ResponseCommits;
  }

  export type ResponseGetTree = {
    entries: Entry[];
    last_commit: {};
  };
  export type ResponseGetSubTree = {
    entries: Entry[] | Entry;
    last_commit: {};
  };
  export type ResponseFileContent = {
    content: string;
    encoding: 'base64';
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

  // export interface ResponseCommit {
  //   author_email: string;
  //   author_name: string;
  //   created_at: string;
  //   id: string;
  //   message: string;
  //   short_id: string;
  //   title: string;
  //   sha: string;
  // }

  export interface ResponseCommit {
    sha: string;
    author: {
      id: string;
      name: string;
      type: string;
      image_url: string;
    };
    committer: {
      id: string;
      name: string;
      type: string;
      image_url: string;
    };
    commit_message: string;
    parent_shas: string[];
    authored_time: string;
    commited_time: string;
  }

  export type ResponseCommits = Array<{
    sha: string;
    author: {
      id: string;
      name: string;
      type: string;
      image_url: string;
    };
    committer: {
      id: string;
      name: string;
      type: string;
      image_url: string;
    };
    commit_message: string;
    parent_shas: string[];
    files: string[];
    commit_date: string;
    commit_time: string;
    branch: string;
  }>;

  export interface ResponsePush {
    commit: ResponseCommit;
    contents: files;
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

  export interface User {
    username: string;
    user_id: number;
    admin: boolean;
    email: string;
    has_trace_user: false;
    image_url: string;
    // 登陆账号
    login: string;
  }

  export type files = Array<{
    html_url: string;
    sha: string;
    path: string;
    size: number;
    uri: string;
    type: 'file' | 'dir';
    name: string;
  }>;
}
