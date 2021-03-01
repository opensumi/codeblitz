import { Autowired, Injectable } from '@ali/common-di';
import { ClientAppContribution, Domain, AppConfig } from '@ali/ide-core-browser';
import { IDecorationsService, IDecorationsProvider, IDecorationData } from '@ali/ide-decoration';
import { Uri, Emitter } from '@ali/ide-core-browser';
import { FileTreeService } from '@ali/ide-file-tree-next/lib/browser/file-tree.service';
import { IThemeService } from '@ali/ide-theme';
import * as path from 'path';
import { CodeModelService } from './code-model.service';
import { Submodule } from './types';

@Injectable()
export class GitDecorationsProvider implements IDecorationsProvider {
  readonly label = 'code-service';

  readonly onDidChangeEmitter: Emitter<Uri[]> = new Emitter();

  @Autowired(FileTreeService)
  fileTreeService: FileTreeService;

  @Autowired(CodeModelService)
  codeModel: CodeModelService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  get onDidChange() {
    return this.onDidChangeEmitter.event;
  }

  private lastSubmodules: Submodule[] | null;
  private _decorationsStatus: Record<string, true> = {};
  get decorationStatus(): Promise<Record<string, true>> {
    return this.codeModel.submodules
      .then((submodules) => {
        if (submodules !== this.lastSubmodules) {
          this.lastSubmodules = submodules;
          this._decorationsStatus = submodules.reduce((obj, item) => {
            obj[Uri.file(path.join(this.appConfig.workspaceDir, item.path)).toString()] = true;
            return obj;
          }, {});
        }
        return this._decorationsStatus;
      })
      .catch(() => ({}));
  }

  async provideDecorations(resource: Uri): Promise<IDecorationData | undefined> {
    const status = await this.decorationStatus;
    return status[resource.toString()]
      ? {
          letter: 'S',
          source: resource.toString(),
          color: 'gitDecoration.submoduleResourceForeground',
          tooltip: 'Submodules',
        }
      : undefined;
  }
}

@Domain(ClientAppContribution)
export class DecorationProvider implements ClientAppContribution {
  @Autowired(IThemeService)
  themeService: IThemeService;

  @Autowired(GitDecorationsProvider)
  gitDecorationProvider: GitDecorationsProvider;

  @Autowired(IDecorationsService)
  decorationService: IDecorationsService;

  onDidStart() {
    this.themeService.registerColor({
      id: 'gitDecoration.submoduleResourceForeground',
      description: 'colors.submodule',
      defaults: {
        light: '#1258a7',
        dark: '#8db9e2',
        highContrast: '#8db9e2',
      },
    });
    this.decorationService.registerDecorationsProvider(this.gitDecorationProvider);
  }
}
