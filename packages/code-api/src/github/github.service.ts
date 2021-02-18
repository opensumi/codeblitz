import { Injectable, Autowired } from '@ali/common-di';
import { localize } from '@ali/ide-core-common';
import {
  CodeModelService,
  ICodeAPIService,
  TreeEntry,
  EntryParam,
} from '@alipay/alex-code-service';
import { IMessageService } from '@ali/ide-overlay';
import { request, RequestOptions, RequestError } from '@alipay/alex-shared';
import { createUrl } from '../common/utils';
import { API } from './types';

const endpoint = 'https://api.github.com/graphql';

@Injectable()
export class GitHubService1 implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  public readonly rateLimit = {
    limit: 0,
    remaining: 0,
    reset: 0,
  };

  initialize() {
    return Promise.resolve();
  }

  transformStaticResource(path: string) {
    return '';
  }

  private async request<T = any>(options?: RequestOptions): Promise<T> {
    try {
      const response = await request<Response>(endpoint, {
        method: 'post',
        headers: {
          Authorization: 'token 25e878a68a8159c3c3c7f312ef5618c9912d90c8',
        },
        ...options,
      });

      this.rateLimit.limit = Number(response.headers.get('X-RateLimit-Limit'));
      this.rateLimit.remaining = Number(response.headers.get('X-RateLimit-Remaining'));
      this.rateLimit.reset = Number(response.headers.get('X-RateLimit-Reset'));

      const data = await response.json();
      if (data.errors) {
        throw new RequestError(
          'Graphql Error',
          data.errors.map((item) => item.message).join('\n'),
          data
        );
      }
      return data.data;
    } catch (err) {
      const { status } = err.response?.status;

      let messageKey = 'error.unknown';
      if (status === 401) {
        messageKey = 'github.invalid-token';
      } else if (status === 403) {
        messageKey = 'github.request-rate-limit';
      } else if (status === 404) {
        messageKey = 'github.resource-not-found';
      }
      this.messageService.error(localize(messageKey));

      throw err;
    }
  }

  async requestObject(type: 'Commit' | 'Tree' | 'Blob', query: string, expression: string) {
    const data = await this.request({
      data: {
        query: `
          query($owner: String!, $name: String!, $expression: String!) {
            repository(name: $name, owner: $owner) {
              object(expression: $expression) {
                ... on ${type} {
                  ${query}
                }
              }
            }
          }
        `,
        variables: {
          owner: this.codeModel.owner,
          name: this.codeModel.name,
          expression,
        },
      },
    });
    return data.repository.object;
  }

  async getCommit(ref: string) {
    const data = await this.requestObject('Commit', `oid`, ref);
    return data.oid;
  }

  async getTree(path: string) {
    await this.codeModel.isInitialized;
    const data = await this.requestObject(
      'Tree',
      `
        entries {
          type
          mode
          path
          sha: oid
          object {
            ... on Blob {
              byteSize,
              isBinary
            }
          }
        }
      `,
      `${this.codeModel.HEAD}:${path}`
    );
    return data.entries.map((item) => {
      const slashIndex = item.path.lastIndexOf('/');
      item.name = item.path.slice(slashIndex + 1);
      item.size = item.object.byteSize;
      item.fileType = item.object.isBinary ? 'binary' : 'text';
      delete item.object;
      return item;
    });
  }

  async getBlob(entry: EntryParam) {
    await this.codeModel.isInitialized;
    const data = await this.requestObject(
      'Blob',
      `
        isBinary
        text
      `,
      `${this.codeModel.HEAD}:${entry.path}`
    );
    const text = data.text || '';
    return Buffer.from(text);
  }
}

@Injectable()
export class GitHubService implements ICodeAPIService {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(IMessageService)
  messageService: IMessageService;

  public readonly rateLimit = {
    limit: 0,
    remaining: 0,
    reset: 0,
  };

  initialize() {
    return Promise.resolve();
  }

  transformStaticResource(path: string) {
    return '';
  }

  private async request<T = any>(path: string, options?: RequestOptions): Promise<T> {
    try {
      const url = createUrl(this.codeModel.endpoint, path);
      const { responseType, headers, ...rest } = options || {};

      const response = await request<Response>(url, {
        headers: {
          // Authorization: 'token 25e878a68a8159c3c3c7f312ef5618c9912d90c8',
          ...headers,
        },
        ...rest,
      });

      this.rateLimit.limit = Number(response.headers.get('X-RateLimit-Limit'));
      this.rateLimit.remaining = Number(response.headers.get('X-RateLimit-Remaining'));
      this.rateLimit.reset = Number(response.headers.get('X-RateLimit-Reset'));

      return responseType ? response[responseType]() : response;
    } catch (err) {
      console.dir(err);
      const { status } = err.response || {};

      let messageKey = 'error.unknown';
      if (status === 401) {
        messageKey = 'github.invalid-token';
      } else if (status === 403) {
        messageKey = 'github.request-rate-limit';
      } else if (status === 404) {
        messageKey = 'github.resource-not-found';
      }
      this.messageService.error(`[${status || '400'}] ${localize(messageKey)}`);

      throw err;
    }
  }

  async getCommit(ref: string) {
    return this.request<string>(
      `/repos/${this.codeModel.owner}/${this.codeModel.name}/commits/${ref}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.sha',
        },
        responseType: 'text',
      }
    );
  }

  async getTree(path: string) {
    await this.codeModel.isInitialized;
    const data = await this.request<API.ResponseGetTree>(
      `/repos/${this.codeModel.owner}/${this.codeModel.name}/git/trees/${this.codeModel.HEAD}:${path}`,
      {
        responseType: 'json',
      }
    );
    return data.tree.map<TreeEntry>((item) => {
      const entry: TreeEntry = {
        ...item,
        name: item.path,
        path: `${path ? `${path}/` : ''}${item.path}`,
        id: item.sha,
      };
      return entry;
    });
  }

  async getBlob(entry: EntryParam) {
    await this.codeModel.isInitialized;
    const buf = await this.request<ArrayBuffer>(
      `/repos/${this.codeModel.owner}/${this.codeModel.name}/git/blobs/${entry.id}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
        },
        responseType: 'arrayBuffer',
      }
    );
    return Buffer.from(buf);
  }
}
