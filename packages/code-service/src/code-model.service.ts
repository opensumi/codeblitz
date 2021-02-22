import { Injectable, Autowired } from '@ali/common-di';
import { Emitter, Deferred, getDebugLogger } from '@ali/ide-core-common';
import { CodeServiceConfig } from '@alipay/alex-core';
import { ICodeAPIService, Refs, State, RefType } from './types';

class StateDeferred<T = void> extends Deferred<T> {
  private _isResolved = false;
  private _isRejected = false;

  get isResolved() {
    return this._isResolved;
  }

  get isRejected() {
    return this._isRejected;
  }

  constructor() {
    super();
    this.promise.then(
      () => {
        this._isResolved = true;
      },
      () => {
        this._isRejected = true;
      }
    );
  }
}

@Injectable()
export class CodeModelService {
  @Autowired(ICodeAPIService)
  readonly codeAPI: ICodeAPIService;

  private readonly logger = getDebugLogger('code-service');

  private _config: CodeServiceConfig;

  initState = new StateDeferred();

  headState = new StateDeferred();

  refsState = new StateDeferred();

  get initialized(): Promise<void> {
    return this.initState.promise;
  }

  get headInitialized(): Promise<void> {
    return this.headState.promise;
  }

  get refsInitialized(): Promise<void> {
    return this.refsState.promise;
  }

  private _onDidChangeHEAD = new Emitter<void>();
  readonly onDidChangeHEAD = this._onDidChangeHEAD.event;

  private _onDidChangeRefs = new Emitter<void>();
  readonly onDidChangeRefs = this._onDidChangeRefs.event;

  /**
   * 平台，antcode | gitlab | github
   */
  private _platform: string;
  /**
   * origin
   */
  private _origin: string;
  /**
   * api endpoint
   */
  private _endpoint: string;
  /**
   * 仓库群组或用户
   */
  private _owner: string;
  /**
   * 仓库名
   */
  private _name: string;
  /**
   * git HEAD，指向 具体的 commit
   */
  private _HEAD: string;
  /**
   * refs 列表
   */
  private _refs: Refs = { branches: [], tags: [] };

  get platform() {
    return this._platform;
  }

  get origin() {
    return this._origin;
  }

  get endpoint() {
    return this._endpoint;
  }

  get owner() {
    return this._owner;
  }

  get name() {
    return this._name;
  }

  get project() {
    return `${this._owner}/${this._name}`;
  }

  get projectId() {
    return `${this._owner}%2F${this._name}`;
  }

  get refs() {
    return this._refs;
  }

  set refs(refs: Refs) {
    this._refs = refs;
    this._onDidChangeRefs.fire();
  }

  get HEAD() {
    return this._HEAD;
  }

  set HEAD(commit: string) {
    if (commit !== this._HEAD) {
      this._HEAD = commit;
      this._onDidChangeHEAD.fire();
    }
  }

  get headLabel(): string {
    const HEAD = this.HEAD;
    if (!HEAD) {
      return '';
    }
    return (
      this.refs.tags.find((tag) => tag.commit === this.HEAD)?.name ||
      this.refs.branches.find((br) => br.commit === this.HEAD)?.name ||
      HEAD.substr(0, 8)
    );
  }

  private _refWithPath: string[] = [];
  // 初始需要展示的文件夹或文件
  revealEntry = {
    type: '', // tree | blob
    filepath: '',
  };

  async initialize(config: CodeServiceConfig) {
    this._config = config;
    this._platform = config.platform;
    this._origin = config.origin;
    this._endpoint = config.endpoint || config.origin;

    if ('path' in config) {
      const { path } = config;
      const [owner, name, ...refWithPath] = path.split('/').filter(Boolean);
      this._owner = owner;
      this._name = name;
      this._refWithPath = refWithPath;
    } else {
      this._owner = config.owner;
      this._name = config.name;
    }

    try {
      await this.codeAPI.initialize();
      await this.reset();
    } catch (err) {
      this.logger.error(err);
    } finally {
      this.initState.resolve();
    }
  }

  /**
   * 无权限时需要再设置 token 后重新初始化
   */
  async reset() {
    if (!this.headState.isResolved) {
      await this.initHEAD();
    }
    if (!this.refsState.isResolved) {
      this.initRefs();
    }
  }

  private async initHEAD() {
    const HEAD = 'HEAD';
    try {
      const { _config: config, _refWithPath } = this;
      let head = '';
      if ('path' in config) {
        // 暂时只支持 tree 和 blob，其它如 commit 后续看情况支持
        let maybeCommit = false;
        if (!['tree', 'blob'].includes(_refWithPath[0])) {
          head = HEAD;
        } else {
          head = _refWithPath[1];
          if (head !== HEAD) {
            const p = _refWithPath.slice(2).join('/');
            await this.refsInitialized;
            const matchedRef =
              findRef(
                this.refs.branches.map((item) => item.name),
                p
              ) ||
              findRef(
                this.refs.tags.map((item) => item.name),
                p
              );
            console.log('matchedRef', matchedRef);
            if (matchedRef) {
              head = matchedRef;
            }
            maybeCommit = !matchedRef;
          }
        }
        if (!maybeCommit) {
          head = await this.codeAPI.getCommit(head);
        }
        this.revealEntry = {
          type: _refWithPath[0],
          filepath: _refWithPath.slice(1).join('/').slice(head.length),
        };
      } else {
        if (config.commit) {
          head = config.commit;
        } else {
          head = await this.codeAPI.getCommit(config.ref || config.branch || config.tag || HEAD);
        }
      }
      this.HEAD = head;
      this.headState.resolve();
    } catch (err) {
      this.headState.reject();
      throw err;
    }
  }

  async initRefs() {
    try {
      const { branches, tags } = await this.codeAPI.getRefs();
      this.refs = {
        branches: branches.map((item) => ({
          type: RefType.Head,
          name: item.name,
          commit: item.commit.id,
        })),
        tags: tags.map((item) => ({
          type: RefType.Tag,
          name: item.name,
          commit: item.commit.id,
        })),
      };
      this.refsState.resolve();
    } catch (err) {
      this.refsState.reject();
      this.logger.error(err);
    }
  }
}

const findRef = (refs: string[], path: string): string => {
  const addSlash = (str: string) => (str[str.length - 1] !== '/' ? `${str}/` : str);
  const countSlash = (str: string) => (str.match(/\//g) || []).length;

  path = addSlash(path);

  const candidateRefs = refs.filter((ref) => path.startsWith(addSlash(ref)));
  // 或许这里不需要，理论 ref 路径互不包含
  candidateRefs.sort((a, b) => countSlash(a) - countSlash(b));

  return candidateRefs[0] || '';
};
