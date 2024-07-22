export namespace API {
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

  export interface ResponseFileTree {
    mode: string;
    path: string;
    sha: string;
    type: 'blob' | 'tree' | 'symlink' | 'commit';
  }

  export interface ResponseCommit {
    commit: {
      sha: string;
    };
  }

  export interface ResponseRepoInfo {
    name: string;
    default_branch: string;
  }
}
