import { CodeModelService } from '@codeblitzjs/ide-code-service';
import {
  ComponentContribution,
  ComponentRegistry,
  getIcon,
} from '@codeblitzjs/ide-core/lib/modules/opensumi__ide-core-browser';
import {
  IMainLayoutService,
  MainLayoutContribution,
} from '@codeblitzjs/ide-core/lib/modules/opensumi__ide-main-layout';
import { Autowired, Injectable, Provider } from '@opensumi/di';
import {
  BrowserModule,
  CommandContribution,
  CommandRegistry,
  CommandService,
  Disposable,
  Domain,
  getLanguageId,
} from '@opensumi/ide-core-browser';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-core-browser/lib/common/container-id';
import { TitlePlaceHolder } from './component';

@Domain(CommandContribution)
export class AlexAppContribution extends Disposable implements CommandContribution {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(CommandService)
  commandService: CommandService;

  private ignoreHash: string | null = null;

  registerCommands(commands: CommandRegistry): void {
    this.addDispose([
      commands.registerCommand(
        { id: 'alex.env.language' },
        {
          execute: () => getLanguageId(),
        },
      ),

      commands.registerCommand(
        { id: 'alex.codeServiceProject' },
        {
          execute: () => {
            const { rootRepository } = this.codeModel;
            return {
              platform: rootRepository.platform,
              project: `${rootRepository.owner}/${rootRepository.name}`,
              projectId: `${rootRepository.owner}%2F${rootRepository.name}`,
              commit: rootRepository.commit,
            };
          },
        },
      ),
    ]);

    const handleHashChange = () => {
      const { hash } = location;
      if (this.ignoreHash === hash) return;
      this.ignoreHash = null;
      this.commandService.executeCommand('code-service.set-line-hash', hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    this.addDispose({
      dispose: () => {
        window.removeEventListener('hashchange', handleHashChange);
      },
    });
  }
}

@Domain(MainLayoutContribution, ComponentContribution)
class StartupContribution implements MainLayoutContribution, ComponentContribution {
  @Autowired(IMainLayoutService)
  private readonly layoutService: IMainLayoutService;

  async onDidRender(): Promise<void> {
    await this.layoutService.viewReady.promise;
    if (process.env.HIDE_LEFT_TABBAR) {
      const leftTabBarHandler = this.layoutService.getTabbarService('left');
      leftTabBarHandler.updateCurrentContainerId('');
      console.log('hide left tabbar by default');
    }
  }
  /**
   * register `explorer` component container
   */
  registerComponent(registry: ComponentRegistry) {
    registry.register('@opensumi/ide-explorer', [], {
      iconClass: getIcon('explorer'),
      title: undefined,
      titleComponent: TitlePlaceHolder,
      priority: 10,
      containerId: EXPLORER_CONTAINER_ID,
      activateKeyBinding: 'ctrlcmd+shift+e',
    });
  }
}

@Injectable()
export class StartupModule extends BrowserModule {
  providers: Provider[] = [AlexAppContribution, StartupContribution];
}
