export namespace API {
  export type ResponseGetCommit = string;

  export interface ResponseGetTree {
    sha: string;
    url: string;
    tree: Array<{
      path: string;
      mode: string;
      type: 'commit' | 'tree' | 'blob';
      sha: string;
      size?: number;
      url?: string;
    }>;
  }
}
