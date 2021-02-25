import { Injectable, Autowired } from '@ali/common-di';
import { Emitter, Deferred, getDebugLogger } from '@ali/ide-core-common';
import { CodeServiceConfig } from '@alipay/alex-core';
import { ICodeAPIService, Refs, RefType } from './types';

const HEAD = 'HEAD';

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

  private _onDidChangeRefPath = new Emitter<string>();
  readonly onDidChangeRefPath = this._onDidChangeRefPath.event;

  /**
   * 平台，antcode | gitlab | github
   */
  private _platform: string;
  get platform() {
    return this._platform;
  }

  /**
   * origin
   */
  private _origin: string;
  get origin() {
    return this._origin;
  }

  /**
   * api endpoint
   */
  private _endpoint: string;
  get endpoint() {
    return this._endpoint;
  }

  /**
   * 仓库群组或用户
   */
  private _owner: string;
  get owner() {
    return this._owner;
  }

  /**
   * 仓库名
   */
  private _name: string;
  get name() {
    return this._name;
  }

  /**
   * git HEAD，指向 具体的 commit
   */
  private _HEAD: string;
  get HEAD() {
    return this._HEAD;
  }
  set HEAD(commit: string) {
    if (commit !== this._HEAD) {
      this._HEAD = commit;
      this._onDidChangeHEAD.fire();
    }
  }

  /**
   * statusbar 显示文案
   */
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

  /**
   * refs 列表
   */
  private _refs: Refs = { branches: [], tags: [] };
  get refs() {
    return this._refs;
  }
  set refs(refs: Refs) {
    this._refs = refs;
    this._onDidChangeRefs.fire();
  }

  /**
   * ref name，初始不指定时为 HEAD
   */
  private _refName: string;
  get refName() {
    return this._refName;
  }
  set refName(name: string) {
    this._refName = name;
    let suffix = '';
    // TODO: 切换分支 tab 并未关闭，文件可能删除，目前状态不好判断，先不加
    if (name === HEAD) {
      suffix = '';
    } else {
      suffix = `/tree/${name}`;
    }
    this._onDidChangeRefPath.fire(`/${this.owner}/${this.name}${suffix}`);
  }

  get project() {
    return `${this._owner}/${this._name}`;
  }

  get projectId() {
    return `${this._owner}%2F${this._name}`;
  }

  /**
   * url 上显示的文件
   */
  private _revealEntry: { type: string; filepath: string } | null = null;
  get revealEntry() {
    return this._revealEntry;
  }
  set revealEntry(entry: { type: string; filepath: string } | null) {
    if (entry) {
      this._onDidChangeRefPath.fire(
        !entry.filepath && this.refName === HEAD
          ? `/${this.owner}/${this.name}`
          : `/${this.owner}/${this.name}/${entry.type}/${this.headLabel}${
              entry.filepath ? `/${entry.filepath}` : ''
            }`
      );
    }
  }

  async initialize(config: CodeServiceConfig) {
    this._config = config;
    this._platform = config.platform;
    this._origin = config.origin;
    this._endpoint = config.endpoint || config.origin;
    this._owner = config.owner;
    this._name = config.name;

    try {
      await this.codeAPI.initialize();
      this.reset();
    } catch (err) {
      this.logger.error(err);
      this.initState.resolve();
    }
  }

  /**
   * 无权限时需要再设置 token 后重新初始化
   */
  reset() {
    if (!this.headState.isResolved) {
      this.initHEAD();
    }
    if (!this.refsState.isResolved) {
      this.initRefs();
    }
  }

  private async initHEAD() {
    try {
      const { _config: config } = this;
      let head = '';
      if (config.refPath) {
        let maybeCommit = false;
        const segments = config.refPath.split('/').filter(Boolean);
        // 暂时只支持 tree 和 blob，其它如 commit 后续看情况支持
        if (!['tree', 'blob'].includes(segments[0]) || !segments[1] || segments[1] === HEAD) {
          head = HEAD;
        } else {
          head = segments[1];
          const p = segments.slice(1).join('/');
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
          if (matchedRef) {
            head = matchedRef;
          }
          maybeCommit = !matchedRef;
        }
        this._refName = head;
        this._revealEntry = {
          type: segments[0],
          filepath: segments.slice(1).join('/').slice(head.length),
        };
        if (!maybeCommit) {
          head = await this.codeAPI.getCommit(head);
        }
      } else {
        head = config.commit || config.branch || config.tag || config.ref || HEAD;
        this._refName = head;
        if (!config.commit) {
          head = await this.codeAPI.getCommit(head);
        }
      }
      this.HEAD = head;
      this.headState.resolve();
    } catch (err) {
      this.headState.reject();
      throw err;
    } finally {
      if (!this.initState.isResolved) {
        this.initState.resolve();
      }
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
