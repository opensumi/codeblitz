export namespace API {
  export interface RequestResponseOptions {
    errorOption?: boolean;
  }
  export interface ResponseFileBlame {
    start: number;
    contents: string[];
    commit: {
      author_email: string;
      author_name: string;
      author_username: string;
      created_at: string;
      id: string;
      title: string;
      user: {
        avatar_url: string;
        email: string;
        id: string;
        username: string;
      };
    };
  }

  export interface ResponseBranchesInfo {
    name: string;
    commit: {
      sha: string;
    };
    protected: boolean;
  }

  export interface ResponseContentBlob {
    content: string;
    type: 'file';
    encoding: 'base64';
  }

  export interface ResponseFileTreeObject {
    tree: ResponseFileTree[];
    type: 'blob' | 'tree' | 'symlink' | 'commit';
    url: string;
    truncated: boolean;
  }

  export interface ResponseFileTree {
    mode: string;
    path: string;
    sha: string;
    type: 'blob' | 'tree' | 'symlink' | 'commit';
  }

  export interface ResponseCommit {
    sha: string;
    commit: {
      author: ResponseCommitAuthor;
      committer: ResponseCommitAuthor;
      message: string;
    };
    parents: Array<{
      sha: string;
      url: string;
    }>;
    files: Array<ResponseCommitFileChange>;
  }

  export interface ResponseCommitAuthor {
    name: string;
    date: string;
    email: string;
  }

  export interface ResponseRepoInfo {
    full_name: string;
    default_branch: string;
  }

  export interface ResponseBlobByCommitPath {
    type: 'blob' | 'file';
    encoding: 'base64' | 'text';
    content: string;
    sha: string;
    path: string;
  }

  export interface ResponseBranch {
    name: string;
    protected: boolean;
    commit: {
      author: ResponseCommitAuthor;
      commit: {
        author: ResponseCommitAuthor;
        committer: ResponseCommitAuthor;
        message: string;
      };
      sha: string;
    };
  }

  export interface ResponseCommitCompare {
    base_commit: ResponseCommit;
    merge_base_commit: ResponseCommit;
    comits: ResponseCommit[];
    files: ResponseCommitFileChange[];
  }

  export interface ResponseCommitFileChange {
    sha: string;
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch: string;
  }

  export interface FileActionResult {
    sha: string;
    commit: {
      author: ResponseCommitAuthor;
      committer: ResponseCommitAuthor;
      message: string;
    };
    files: ResponseCommitFileChange[];
  }
}
