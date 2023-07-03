export namespace API {
  interface Entry {
    id: string;
    type: 'commit' | 'blob' | 'tree';
    name: string;
    path: string;
    mode: string;
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

  export type ResponseContentSearch = Array<{
    lines: Array<{
      content: string;
      number: number;
    }>;
    path: string;
    ref: string;
  }>;

  export interface ResponseCommit {
    author_email: string;
    author_name: string;
    authored_date: string;
    committed_date: string;
    committer_email: string;
    committer_name: string;
    created_at: string;
    id: string;
    message: string;
    parent_ids: string[];
    short_id: string;
    title: string;
  }

  export interface ResponseCommitFileChange {
    a_mode: string;
    b_mode: string;
    binary_file: boolean;
    charset_name: string;
    deleted_file: boolean;
    diff: string;
    new_file: boolean;
    new_path: string;
    old_path: string;
    renamed_file: boolean;
    too_large: boolean;
  }

  export interface ResponseCommitCompare extends ResponseCommit {
    commits: ResponseCommit[];
    diffs: ResponseCommitFileChange[];
    compare_overflow: boolean;
    compare_same_ref: boolean;
    compare_timeout: boolean;
  }
  export interface User {
    name: string;
    email: string;
    id: number;
    username: string;
    avatar_url: string;
    bio: string;
    department: string;
    extern_uid: string;
    identities: any;
    is_admin: boolean;
    private_token: string;
    projects_limit: number;
    role: number;
    state: 'blocked' | 'active';
    web_url: string;
    website_url: string;
  }

  export interface RequestResponseOptions {
    errorOption?: boolean;
  }

  export interface CanResolveConflictResponse {
    online_resolve: boolean;
    unsupport_type: string;
  }

  export interface ResolveConflict {
    commit_message: string;
    files: {
      content: string;
      our_path: string;
      their_path: string;
    }[];
    head_sha: string;
    start_sha: string;
  }

  export interface ResolveConflictResponse {
    body: any;
    statusCode: string;
    statusCodeValue: number;
  }

  export type ConflictResponse = Conflict[];

  export interface Conflict {
    content: string;
    our_path: string;
    their_path: string;
  }
  export interface ResponseCreatePR {
    id: number;
  }
}
