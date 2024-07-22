import { Autowired } from '@opensumi/di';
import {
  ClientAppContribution,
  Domain,
  IStatusBarService,
  localize,
  StatusBarAlignment,
} from '@opensumi/ide-core-browser';
import { Event, IDisposable } from '@opensumi/ide-core-common';
import { CodeModelService } from './code-model.service';

@Domain(ClientAppContribution)
export class StatusbarContribution implements ClientAppContribution {
  @Autowired(IStatusBarService)
  private readonly statusbarService: IStatusBarService;

  @Autowired()
  codeModel: CodeModelService;

  private disposables: IDisposable[] = [];

  initialize() {
    const { rootRepository } = this.codeModel;
    const getRefText = () => rootRepository.headLabel ? `$(git-branch) ${rootRepository.headLabel}` : '';

    this.statusbarService.addElement('code-service', {
      text: getRefText(),
      tooltip: localize('code-service.checkout'),
      alignment: StatusBarAlignment.LEFT,
      command: 'code-service.checkout',
      priority: 10000,
    });

    Event.any(rootRepository.onDidChangeCommit, rootRepository.onDidChangeRefs)(
      () => {
        this.statusbarService.setElement('code-service', {
          text: getRefText(),
        });
      },
      null,
      this.disposables,
    );
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}
