import { Injectable, Autowired } from '@ali/common-di';
import { Emitter, Event, memoize, getDebugLogger } from '@ali/ide-core-common';
import { CodeServiceConfig } from '@alipay/alex-core';
import { ICodeAPIService, Ref, State, RefType } from './types';

@Injectable()
export class CodeModelService {
  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

  private _config: CodeServiceConfig;

  private _state: State = 'Uninitialized';
  get state(): State {
    return this._state;
  }

  private _onDidChangeState = new Emitter<State>();
  readonly onDidChangeState = this._onDidChangeState.event;

  private _onDidChangeHEAD = new Emitter<string>();
  readonly onDidChangeHEAD = this._onDidChangeHEAD.event;

  setState(state: State): void {
    this._state = state;
    this._onDidChangeState.fire(state);
  }

  @memoize
  get isInitialized(): Promise<State> {
    if (this._state === 'Initialized') {
      return Promise.resolve(this._state);
    }
    return Event.toPromise(Event.filter(this.onDidChangeState, (s) => s === 'Initialized'));
  }

  @memoize
  get isFailed(): Promise<State> {
    if (this._state === 'Failed') {
      return Promise.resolve(this._state);
    }
    return Event.toPromise(Event.filter(this.onDidChangeState, (s) => s === 'Failed'));
  }

  @memoize
  get isFullInitialized(): Promise<State> {
    if (this._state === 'FullInitialized') {
      return Promise.resolve(this._state);
    }
    return Event.toPromise(Event.filter(this.onDidChangeState, (s) => s === 'FullInitialized'));
  }

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
  private _refs: Ref[];

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

  get HEAD() {
    return this._HEAD;
  }

  set HEAD(commit: string) {
    this._HEAD = commit;
    this._onDidChangeHEAD.fire(this._HEAD);
  }

  get headLabel() {
    const HEAD = this.HEAD;
    if (!HEAD) {
      return '';
    }
    let tagName = '';
    let branchName = '';
    this.refs.forEach((iref) => {
      if (iref.commit !== HEAD) return;
      if (iref.type === RefType.Tag) {
        tagName = iref.name;
      } else {
        branchName = iref.name;
      }
    });
    return tagName || branchName || HEAD.substr(0, 8);
  }

  initialize(config: CodeServiceConfig) {
    this._config = config;
    this.initializeHEAD()
      .then(() => this.initializeRepository())
      .catch((err) => getDebugLogger().error(err));
  }

  private async initializeHEAD() {
    const { _config: config } = this;
    this._platform = config.platform;
    this._origin = config.origin;
    this._endpoint = config.endpoint || config.origin;
    this._owner = config.owner;
    this._name = config.name;

    try {
      await this.codeAPI.initialize();

      let commitSHA = config.commit;
      if (!commitSHA) {
        const ref = config.ref || config.branch || config.tag || 'HEAD';
        commitSHA = await this.codeAPI.getCommit(ref);
      }
      this._HEAD = commitSHA;
      this.setState('Initialized');
    } catch (err) {
      this.setState('Failed');
    }
  }

  //TODO: 获取其它数据信息
  private async initializeRepository() {
    this.setState('FullInitialized');
  }
}
