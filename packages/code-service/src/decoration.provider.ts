import { Autowired } from '@opensumi/di';
import { ClientAppContribution, Disposable, Domain } from '@opensumi/ide-core-browser';
import { Emitter, Uri } from '@opensumi/ide-core-browser';
import { IDecorationData, IDecorationsProvider, IDecorationsService } from '@opensumi/ide-decoration';
import { IThemeService } from '@opensumi/ide-theme';
import * as path from 'path';
import { CodeModelService } from './code-model.service';
import { Repository } from './repository';

export class GitDecorationProvider extends Disposable implements IDecorationsProvider {
  private static SubmoduleDecorationData: IDecorationData = {
    letter: 'S',
    color: 'gitDecoration.submoduleResourceForeground',
    tooltip: 'Submodules',
  };

  readonly label = 'code-service';

  private decorations = new Map<string, IDecorationData>();

  private _onDidChange: Emitter<Uri[]> = new Emitter();
  readonly onDidChange = this._onDidChange.event;

  constructor(private repo: Repository) {
    super();
    this.addDispose(repo.onDidAddSubmodules(this.onDidAddSubmodules, this));
  }

  private onDidAddSubmodules(submodulePath: string) {
    this.decorations.set(
      Uri.file(path.join(this.repo.root, submodulePath)).toString(),
      GitDecorationProvider.SubmoduleDecorationData,
    );
    this._onDidChange.fire([...this.decorations.keys()].map((value) => Uri.parse(value)));
  }

  async provideDecorations(resource: Uri): Promise<IDecorationData | undefined> {
    return this.decorations.get(resource.toString());
  }
}

@Domain(ClientAppContribution)
export class DecorationProvider extends Disposable implements ClientAppContribution {
  @Autowired(IThemeService)
  themeService: IThemeService;

  @Autowired(IDecorationsService)
  decorationService: IDecorationsService;

  @Autowired(CodeModelService)
  codeModel: CodeModelService;

  constructor() {
    super();
    this.addDispose(this.codeModel.onDidOpenRepository(this.onDidOpenRepository, this));
    this.codeModel.repositories.forEach(this.onDidOpenRepository, this);
  }

  onDidOpenRepository(repo: Repository) {
    const provider = new GitDecorationProvider(repo);
    this.addDispose(this.decorationService.registerDecorationsProvider(provider));
  }

  initialize() {}
}
