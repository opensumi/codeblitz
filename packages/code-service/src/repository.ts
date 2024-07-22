import { CodePlatformRegistry, ICodeAPIProvider } from '@codeblitzjs/ide-code-api';
import { fsExtra } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable } from '@opensumi/di';
import { Deferred, Emitter } from '@opensumi/ide-core-common';
import * as path from 'path';
import { HeadRef, ICodeAPIProxy, ICodePlatform, IRepositoryModel, Refs, RefType, Submodule } from './types';
import { decodeRefPath, findRef, HEAD, logger, parseGitmodules } from './utils';

@Injectable({ multiple: true })
export class Repository implements IRepositoryModel {
  @Autowired(ICodeAPIProvider)
  codeAPI: ICodeAPIProvider;

  private _onDidChangeCommit = new Emitter<void>();
  readonly onDidChangeCommit = this._onDidChangeCommit.event;

  private _onDidAddSubmodules = new Emitter<string>();
  readonly onDidAddSubmodules = this._onDidAddSubmodules.event;

  /**
   * 仓库根路径
   */
  private _root: string;
  get root() {
    return this._root;
  }

  /**
   * submodules
   */
  private _submodules: Submodule[] = [];
  get submodules() {
    return this._submodules;
  }

  /**
   * 平台
   */
  private _platform: ICodePlatform;
  get platform() {
    return this._platform;
  }

  get platformConfig() {
    return CodePlatformRegistry.instance().getPlatformConfig(this.platform);
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
   * project
   */
  private _projectId?: string;
  get projectId() {
    return this._projectId;
  }
  /**
   * commit
   */
  private _commit: string;
  get commit() {
    return this._commit;
  }
  set commit(value: string) {
    if (value !== this._commit) {
      this._commit = value;
    }
    // 切相同commit分支
    this._onDidChangeCommit.fire();
  }

  get request(): ICodeAPIProxy {
    return new Proxy(Object.create(null), {
      get: (target, prop) => {
        return (...args: any[]) =>
          this.codeAPI.asPlatform(this.platform)[prop](
            {
              platform: this.platform,
              owner: this.owner,
              name: this.name,
              commit: this.commit,
              projectId: this.projectId,
            },
            ...args,
          );
      },
    });
  }

  constructor(data: {
    root: string;
    platform: ICodePlatform;
    owner: string;
    name: string;
    commit: string;
    projectId?: string;
  }) {
    this._root = data.root;
    this._platform = data.platform;
    this._owner = data.owner;
    this._name = data.name;
    this._commit = data.commit;
    this._projectId = data.projectId;
  }

  async addSubmodulePath(path: string) {
    this._onDidAddSubmodules.fire(path);
  }

  // @memoize
  async initSubmodules() {
    this._submodules = await this.parseSubmodules();
  }

  private async parseSubmodules() {
    const gitmodulesPath = path.join(this.root, '.gitmodules');

    try {
      const gitmodulesRaw = await fsExtra.readFile(gitmodulesPath, 'utf8');
      return parseGitmodules(gitmodulesRaw);
    } catch (err) {
      logger.error('parse submodules failed');
      return [];
    }
  }

  asRelativePath(absolutePath: string) {
    return path.relative(this.root, absolutePath);
  }
}

@Injectable({ multiple: true })
export class RootRepository extends Repository {
  private _onDidChangeRefs = new Emitter<void>();
  readonly onDidChangeRefs = this._onDidChangeRefs.event;

  private _onDidChangeRef = new Emitter<void>();
  readonly onDidChangeRef = this._onDidChangeRef.event;

  private _initialized = false;

  private _refs: Refs = { branches: [], tags: [] };
  get refs() {
    return this._refs;
  }

  // 和 git HEAD 一致，指向具体分支或 commit id
  private _HEAD: HeadRef | undefined;
  get HEAD(): HeadRef | undefined {
    return this._HEAD;
  }

  private _ref: string = HEAD;
  get ref() {
    return this._ref;
  }
  set ref(value) {
    this._ref = value;
    this._onDidChangeRef.fire();
  }

  private _refsInitialized = new Deferred<void>();
  get refsInitialized(): Promise<void> {
    return this._refsInitialized.promise;
  }

  /**
   * url 上显示的文件
   */
  private _revealEntry: { type: string; filepath: string } | null = null;
  get revealEntry() {
    return this._revealEntry;
  }

  private async initCommit(ref: string = HEAD, branchName?: string) {
    this.commit = await this.request.getCommit(ref);
    this._HEAD = {
      type: RefType.Head,
      name: branchName,
      commit: this.commit,
    };
  }

  /**
   * @param commit 具体的 commit
   * @param ref tag, branch
   * @param refPath [tree|blob]/branch/path
   */
  async initHEAD(
    { commit, ref, refPath, isForce }: { commit?: string; ref?: string; refPath?: string; isForce?: boolean },
  ) {
    if (this._initialized && !isForce) {
      return;
    }
    this._initialized = true;
    this.getRefs();
    if (!commit && !ref && !refPath) {
      // 查询默认分支
      const { default_branch } = await this.request.getProject();
      this.ref = default_branch || HEAD;
      await this.initCommit(this.ref);
      return;
    }
    if (commit) {
      this.commit = commit;
      this.ref = commit;
      return;
    }
    if (ref) {
      this.ref = ref;
      await this.initCommit(ref);
      return;
    }
    if (refPath) {
      const segments = decodeRefPath(refPath).split('/').filter(Boolean);
      // 暂时只支持 tree 和 blob，其它如 commit 后续看情况支持
      if (!['tree', 'blob'].includes(segments[0]) || !segments[1] || segments[1] === HEAD) {
        this.ref = HEAD;
        return this.initCommit();
      }
      const p = segments.slice(1).join('/');
      await this.getRefs();
      const branchName = findRef(
        this.refs.branches.map((item) => item.name),
        p,
      );
      const matchedRef = branchName
        || findRef(
          this.refs.tags.map((item) => item.name),
          p,
        );
      if (matchedRef) {
        this.ref = matchedRef;
        await this.initCommit(matchedRef, branchName);
      } else {
        // 此时可能是 commit
        // TODO: 正则进一步判断
        this.commit = segments[1];
        this.ref = segments[1];
      }
      this._revealEntry = {
        type: segments[0],
        filepath: segments.slice(1).join('/').slice(this.ref.length),
      };
    }
  }

  async refreshRepository(commit: string, ref: string) {
    this.commit = commit;
    this.ref = ref;
    await this.getRefs();
  }

  async getRefs() {
    const [branches, tags] = await Promise.all([
      this.request.getBranches().catch(() => []),
      this.request.getTags().catch(() => []),
    ]);
    this._refs = {
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
    this._refsInitialized.resolve();
    this._onDidChangeRefs.fire();
  }

  /**
   * statusbar 显示文案
   */
  get headLabel(): string {
    const shortCommit = this.commit.substr(0, 8);
    if (this.ref === HEAD) {
      return (
        this.refs.branches.find((br) => br.commit === this.commit)?.name
        || this.refs.tags.find((tag) => tag.commit === this.commit)?.name
        || shortCommit
      );
    }
    if (/^[0-9a-f]{40}$/.test(this.ref)) {
      return shortCommit;
    }
    return this.ref;
  }
}
