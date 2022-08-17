export namespace API {
  export interface Entry {
    id: string;
    type: 'file' | 'dir';
    name: string;
    path: string;
    mode: string;
    content: string;
    sha: string;
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

  export interface ResponseFileBlame {
    file_size: number;
    file_name: string;
    num_lines: number;
    blame_parts: FileBlame[];
  }

  export interface FileBlame {
    commit: ResponseCommit;
    current_number: number;
    effect_line: number;
    lines: string[];
  }
  export interface ResponseCommit {
    sha: string;
    author: {
      id: string;
      name: string;
      type: string;
      image_url: string;
      email?: string; // gitlink 无email数据
    };
    committer: {
      id: string;
      name: string;
      type: string;
      image_url: string;
      email?: string; // gitlink 无email数据
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

  export interface ResponseCommitFileChangeData {
    file_nums: number;
    total_addition: number;
    total_deletion: number;
    files: ResponseCommitFileChange[];
  }

  export interface ResponseCommitFileChange {
    addition: number;
    deletion: number;
    diff: string;
    is_ambiguous: boolean;
    is_bin: boolean;
    is_created: boolean;
    is_deleted: boolean;
    is_incomplete: boolean;
    is_incomplete_line_too_long: boolean;
    is_lfs_file: boolean;
    is_protected: boolean;
    is_renamed: boolean;
    is_submodule: boolean;
    name: string;
    oldname: string;
    sections: Array<{
      file_name: string;
      name: string;
      lines: Array<any>;
    }>;
    // 文件类型 1: 新增 2: 更改 3: 删除 4: 重命名 5: 复制
    type: number;
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
