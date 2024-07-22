import { EntryFileType, TreeEntry } from '../common';

export namespace API {
  interface RateLimit {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  }
  // https://docs.github.com/en/rest/reference/rate-limit
  export interface ResponseGetRateLimit {
    resources: {
      core: RateLimit;
      graphql: RateLimit;
      integration_manifest: RateLimit;
      search: RateLimit;
    };
  }

  export type ResponseGetCommit = string;

  export type RequestCreateTree = Pick<TreeEntry, 'path' | 'mode' | 'sha' | 'type'>;

  export interface ResponseGetTree {
    sha: string;
    url: string;
    tree: Array<{
      path: string;
      mode: TreeEntry['mode'];
      type: EntryFileType;
      sha: string;
      size?: number;
      url?: string;
    }>;
  }

  export type ResponseGetRefs = Array<{
    name: string;
    commit: {
      sha: string;
    };
  }>;

  export type ResponseMatchingRefs = Array<{
    ref: string;
    object: {
      sha: string;
      type: string;
    };
  }>;

  // by https://docs.github.com/zh/rest/git/blobs?apiVersion=2022-11-28#create-a-blob
  export interface ResponseCreateBlob {
    url: string;
    sha: string;
  }

  export interface ResponseBlobCommitPath {
    content: string;
    encoding: 'base64';
  }

  export interface ResponseCommit {
    sha: string;
    node_id: string;
    commit: {
      author: {
        name: string;
        email: string;
        date: string;
      };
      committer: {
        name: string;
        email: string;
        date: string;
      };
      message: string;
      tree: {
        sha: string;
        url: string;
      };
      url: string;
      comment_count: string;
      verification: {
        verified: boolean;
        reason: 'string';
        signature: null;
        payload: null;
      };
    };
    url: string;
    html_url: string;
    comments_url: string[];
    author: null;
    committer: null;
    parents: Array<{
      sha: string;
      uri: string;
      html_url: string;
    }>;
  }

  export interface ResponseCommitFileChange {
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    previous_filename?: string;
  }

  export interface ResponseCommitDetail extends ResponseCommit {
    files: ResponseCommitFileChange[];
  }

  export interface ResponseCommitCompare {
    base_commit: ResponseCommit;
    merge_base_commit: ResponseCommit;
    commits: ResponseCommit[];
    files: ResponseCommitFileChange[];
  }

  // by https://docs.github.com/zh/rest/git/refs?apiVersion=2022-11-28#create-a-reference
  export interface ResponseReference {
    ref: string;
    node_id: string;
    url: string;
    object: {
      type: string;
      sha: string;
      url: string;
    };
  }

  // by https://docs.github.com/zh/rest/users/users?apiVersion=2022-11-28#get-a-user
  export interface ResponseUser {
    email: string;
    name: string;
    id: number;
  }

  export interface ResponseCreateCommit {
    'sha': string;
    'node_id': string;
    'url': string;
    'author': {
      'date': string;
      'name': string;
      'email': string;
    };
    'committer': {
      'date': string;
      'name': string;
      'email': string;
    };
    'message': string;
    'tree': {
      'url': string;
      'sha': string;
    };
    'parents': [
      {
        'url': string;
        'sha': string;
        'html_url': string;
      },
    ];
    'verification': {
      'verified': boolean;
      'reason': string;
      'signature': string | null;
      'payload': string | null;
    };
    'html_url': string;
  }

  export interface GraphQLBlame {
    commit: {
      author: {
        avatarUrl: string;
        name: string;
        email: string;
        date: string;
      };
      committedDate: string;
      message: string;
      oid: string;
    };
    endingLine: number;
    startingLine: number;
  }
}
