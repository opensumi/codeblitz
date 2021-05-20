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
}
