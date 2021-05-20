import { Autowired } from '@ali/common-di';
import { CommandRegistry, SlotLocation, ClientAppContribution } from '@ali/ide-core-browser';
import { CommandContribution, Domain } from '@ali/ide-core-common';
import { IMainLayoutService } from '@ali/ide-main-layout';
import { CodePlatform, ICodeAPIProvider } from './common/types';
import { CodeAPIProvider } from './code-api.provider';

@Domain(CommandContribution, ClientAppContribution)
export class CodeAPIContribution implements CommandContribution, ClientAppContribution {
  @Autowired(ICodeAPIProvider)
  codeAPI: CodeAPIProvider;

  @Autowired(IMainLayoutService)
  layoutService: IMainLayoutService;

  registerCommands(registry: CommandRegistry) {
    registry.afterExecuteCommand(`workbench.view.${CodePlatform.github}`, () => {
      this.codeAPI.github.refresh();
    });
  }

  onDidStart() {
    this.layoutService
      .getTabbarService(SlotLocation.left)
      .onCurrentChange(({ currentId, previousId }) => {
        if (previousId !== currentId && currentId === CodePlatform.github) {
          this.codeAPI.github.refresh();
        }
      });
  }
}
