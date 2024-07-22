import { CodeModelService } from '@codeblitzjs/ide-code-service';
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

@Domain(CommandContribution)
export class AlexAppContribution extends Disposable implements CommandContribution {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(CommandService)
  commandService: CommandService;

  private ticket: number = 0;
  private tickets: number[] = [];
  private ignoreHash: string | null = null;

  registerCommands(commands: CommandRegistry): void {
    // 保持和 api-server 一致
    this.addDispose([
      // codeswing 依赖
      // FIXME: 框架侧支持
      // ...[
      //   'vscode.setEditorLayout',
      // ].map((id) => commands.registerCommand({ id }, { execute: () => {} })),
      commands.registerCommand(
        { id: 'cloudide.command.workspace.getRuntimeConfig' },
        {
          execute: (property: string) => {
            let val: string | undefined;
            try {
              const query = { taskId: '14417925' };
              val = property ? query[property] : query;
            } catch (e) {
              return property ? undefined : {};
            }
            return val;
          },
        },
      ),

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

      commands.registerCommand(
        { id: 'alex.subscribe' },
        {
          execute: () => {
            this.ticket++;
            this.tickets.push(this.ticket);
            return this.ticket;
          },
        },
      ),

      commands.registerCommand(
        { id: 'code-service.replace-browser-url' },
        {
          execute: (path: string) => {
            const fullPath = `/${this.codeModel.rootRepository.platform}${path}`;
            window.history.replaceState(null, '', fullPath);
          },
        },
      ),

      commands.registerCommand(
        { id: 'code-service.replace-browser-url-hash' },
        {
          execute: (hash: string) => {
            if (hash !== location.hash) {
              this.ignoreHash = hash;
              const { href } = window.location;
              const hashIndex = href.indexOf('#');
              const url = hashIndex === -1 ? href : href.slice(0, hashIndex);
              window.location.replace(`${url}${hash}`);
            }
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

@Injectable()
export class StartupModule extends BrowserModule {
  providers: Provider[] = [AlexAppContribution];
}
