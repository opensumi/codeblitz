import { BrowserModule, ClientAppContribution, IClientApp } from '@opensumi/ide-core-browser';
import { CommandContribution, Domain, MaybePromise } from '@opensumi/ide-core-common';
import { Autowired, Injectable } from '../../modules/opensumi__common-di';
import { IDiffViewerProps } from './common';
import { DiffViewerService } from './diff-viewer-service';

@Domain(CommandContribution, ClientAppContribution)
export class DiffViewerContribution implements CommandContribution, ClientAppContribution {
  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(DiffViewerService)
  protected diffViewerService: DiffViewerService;

  initialize(app: IClientApp): MaybePromise<void> {
    console.log('DiffViewerContribution initialize');
    this.diffViewerProps.onRef({
      openDiffInTab(filePath, oldContent, newContent) {
      },
      closeFile(filePath) {
      },
      onConflictSolved(fn) {},
    });
  }
  registerCommands() {
  }
}

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
  ];
}
