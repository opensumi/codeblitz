import { CodePlatformRegistry, ICodeAPIProvider } from '@codeblitzjs/ide-code-api';
import { AppConfig } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import { CommandService, Emitter, localize } from '@opensumi/ide-core-common';
import { IMessageService } from '@opensumi/ide-overlay';
import md5 from 'md5';
import * as path from 'path';
import { Repository, RootRepository } from './repository';
import { ICodePlatform, ICodeServiceConfig, InitializeState, TreeEntry } from './types';
import { encodeRefPath, HEAD, isDescendant, logger, parseSubmoduleUrl } from './utils';

@Injectable()
export class CodeModelService {
  @Autowired(ICodeAPIProvider)
  readonly codeAPI: ICodeAPIProvider;

  @Autowired(AppConfig)
  private readonly appConfig: AppConfig;

  @Autowired(ICodeServiceConfig)
  private readonly codeServiceConfig: ICodeServiceConfig;

  @Autowired(IMessageService)
  messageService: IMessageService;

  @Autowired(CommandService)
  commandService: CommandService;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  private _rootRepository: RootRepository;
  get rootRepository() {
    return this._rootRepository;
  }

  public repositories: Repository[] = [];

  private _onDidOpenRepository = new Emitter<Repository>();
  readonly onDidOpenRepository = this._onDidOpenRepository.event;

  constructor() {
    const codeServiceConfig = this.codeServiceConfig;
    const configs = CodePlatformRegistry.instance().getCodePlatformConfigs();

    this._rootRepository = this.injector.get(RootRepository, [
      {
        root: this.appConfig.workspaceDir,
        owner: codeServiceConfig.owner,
        name: codeServiceConfig.name,
        platform: codeServiceConfig.platform,
        projectId: codeServiceConfig.projectId,
        commit: 'HEAD',
      },
    ]);

    this.repositories.push(this._rootRepository);

    this._onDidOpenRepository.fire(this._rootRepository);

    Object.keys(configs).forEach((platform) => {
      if (codeServiceConfig[platform]) {
        CodePlatformRegistry.instance().extendPlatformConfig(platform, codeServiceConfig[platform]!);
      }
    });
  }

  async initialize(): Promise<InitializeState> {
    try {
      const isAvailable = await this.rootRepository.request.available();
      if (!isAvailable) {
        return 'Failed';
      }
      const { codeServiceConfig: config } = this;
      await this.rootRepository.initHEAD({
        commit: config.commit,
        ref: config.branch || config.tag || config.ref,
        refPath: config.refPath,
      });
      return 'Initialized';
    } catch (err) {
      logger.error(err);
      return 'Failed';
    }
  }

  /**
   * 无权限时需要再设置 token 后重新初始化
   */
  async reinitialize(isForce?: boolean) {
    const { codeServiceConfig: config } = this;
    await this.rootRepository.initHEAD({
      commit: config.commit,
      ref: config.branch || config.tag || config.ref,
      refPath: config.refPath,
      isForce,
    });
  }

  getWritableFolder() {
    return md5(path.join(this.appConfig.workspaceDir, this.rootRepository.commit));
  }

  createRepository(parent: Repository, entry: TreeEntry) {
    const submodule = parent.submodules.find(({ path }) => path === entry.path);
    if (!submodule) {
      this.messageService.error(localize('code-service.submodules-not-found', entry.path));
      logger.error(`[Code Service] not submodule for ${path}`);
      return;
    }
    const configs = CodePlatformRegistry.instance().getCodePlatformConfigs();
    const project = parseSubmoduleUrl(submodule.url, configs);
    if (!project) {
      this.messageService.error(localize('code-service.submodules-parse-error', submodule.url));
      logger.error(`[Code Service] not support ${submodule.url}`);
      return;
    }
    const newRepo = this.injector.get(Repository, [
      {
        root: path.join(parent.root, entry.path),
        platform: project.platform,
        owner: project.owner,
        name: project.name,
        commit: entry.id,
      },
    ]);
    this.repositories.push(newRepo);
    this._onDidOpenRepository.fire(newRepo);
    return newRepo;
  }

  getRepository(repository: Repository): Repository | undefined;
  getRepository(p: string): Repository | undefined;
  getRepository(hint: any): Repository | undefined {
    if (!hint) {
      return undefined;
    }

    if (hint instanceof Repository) {
      return this.repositories.filter((r) => r === hint)[0];
    }

    const resourcePath: string = hint;

    outer: for (
      const targetRepository of this.repositories.sort(
        (a, b) => b.root.length - a.root.length,
      )
    ) {
      if (!isDescendant(targetRepository.root, resourcePath)) {
        continue;
      }

      for (const submodule of targetRepository.submodules) {
        const submoduleRoot = path.join(targetRepository.root, submodule.path);

        if (isDescendant(submoduleRoot, resourcePath)) {
          continue outer;
        }
      }

      return targetRepository;
    }

    return undefined;
  }

  replaceBrowserUrl({ type, filepath }: { type: 'blob' | 'tree'; filepath?: string }) {
    if (type !== 'blob' && type !== 'tree') {
      return;
    }
    let urlPath = '';
    const { rootRepository } = this;
    const { refs, commit } = rootRepository;
    if (!filepath && rootRepository.ref === HEAD) {
      urlPath = `/${rootRepository.owner}/${rootRepository.name}`;
    } else {
      let ref: string = rootRepository.ref;
      if (ref === HEAD) {
        ref = refs.branches.find((br) => br.commit === commit)?.name
          || refs.tags.find((tag) => tag.commit === commit)?.name
          || HEAD;
      }
      urlPath = `/${rootRepository.owner}/${rootRepository.name}/${type}/${ref}${filepath ? `/${filepath}` : ''}`;
    }
    this.commandService.tryExecuteCommand(
      'code-service.replace-browser-url',
      encodeRefPath(urlPath),
    );
  }

  replaceBrowserUrlLine(lineNumbers: [number, number]) {
    const hash = this.rootRepository.platformConfig.line.format(lineNumbers);
    this.commandService.tryExecuteCommand('code-service.replace-browser-url-hash', hash);
  }

  parseLineHash(hash: string) {
    if (hash) {
      return this.rootRepository.platformConfig.line.parse(hash);
    }
  }
}
